"""AI Routes - Powered by Specialized Nutrition Chatbot"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Optional
import os
from datetime import date
from bson import ObjectId

from routes.auth import get_current_user
from services.ai import parse_meal_text
from services.nutrition_chatbot_new import nutrition_bot
from db.connection import get_db

router = APIRouter()


class ParseMealRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Free-text meal description")


class ParsedMealItem(BaseModel):
    food_item: str
    quantity: float
    unit: str
    calories: float
    protein: float
    fat: float
    carbs: float


class ParseMealResponse(BaseModel):
    items: List[ParsedMealItem]


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    question: Optional[str] = None


class CoachResponse(BaseModel):
    reply: str
    model: str = "mixtral-8x7b-32768"


@router.post("/parse-meal", response_model=ParseMealResponse)
async def parse_meal(req: ParseMealRequest, current_user: dict = Depends(get_current_user)):
    items = parse_meal_text(req.text)
    return ParseMealResponse(items=[ParsedMealItem(**item.__dict__) for item in items])


@router.post("/coach", response_model=CoachResponse)
async def coach(req: ChatRequest, current_user: dict = Depends(get_current_user)):
    """
    AI Nutrition Coach - Specialized chatbot for Indian nutrition
    Trained responses without external API dependency
    """
    
    try:
        # Get user info for context
        user_name = current_user.get("name", "User")
        user_goal = current_user.get("goal", "maintain")
        user_weight = current_user.get("weight", 70)
        user_age = current_user.get("age", 30)
        user_gender = current_user.get("gender", "male")
        activity_level = current_user.get("activity_level", "moderate")
        dietary_pref = current_user.get("dietary_preference", "veg")
        
        # Get today's progress
        db = get_db()
        user_id = ObjectId(current_user["id"])
        today = date.today().isoformat()
        
        today_meals = list(db.meal_logs.find({
            "user_id": user_id,
            "date": today
        }))
        today_calories = sum(meal.get("calories", 0) for meal in today_meals)
        
        today_water_doc = db.water_intake.find_one({
            "user_id": user_id,
            "date": today
        })
        today_water = today_water_doc.get("water_ml", 0) if today_water_doc else 0
        
        # User context for personalization
        user_context = {
            "name": user_name,
            "goal": user_goal,
            "weight": user_weight,
            "age": user_age,
            "gender": user_gender,
            "activity_level": activity_level,
            "dietary_preference": dietary_pref,
            "today_calories": today_calories,
            "today_water": today_water
        }
        
        # Get question from either messages or question field
        question = req.question
        if not question and req.messages:
            question = req.messages[-1].content if req.messages else "How can you help me?"
        
        if not question:
            question = "Tell me about nutrition"
        
        # Get response from specialized nutrition chatbot
        reply = nutrition_bot.get_response(question, user_context)
        
        return CoachResponse(
            reply=reply,
            model="NutriCoach-Local"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """Check if Nutrition Chatbot service is running"""
    try:
        return {
            "status": "healthy",
            "service": "NutriCoach",
            "model": "NutriCoach-Local",
            "version": "1.0",
            "message": "Specialized nutrition chatbot ready!",
            "capabilities": [
                "Indian nutrition advice",
                "Weight loss/gain guidance",
                "Meal planning",
                "Exercise nutrition",
                "Health conditions",
                "Food alternatives"
            ]
        }
    except Exception as e:
        return {
            "status": "error",
            "service": "NutriCoach",
            "error": str(e)
        }



