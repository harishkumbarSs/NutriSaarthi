"""Water intake tracking schemas"""

from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional


class WaterIntakeCreate(BaseModel):
    """Schema for creating water intake entry"""
    water_ml: int  # Amount of water in milliliters
    date: Optional[date] = None  # Date of water intake (defaults to today)

    class Config:
        json_schema_extra = {
            "example": {
                "water_ml": 250,
                "date": "2025-01-01"
            }
        }


class WaterIntakeResponse(BaseModel):
    """Schema for water intake response"""
    id: str
    user_id: str
    date: date
    water_ml: int
    created_at: datetime

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "user_id": "507f1f77bcf86cd799439012",
                "date": "2025-01-01",
                "water_ml": 1500,
                "created_at": "2025-01-01T10:30:00"
            }
        }
