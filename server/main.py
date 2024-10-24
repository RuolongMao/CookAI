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

load_dotenv()

# 设置MySQL连接
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@localhost/cookingai_users")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

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

# User login model
class UserLogin(BaseModel):
    username: str
    password: str

# 注册
@app.post("/register")
async def register_user(user: UserRegister, db: Session = Depends(get_db)):
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

@app.delete("/delete/{recipe_id}")
def delete_recipe(recipe_id: int, db: Session = Depends(get_db)):
    result = dashboard_crud.delete_recipe(db, recipe_id)
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







