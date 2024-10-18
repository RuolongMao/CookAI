from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Recipes(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, nullable=False)
    image_url = Column(String, unique=True, nullable=False)
    recipe_name = Column(String, nullable=False)
    recipe_price = Column(Integer, nullable=False)
    est_calories = Column(Integer, nullable=False)
    created_time = Column(Date, nullable=False)
