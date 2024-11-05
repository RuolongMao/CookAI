from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
import models, schemas, json
from sqlalchemy import func, Integer, Float, or_


class DashboardCRUD:
    def create_recipe(self, db: Session, recipe: schemas.RecipeCreate) -> models.Recipes:
        new_recipe = models.Recipes(
            user_id=recipe.user_id,
            image_url=recipe.image_url,
            recipe_name=recipe.recipe_name,
            created_time=date.today(), 
            details=recipe.details,
            publish=False
        )
        db.add(new_recipe)
        db.commit()
        db.refresh(new_recipe)
        return new_recipe
    
    def share(self, db: Session, recipe_name: str) -> Optional[models.Recipes]:
        result = db.query(models.Recipes).filter(models.Recipes.recipe_name == recipe_name).first()
        result.publish = not result.publish
        db.commit()
        db.refresh(result)
        return result

    def get_recipe(self, db: Session, recipe_id: str) -> Optional[models.Recipes]:
        return db.query(models.Recipes).filter(models.Recipes.id == recipe_id).first()

    def get_recipes(self, db: Session) -> List[models.Recipes]:
        print("Fetching recipes from database...")
        recipes = db.query(models.Recipes).all()
        print(f"Found {len(recipes)} recipes")
        return recipes
    
    def get_personal_recipes(self, db: Session, user_id: str) -> List[models.Recipes]:
        return db.query(models.Recipes).filter(models.Recipes.user_id == user_id).all()

    def delete_recipe(self, db: Session, recipe_name: str) -> bool:
        recipe = db.query(models.Recipes).filter(models.Recipes.recipe_name == recipe_name).first()
        if not recipe:
            return False
        db.delete(recipe)
        db.commit()
        return True
    
    def search_recipes(self, db: Session, name: str) -> List[models.Recipes]:
        return db.query(models.Recipes).filter(models.Recipes.recipe_name.ilike(f"%{name}%")).all()
    
    def filter_recipes(self, db: Session, est_time_min: Optional[int] = None, est_time_max: Optional[int] = None, est_cost_min: Optional[float] = None, est_cost_max: Optional[float] = None, tastes: Optional[List[str]] = None):
        query = db.query(models.Recipes)

        print("\n=== Filter Parameters ===")
        print(f"Cost Range: {est_cost_min} - {est_cost_max}")
        
        initial_data = query.all()
        print("\n=== Initial Cost Values ===")
        for recipe in initial_data:
            print(f"Recipe: {recipe.recipe_name}")
            cost_value = recipe.details.get('estimated_cost', 'No cost found')
            print(f"Cost value in JSON: {cost_value}")
            # Add type testing
            try:
                numeric_cost = float(cost_value.replace('$', '').strip())
                print(f"Converted cost: {numeric_cost}")
                print(f"Cost data type: {type(numeric_cost).__name__}")  # New line to show data type
            except Exception as e:
                print(f"Conversion error: {e}")
            print('---')

        if est_time_min is not None:
            query = query.filter(func.cast(func.json_extract(models.Recipes.details, '$.estimate_time'), Integer) >= est_time_min)
        if est_time_max is not None:
            query = query.filter(func.cast(func.json_extract(models.Recipes.details, '$.estimate_time'), Integer) <= est_time_max)
        
        # 修改 cost 过滤逻辑
        if est_cost_min is not None:
            print("\n=== Applying Cost Min Filter ===")
            print(f"Min Cost Threshold: {est_cost_min}")
            cost_expr = func.cast(
                func.trim(
                    func.regexp_replace(
                        func.json_extract(models.Recipes.details, '$.estimated_cost'), 
                        '[$]', 
                        ''
                    )
                ),
                Float
            )
            query = query.filter(cost_expr >= est_cost_min)
        
        if est_cost_max is not None:
            print("\n=== Applying Cost Max Filter ===")
            print(f"Max Cost Threshold: {est_cost_max}")
            cost_expr = func.cast(
                func.trim(
                    func.regexp_replace(
                        func.json_extract(models.Recipes.details, '$.estimated_cost'), 
                        '[$]', 
                        ''
                    )
                ),
                Float
            )
            query = query.filter(cost_expr <= est_cost_max)

        if tastes and len(tastes) > 0:
            taste_conditions = [func.json_extract(models.Recipes.details, '$.flavour') == taste for taste in tastes]
            query = query.filter(or_(*taste_conditions))

        result = query.all()
        print("\n=== Filter Results ===")
        print(f"Found {len(result)} recipes after filtering")
        if result:
            print("First filtered recipe cost:", result[0].details.get('estimated_cost', 'No cost found'))
        
        # 打印成功过滤的结果
        for r in result:
            print(f"Filtered Recipe: {r.recipe_name}, Cost: {r.details.get('estimated_cost')}")
        
        return result
    
dashboard_crud = DashboardCRUD()
