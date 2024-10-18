from pydantic import BaseModel
from datetime import date

class RecipeBase(BaseModel):
    image_url: str
    recipe_name: str
    recipe_price: int
    est_calories: int

class RecipeCreate(RecipeBase):
    user_id: int

class RecipeGet(RecipeBase):
    id: int
    user_id: int
    created_time: date

class RecipeSearch(BaseModel):
    recipe_name: str
