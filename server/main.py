from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles 
import os
import openai
from dotenv import load_dotenv
# 中间件配置cors，跨域请求配置
from fastapi.middleware.cors import CORSMiddleware
# 数据库配置
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import json
from crud import dashboard_crud
import schemas
from typing import List, Optional
import httpx
import base64
import requests

# Add these imports at the top of main.py
from moviepy.editor import ImageClip, TextClip, AudioFileClip, concatenate_videoclips, CompositeVideoClip
import tempfile
from pathlib import Path
import time
import base64
from io import BytesIO

# Add these imports at the top of main.py
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

#  Vi
from moviepy.config import change_settings

load_dotenv()

# 设置MySQL连接
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@localhost/cookingai_users")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 加载 reCAPTCHA 秘密密钥
RECAPTCHA_SECRET_KEY = os.getenv("RECAPTCHA_SECRET_KEY")

# 用户模型创建
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False)
    password = Column(String(100), nullable=False)

# 用户模型生成表格
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 依赖库安装
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# User registration model
class UserRegister(BaseModel):
    username: str
    password: str
    recaptchaToken: str 

# User login model
class UserLogin(BaseModel):
    username: str
    password: str

# 注册
@app.post("/register")
async def register_user(user: UserRegister, db: Session = Depends(get_db)):
    verification_url = 'https://www.google.com/recaptcha/api/siteverify'
    data = {
        'secret': RECAPTCHA_SECRET_KEY,
        'response': user.recaptchaToken
    }
    async with httpx.AsyncClient() as client:
        captcha_response = await client.post(verification_url, data=data)
        captcha_result = captcha_response.json()

    if not captcha_result.get('success'):
        raise HTTPException(status_code=400, detail="Invalid reCAPTCHA")

    # Check if username exists(验重)
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Create new user （验重通过就创建）
    new_user = User(username=user.username, password=user.password)
    db.add(new_user) # 将新用户添加到会话中
    db.commit() # 提交会话，保存用户，写入到table中
    db.refresh(new_user) #刷新会话，获取最新的用户数据
    return {"message": "User registered successfully"}


# 登录
@app.post("/signin")
async def sign_in(user: UserLogin, db: Session = Depends(get_db)):

    # Check if username exists
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Check if password matches
    if db_user.password != user.password:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return {"message": "Login successful"}


SystemPrompt = '''
Reflect the user's requirement. Especially pay attention to the user's allergen, you could be creative and adapt the common recipe to suit the user's need.
For the flavour field, find the most suitable tag from the following: Sweet, Sour, Salty, Spicy.
To notify the user, for the allergen field, included all suitable tag from the following: Peanut, Milk, Egg, Shellfish, Fish, Soy, Wheat, Sesame, Gluten, Lactose.
Leave allergen as an empty list [] if no allergen is included in the recipe.
For estimated_time, provide one time for the whole process in minutes, ex. 75 minutes.
'''
StructureReminder = '''
Provide the ingredients, including quantity and cost, inlude all units. Also provide detailed steps for the recipe in the following JSON format:
    {
      "recipe_name": "recipe name",
      "nutrition_facts": {
        "calories": "calories, int",
        "fiber": "fiber, int",
        "protein": "protein, int",
        "carbs": "carbs, int",
        "fats": "fats, int",
        "sugar": "sugars, int"
    },
      "ingredients": [
        {"name": "ingredient name", "quantity": "quantity, with unit", "cost": "cost"}
      ],
      "steps": [
        {"explanation": "explanation for this step", "instruction": "step instruction"}
      ],
      "estimated_cost": "total estimated cost",
      "estimate_time": "total estimated time",
      "flavour": "flavour",
      "allergen": "list of allergens"
    }   
'''

''' !! Make sure there is always Unit for Ingredients part !!!
    !! Make sure there is no Unit for any Nutrition items!!!
    !! I don't need any space between unit and number'''

# 加载 OpenAI API 密钥
if not hasattr(openai, '__version__'):
    # Newer version
    openai.api_key = os.getenv("OPENAI_API_KEY")
else:
    # Older version - for illustrative purposes only, as specific syntax might vary
    client = openai.Client(api_key=os.getenv("OPENAI_API_KEY"))

# 定义结构化输出
class Ingredient(BaseModel):
    name: str
    quantity: str
    cost: str

class Step(BaseModel):
    explanation: str
    instruction: str


class NutritionFacts(BaseModel):
    calories: int
    fiber: int
    protein: int
    carbs: int
    fats: int
    sugar: int

class RecipeOutput(BaseModel):
    recipe_name: str
    nutrition_facts: NutritionFacts
    ingredients: list[Ingredient]
    steps: list[Step]
    estimated_cost: str
    estimate_time: str
    flavour: str
    allergen: Optional[list[str]]
    

class QueryRequest(BaseModel):
    prompt: str

class QueryResponse(BaseModel):
    response: RecipeOutput 
    image_url: str 

# AI 对话端点
@app.post("/query", response_model=QueryResponse)
async def query_openai(request: QueryRequest):
    try:
        if not hasattr(openai, '__version__'):
            
            completion = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                 messages=[
                {"role": "system", "content": "You are a helpful assistant that generates cooking recipes."},
                {"role": "user", "content": request.prompt + SystemPrompt + StructureReminder}
                ]   
            )
            response_content = completion.choices[0].message["content"]
            response_data = json.loads(response_content)
            response_data = RecipeOutput(**response_data)
            
        else:
            completion = client.beta.chat.completions.parse(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that generates cooking recipes."},
                    {"role": "user", "content": request.prompt + SystemPrompt}
                ],
                response_format=RecipeOutput
            )

            response_data = completion.choices[0].message.parsed
            
        try:
            if not hasattr(openai, '__version__'):
                image_response = openai.Image.create(
                    model="dall-e-2",
                    prompt=request.prompt,
                    n=1,
                    size="1024x1024",
                    quality="standard",
                )
                image_url = image_response['data'][0]['url']
            else:
                image_response = client.images.generate(
                    model="dall-e-2",
                    prompt=request.prompt,
                    size="1024x1024",
                    quality="standard",
                    n=1,
                )
                image_url = image_response.data[0].url


        except Exception as e:
            print("Image generation error:", e)
            image_url = ""

        # 在后端打印结果监测
        print("success print", response_data)
        # response = requests.get(image_url)
        # base64_img = base64.b64encode(response.content).decode('utf-8')
        # result_img = "data:image/jpeg;base64," + base64_img

        # 返回 AI 的响应
        return QueryResponse(response=response_data, image_url=image_url)
        
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

# recipe dashboard
@app.post("/create")
def create_recipe(recipe: schemas.RecipeCreate, db: Session = Depends(get_db)):
    return dashboard_crud.create_recipe(db, recipe)

@app.post("/delete")
def delete_recipe(recipe: schemas.RecipeDelete, db: Session = Depends(get_db)):
    result = dashboard_crud.delete_recipe(db, recipe.recipe_name)
    if result:
        return {"message": "Recipe deletion succeeded!"}
    else:
        return {"message": "Recipe deletion failed."}

@app.post("/search")
def search_recipes(query: schemas.RecipeSearch, db: Session = Depends(get_db)):
    return dashboard_crud.search_recipes(db, query.recipe_name)

@app.get("/get", response_model=List[schemas.RecipeGet])
def read_recipes(db: Session = Depends(get_db)):
    recipes = dashboard_crud.get_recipes(db)
    return recipes

@app.post("/filter")
def filter_recipes(query: schemas.RecipeFilter, db: Session = Depends(get_db)):
    recipes = dashboard_crud.filter_recipes(
        db, 
        est_time_min=query.est_time_min, 
        est_time_max=query.est_time_max,
        est_cost_min=query.est_cost_min, 
        est_cost_max=query.est_cost_max,
        calories_min=query.calories_min,      
        calories_max=query.calories_max, 
        tastes=query.tastes
    )
    return recipes
        

@app.post("/dashboard")
def search_recipes(query: schemas.PersonalRecipeSearch, db: Session = Depends(get_db)):
    return dashboard_crud.get_personal_recipes(db, query.user_name)

@app.post("/share")
def is_share(body: schemas.RecipeDelete, db: Session = Depends(get_db)):
    return dashboard_crud.share(db, body.recipe_name)


if os.name == 'nt':  # for Windows
    change_settings({"FFMPEG_BINARY": "ffmpeg.exe"})
else:  # for Unix-like systems
    change_settings({"FFMPEG_BINARY": "ffmpeg"})

# Add these new model classes
class Scene(BaseModel):
    voiceover: str
    image_prompt: str
    image_url: Optional[str]

class Scenes(BaseModel):
    scenes: List[Scene]

class VideoRequest(BaseModel):
    recipe_steps: List[dict]
    
class VideoResponse(BaseModel):
    video_data: str  # Base64 encoded video data
    content_type: str = "video/mp4"
    
IMAGEMAGICK_BINARY = os.getenv('IMAGEMAGICK_BINARY', 'convert')
change_settings({"IMAGEMAGICK_BINARY": IMAGEMAGICK_BINARY})

# You can verify ImageMagick installation by running:
if os.system('which convert') != 0:
    raise RuntimeError("ImageMagick not found. Please install it using 'brew install imagemagick'")

# Add this utility function
def add_line_breaks(text: str, fontsize: int, video_width: int) -> str:
    """Adds line breaks to text based on font size and video width."""
    words = text.split()
    lines = []
    current_line = ""
    
    for word in words:
        test_line = current_line + " " + word if current_line else word
        test_clip = TextClip(test_line, fontsize=fontsize, font='Helvetica-Bold')
        if test_clip.w > video_width:
            lines.append(current_line)
            current_line = word
        else:
            current_line = test_line
    
    if current_line:
        lines.append(current_line)
    
    return "\n".join(lines)

@app.post("/generate_video", response_model=VideoResponse)
async def generate_video(request: VideoRequest):
    try:
        # Create prompt for scene generation
        instruction = '''You are the director of a cooking tutorial video.
        Using the provided recipe steps, create a list of scenes, each including a voiceover script
        to guide viewers through the cooking process and a detailed description of the visual shot
        for each scene. The voiceover should be enthusiastic and friendly.
        Leave the image_url as None, they will be injected later.'''
        
        prompt = ""
        for i, step in enumerate(request.recipe_steps, start=1):
            prompt += f"Step {i}: {step['explanation']}\nInstruction: {step['instruction']}\n\n"

        if not hasattr(openai, '__version__'):
            completion = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": instruction},
                    {"role": "user", "content": prompt}
                ]
            )
            scenes_data = json.loads(completion.choices[0].message["content"])
            scenes = Scenes(**scenes_data)
        else:
            completion = client.beta.chat.completions.parse(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": instruction},
                    {"role": "user", "content": prompt}
                ],
                response_format=Scenes
            )
            scenes = completion.choices[0].message.parsed

        # Generate images and audio for each scene
        clips = []
        temp_files = []  # Track temporary files for cleanup

        for scene in scenes.scenes[:2]:
            try:
                # Generate image using DALL-E
                if not hasattr(openai, '__version__'):
                    image_response = openai.Image.create(
                        model="dall-e-2",
                        prompt=f"In a modern kitchen setting, be realistic. Focus on the food and operation. {scene.image_prompt}",
                        size="1024x1024",
                        quality="standard",
                        n=1
                    )
                    scene.image_url = image_response['data'][0]['url']
                    
                    # Generate audio using TTS
                    audio_response = openai.Audio.create(
                        model="tts-1",
                        voice="alloy",
                        input=scene.voiceover
                    )
                    audio_content = audio_response.content
                else:
                    image_response = client.images.generate(
                        model="dall-e-3",
                        prompt=f"In a modern kitchen setting, be realistic. Focus on the food and operation. {scene.image_prompt}",
                        size="1792x1024",
                        quality="standard",
                        n=1,
                    )
                    scene.image_url = image_response.data[0].url
                    
                    audio_response = client.audio.speech.create(
                        model="tts-1",
                        voice="alloy",
                        input=scene.voiceover
                    )
                    audio_content = audio_response.content

                # Create temporary audio file
                with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as temp_audio:
                    temp_audio.write(audio_content)
                    temp_audio_path = temp_audio.name
                    temp_files.append(temp_audio_path)

                # Create audio clip from temporary file
                audio_clip = AudioFileClip(temp_audio_path)
                duration = audio_clip.duration

                # Create image clip
                image_clip = ImageClip(scene.image_url, duration=duration)
                
                # Add text overlay
                narration = add_line_breaks(
                    scene.voiceover, 
                    fontsize=64, 
                    video_width=(image_clip.w-50)
                )
                
                text_clip = (TextClip(narration, 
                                    fontsize=64, 
                                    color='white', 
                                    font='Helvetica-Bold',
                                    stroke_color='black',
                                    stroke_width=1)
                            .set_position(("center", 1100))
                            .set_duration(duration))

                # Combine clips
                video_clip = CompositeVideoClip([image_clip, text_clip])
                video_clip = video_clip.set_audio(audio_clip)
                clips.append(video_clip)

            except Exception as scene_error:
                print(f"Error processing scene: {scene_error}")
                raise HTTPException(status_code=500, detail=f"Error processing scene: {str(scene_error)}")

        try:
            # Create final video
            final_video = concatenate_videoclips(clips, method="compose")
            
            # Create temporary output file
            with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as temp_video:
                temp_video_path = temp_video.name
                temp_files.append(temp_video_path)
                
                # Write video to temporary file
                final_video.write_videofile(
                    temp_video_path,
                    fps=24,
                    codec="libx264",
                    audio_codec="aac",
                    preset='ultrafast',
                    ffmpeg_params=["-movflags", "faststart"]
                )

                # Read the video file and convert to base64
                with open(temp_video_path, 'rb') as video_file:
                    video_data = base64.b64encode(video_file.read()).decode('utf-8')

        finally:
            # Clean up resources
            final_video.close()
            for clip in clips:
                clip.close()
            
            # Delete temporary files
            for temp_file in temp_files:
                try:
                    os.unlink(temp_file)
                except Exception as cleanup_error:
                    print(f"Error cleaning up temporary file {temp_file}: {cleanup_error}")
 
        return VideoResponse(video_data=video_data)

    except Exception as e:
        print(f"General error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/test_video_local", response_model=VideoResponse)
async def test_video_local():
    try:
        # Read the video file and convert to base64
        with open("./static/videos/download.mp4", 'rb') as video_file:
            video_data = base64.b64encode(video_file.read()).decode('utf-8')
        
        return VideoResponse(video_data=video_data)

    except Exception as e:
        print(f"Error processing local video: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
# Add these new model classes
class YoutubeVideoRequest(BaseModel):
    recipe_name: str

class YoutubeVideo(BaseModel):
    videoId: str
    title: str
    description: str
    thumbnail: str
    channelTitle: str

class YoutubeVideoResponse(BaseModel):
    videos: List[YoutubeVideo]

# Add this new endpoint
@app.post("/search_youtube", response_model=YoutubeVideoResponse)
async def search_youtube(request: YoutubeVideoRequest):
    try:
        # Get your YouTube API key from environment variable
        youtube_api_key = os.getenv("YOUTUBE_API_KEY")
        if not youtube_api_key:
            raise HTTPException(status_code=500, detail="YouTube API key not configured")

        # Create YouTube API client
        youtube = build('youtube', 'v3', developerKey=youtube_api_key)

        # Search for videos
        search_response = youtube.search().list(
            q=f"how to make {request.recipe_name}",
            part='snippet',
            maxResults=4,
            type='video',
            relevanceLanguage='en',
            videoCategoryId='26'  # How-to & Style category
        ).execute()

        # Process the results
        videos = []
        for item in search_response.get('items', []):
            video = YoutubeVideo(
                videoId=item['id']['videoId'],
                title=item['snippet']['title'],
                description=item['snippet']['description'],
                thumbnail=item['snippet']['thumbnails']['high']['url'],
                channelTitle=item['snippet']['channelTitle']
            )
            videos.append(video)
        
        print(videos)

        return YoutubeVideoResponse(videos=videos)

    except HttpError as e:
        print(f"YouTube API error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch YouTube videos")
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    

