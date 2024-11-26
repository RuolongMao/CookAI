from sqlalchemy import Column, Integer, String, Date, JSON, Boolean, Double
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Recipes(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_name = Column(String, nullable=False)
    image_url = Column(String, unique=True, nullable=False)
    recipe_name = Column(String, nullable=False)
    created_time = Column(Date, nullable=False)
    details = Column(JSON, nullable=False)
    est_cost = Column(Double, nullable=False)
    publish = Column(Boolean, nullable=True)
    comments = Column(JSON, nullable=True)
