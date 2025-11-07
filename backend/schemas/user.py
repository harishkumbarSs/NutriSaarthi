"""User profile schemas"""

from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class UserRegister(BaseModel):
    """Schema for user registration"""
    email: EmailStr
    password: str
    full_name: str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "SecurePassword123!",
                "full_name": "John Doe"
            }
        }


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "SecurePassword123!"
            }
        }


class UserProfileCreate(BaseModel):
    """Schema for creating user profile"""
    age: int
    weight: float  # in kg
    height: float  # in cm
    gender: str  # male, female, other
    activity_level: str  # sedentary, light, moderate, active, very_active
    dietary_preference: Optional[str] = None  # vegetarian, vegan, non-vegetarian, etc.
    health_goals: Optional[str] = None  # weight_loss, muscle_gain, maintenance, etc.
    climate: str = "temperate"  # temperate, hot, cold, tropical

    class Config:
        json_schema_extra = {
            "example": {
                "age": 30,
                "weight": 70,
                "height": 175,
                "gender": "male",
                "activity_level": "moderate",
                "dietary_preference": "vegetarian",
                "health_goals": "weight_loss",
                "climate": "temperate"
            }
        }


class UserProfileResponse(BaseModel):
    """Schema for user profile response"""
    id: str
    email: str
    full_name: str
    age: Optional[int]
    weight: Optional[float]
    height: Optional[float]
    gender: Optional[str]
    activity_level: Optional[str]
    dietary_preference: Optional[str]
    health_goals: Optional[str]
    climate: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    """Schema for user response"""
    id: str
    email: str
    full_name: str
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Schema for token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "user": {
                    "id": "507f1f77bcf86cd799439011",
                    "email": "user@example.com",
                    "full_name": "John Doe",
                    "created_at": "2025-01-01T10:30:00"
                }
            }
        }
