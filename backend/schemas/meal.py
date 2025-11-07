"""Meal logging schemas"""

from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class MealItemCreate(BaseModel):
    """Schema for meal item"""
    food_name: str
    quantity: float
    unit: str
    calories: float
    protein: float
    fat: float
    carbs: float


class MealCreate(BaseModel):
    """Schema for creating meal entry"""
    meal_type: str  # breakfast, lunch, dinner, snack
    items: List[MealItemCreate]
    notes: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "meal_type": "lunch",
                "items": [
                    {
                        "food_name": "Rice",
                        "quantity": 1,
                        "unit": "cup",
                        "calories": 206,
                        "protein": 4.3,
                        "fat": 0.5,
                        "carbs": 45
                    }
                ],
                "notes": "Regular lunch"
            }
        }


class MealResponse(BaseModel):
    """Schema for meal response"""
    id: str
    user_id: str
    meal_type: str
    items: List[MealItemCreate]
    notes: Optional[str]
    total_calories: float
    total_protein: float
    total_fat: float
    total_carbs: float
    created_at: datetime

    class Config:
        from_attributes = True
