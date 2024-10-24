from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
import models, schemas, json
from sqlalchemy import func, Integer, Float

class DashboardCRUD:
    def create_recipe(self, db: Session, recipe: schemas.RecipeCreate) -> models.Recipes:
        new_recipe = models.Recipes(
            user_id=recipe.user_id,
            image_url=recipe.image_url,
            recipe_name=recipe.recipe_name,
            created_time=date.today(), 
            details=recipe.details
        )
        db.add(new_recipe)
        db.commit()
        db.refresh(new_recipe)
        return new_recipe

    def get_recipe(self, db: Session, recipe_id: str) -> Optional[models.Recipes]:
        return db.query(models.Recipes).filter(models.Recipes.id == recipe_id).first()

    def get_recipes(self, db: Session) -> List[models.Recipes]:
        return db.query(models.Recipes).all()
    
    def get_personal_recipes(self, db: Session, user_id: str) -> List[models.Recipes]:
        return db.query(models.Recipes).filter(models.Recipes.user_id == user_id).all()

    def delete_recipe(self, db: Session, recipe_id: str) -> bool:
        recipe = db.query(models.Recipes).filter(models.Recipes.id == recipe_id).first()
        if not recipe:
            return False
        db.delete(recipe)
        db.commit()
        return True
    
    def search_recipes(self, db: Session, name: str) -> List[models.Recipes]:
        return db.query(models.Recipes).filter(models.Recipes.recipe_name.ilike(f"%{name}%")).all()
    
    def filter_recipes(self, db: Session, est_time_min: Optional[int] = None, est_time_max: Optional[int] = None,  est_cost_min: Optional[float] = None, est_cost_max: Optional[float] = None, cal_min: Optional[int] = None, cal_max: Optional[int] = None):
        query = db.query(models.Recipes)
        if est_time_min is not None:
            query = query.filter(func.cast(func.json_extract(models.Recipes.details, '$.estimate_time'), Integer) >= est_time_min)
        if est_time_max is not None:
            query = query.filter(func.cast(func.json_extract(models.Recipes.details, '$.estimate_time'), Integer) <= est_time_max)

        if est_cost_min is not None:
            query = query.filter(func.cast(func.json_extract(models.Recipes.details, '$.estimated_cost'), Float) >= est_cost_min)
        if est_cost_max is not None:
            query = query.filter(func.cast(func.json_extract(models.Recipes.details, '$.estimated_cost'), Float) <= est_cost_max)

        if cal_min is not None:
            query = query.filter(func.cast(func.json_extract(models.Recipes.details, '$.nutrition_facts.calories'), Integer) >= cal_min)
        if cal_max is not None:
            query = query.filter(func.cast(func.json_extract(models.Recipes.details, '$.nutrition_facts.calories'), Integer) <= cal_max)
        return query.all()
    
dashboard_crud = DashboardCRUD()
