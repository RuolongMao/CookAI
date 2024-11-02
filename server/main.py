from fastapi import FastAPI, HTTPException, Depends 
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
from typing import List
import httpx

# Add these imports at the top of main.py
from moviepy.editor import ImageClip, TextClip, AudioFileClip, concatenate_videoclips, CompositeVideoClip
import tempfile
from pathlib import Path

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



# 加载 OpenAI API 密钥
openai.api_key = os.getenv("OPENAI_API_KEY")


# 定义结构化输出
class Ingredient(BaseModel):
    name: str
    quantity: str
    cost: str

class Step(BaseModel):
    explanation: str
    instruction: str


class NutritionFacts(BaseModel):
    calories: str
    fiber: str
    protein: str
    carbs: str
    fats: str
    sugar: str

class RecipeOutput(BaseModel):
    recipe_name: str
    nutrition_facts: NutritionFacts
    ingredients: list[Ingredient]
    steps: list[Step]
    estimated_cost: str
    estimate_time: str

class QueryRequest(BaseModel):
    prompt: str

class QueryResponse(BaseModel):
    response: RecipeOutput 
    image_url: str 

# AI 对话端点
@app.post("/query", response_model=QueryResponse)
async def query_openai(request: QueryRequest):
    try:
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that generates cooking recipes."},
                {"role": "user", "content": request.prompt}
            ]
        )

        response_content = completion.choices[0].message["content"]
        response_data = json.loads(response_content)


        try:
            image_response = openai.Image.create(
                model="dall-e-2",
                prompt=request.prompt,
                n=1,
                size="1024x1024",
                quality="standard",
            )
            image_url = image_response['data'][0]['url']

        except Exception as e:
            print("Image generation error:", e)
            image_url = None


        # 在后端打印结果监测
        print("success print", response_data)



        # 返回 AI 的响应
        return QueryResponse(response=RecipeOutput(**response_data), image_url=image_url)
    except Exception as e:
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
        cal_min=query.cal_min,
        cal_max=query.cal_max
    )
    return recipes

@app.post("/dashboard")
def search_recipes(query: schemas.PersonalRecipeSearch, db: Session = Depends(get_db)):
    return dashboard_crud.get_personal_recipes(db, query.user_id)

# Add these new model classes
class Scene(BaseModel):
    voiceover: str
    image_prompt: str
    image_url: str = ""  # Will be populated later
    audio_path: str = ""  # Will be populated later

class Scenes(BaseModel):
    scenes: List[Scene]

class VideoRequest(BaseModel):
    recipe_steps: List[dict]

class VideoResponse(BaseModel):
    video_url: str

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

# Add this endpoint to generate videos
@app.post("/generate_video", response_model=VideoResponse)
async def generate_video(request: VideoRequest):
    try:
        # Create video directory if it doesn't exist
        video_dir = Path("static/videos")
        video_dir.mkdir(parents=True, exist_ok=True)
        
        # Generate unique filename
        video_filename = f"cooking_tutorial_{int(time.time())}.mp4"
        video_path = video_dir / video_filename
        
        # Create prompt for scene generation
        instruction = '''You are the director of a cooking tutorial video.
        Using the provided recipe steps, create a list of scenes, each including a voiceover script
        to guide viewers through the cooking process and a detailed description of the visual shot
        for each scene. The voiceover should be enthusiastic and friendly.'''
        
        prompt = ""
        for i, step in enumerate(request.recipe_steps, start=1):
            prompt += f"Step {i}: {step['explanation']}\nInstruction: {step['instruction']}\n\n"

        # Generate scenes using OpenAI
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": instruction},
                {"role": "user", "content": prompt}
            ]
        )
        
        scenes_data = json.loads(completion.choices[0].message["content"])
        scenes = Scenes(**scenes_data)

        # Generate images and audio for each scene
        clips = []
        for scene in scenes.scenes:
            # Generate image using DALL-E
            image_response = openai.Image.create(
                model="dall-e-2",
                prompt=f"In a modern kitchen setting, be realistic. Focus on the food and operation. {scene.image_prompt}",
                size="1024x1024",
                quality="standard",
                n=1
            )
            scene.image_url = image_response.data[0].url

            # Generate audio using TTS
            audio_response = openai.Audio.create(
                model="tts-1",
                voice="alloy",
                input=scene.voiceover
            )
            
            # Save audio to temporary file
            with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as f:
                f.write(audio_response.content)
                scene.audio_path = f.name

            # Create video clip
            audio_clip = AudioFileClip(scene.audio_path)
            duration = audio_clip.duration
            
            # Download and create image clip
            image_clip = ImageClip(scene.image_url, duration=duration)
            
            # Create text overlay
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

            # Combine elements
            video_clip = CompositeVideoClip([image_clip, text_clip])
            video_clip = video_clip.set_audio(audio_clip)
            clips.append(video_clip)

            # Cleanup temporary audio file
            os.unlink(scene.audio_path)

        # Create final video
        final_video = concatenate_videoclips(clips, method="compose")
        final_video.write_videofile(
            str(video_path),
            fps=24,
            temp_audiofile='temp-audio.m4a',
            remove_temp=True,
            codec="libx264",
            audio_codec="aac"
        )

        # Return video URL
        return VideoResponse(video_url=f"/static/videos/{video_filename}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))