from pydantic import BaseModel
from datetime import date
from typing import Optional

class RecipeBase(BaseModel):
    image_url: str
    recipe_name: str
    details: dict

class RecipeCreate(RecipeBase):
    user_id: int

class RecipeGet(RecipeBase):
    id: int
    user_id: int
    created_time: date

class RecipeSearch(BaseModel):
    recipe_name: str

class RecipeFilter(BaseModel):
    est_time_min: Optional[int] = None
    est_time_max: Optional[int] = None
    est_cost_min: Optional[float] = None
    est_cost_max: Optional[float] = None
    cal_min: Optional[int] = None
    cal_max: Optional[int] = None

class PersonalRecipeSearch(BaseModel):
    user_id: int
