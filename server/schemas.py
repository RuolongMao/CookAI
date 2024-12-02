from typing import List, Optional
from pydantic import BaseModel
from datetime import date
from typing import Optional

class RecipeBase(BaseModel):
    image_url: str
    recipe_name: str
    details: dict

class RecipeCreate(RecipeBase):
    user_name: str
    est_cost: float

class RecipeGet(RecipeBase):
    id: int
    user_name: str
    created_time: date
    comments: Optional[dict] = None

class RecipeSearch(BaseModel):
    recipe_name: str

class RecipeFilter(BaseModel):
    est_time_min: Optional[int] = None
    est_time_max: Optional[int] = None
    est_cost_min: Optional[float] = None
    est_cost_max: Optional[float] = None
    calories_min: Optional[int] = None  # Added this line
    calories_max: Optional[int] = None  # Added this line
    tastes: Optional[List[str]] = None

class PersonalRecipeSearch(BaseModel):
    user_name: str

class RecipeDelete(BaseModel):
    recipe_name: str

class CommentAdd(BaseModel):
    recipe_name: str
    username: str
    comments: str
