from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
import models, schemas

class DashboardCRUD:
    def create_recipe(self, db: Session, recipe: schemas.RecipeCreate) -> models.Recipes:
        new_recipe = models.Recipes(
            user_id=recipe.user_id,
            image_url=recipe.image_url,
            recipe_name=recipe.recipe_name,
            recipe_price=recipe.recipe_price,
            est_calories=recipe.est_calories,
            created_time=date.today()
        )
        db.add(new_recipe)
        db.commit()
        db.refresh(new_recipe)
        return new_recipe

    def get_recipe(self, db: Session, recipe_id: str) -> Optional[models.Recipes]:
        return db.query(models.Recipes).filter(models.Recipes.id == recipe_id).first()

    def get_recipes(self, db: Session) -> List[models.Recipes]:
        return db.query(models.Recipes).all()

    def delete_recipe(self, db: Session, recipe_id: str) -> bool:
        recipe = db.query(models.Recipes).filter(models.Recipes.id == recipe_id).first()
        if not recipe:
            return False
        db.delete(recipe)
        db.commit()
        return True
    
    def search_recipes(self, db: Session, name: str) -> List[models.Recipes]:
        return db.query(models.Recipes).filter(models.Recipes.recipe_name.ilike(f"%{name}%")).all()
    
dashboard_crud = DashboardCRUD()
