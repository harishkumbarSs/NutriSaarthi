"""Dashboard Routes"""
from fastapi import APIRouter, Depends, Query
from bson import ObjectId
from datetime import date, timedelta, datetime
from typing import Optional
from pydantic import BaseModel

from db.connection import get_db
from routes.auth import get_current_user
from services.nutrition_chatbot_new import nutrition_bot

router = APIRouter()


def date_to_string(d: date) -> str:
    """Convert date to ISO format string for MongoDB"""
    return d.isoformat()


def string_to_date(s: str) -> date:
    """Convert ISO format string to date"""
    if isinstance(s, date):
        return s
    if isinstance(s, str):
        # Handle ISO format date string (YYYY-MM-DD)
        return datetime.fromisoformat(s).date()
    # Fallback: try to convert if it's something else
    return date.fromisoformat(str(s))


class DashboardStats(BaseModel):
    """Dashboard statistics response"""
    # Daily stats
    today_calories: float
    today_protein: float
    today_fat: float
    today_carbs: float
    today_water_ml: int
    calorie_goal: float
    water_goal_ml: int
    
    # Weekly stats
    weekly_calories: list
    weekly_dates: list


class CoachingTip(BaseModel):
    """Coaching tip response"""
    tip: str
    meal_context: str
    generated_at: str


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    current_user: dict = Depends(get_current_user)
):
    """Get dashboard statistics"""
    db = get_db()
    user_id = ObjectId(current_user["id"])
    today = date.today()
    
    # Calculate calorie goal based on user profile (simplified BMR calculation)
    # This is a basic calculation - in production, use more sophisticated formulas
    user_weight = current_user.get("weight", 70)  # Default 70kg
    user_height = current_user.get("height", 170)  # Default 170cm
    user_age = current_user.get("age", 30)  # Default 30 years
    user_gender = current_user.get("gender", "male")
    activity_level = current_user.get("activity_level", "moderate")
    
    # BMR calculation (Mifflin-St Jeor Equation)
    if user_gender == "male":
        bmr = 10 * user_weight + 6.25 * user_height - 5 * user_age + 5
    else:
        bmr = 10 * user_weight + 6.25 * user_height - 5 * user_age - 161
    
    # Activity multipliers
    activity_multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9
    }
    
    tdee = bmr * activity_multipliers.get(activity_level, 1.55)
    
    # Adjust for goal
    goal = current_user.get("goal", "maintain")
    if goal == "weight_loss":
        calorie_goal = tdee - 500  # 500 calorie deficit
    elif goal == "weight_gain":
        calorie_goal = tdee + 500  # 500 calorie surplus
    else:
        calorie_goal = tdee  # Maintain
    
    # Water goal (simplified: 30ml per kg body weight)
    water_goal_ml = int(user_weight * 30)
    
    # Get today's meals
    today_str = date_to_string(today)
    today_meals = list(db.meal_logs.find({
        "user_id": user_id,
        "date": today_str
    }))
    
    today_calories = sum(meal["calories"] for meal in today_meals)
    today_protein = sum(meal["protein"] for meal in today_meals)
    today_fat = sum(meal["fat"] for meal in today_meals)
    today_carbs = sum(meal["carbs"] for meal in today_meals)
    
    # Get today's water intake
    today_water = db.water_intake.find_one({
        "user_id": user_id,
        "date": today_str
    })
    today_water_ml = today_water["water_ml"] if today_water else 0
    
    # Get weekly stats (last 7 days)
    week_start = today - timedelta(days=6)
    week_start_str = date_to_string(week_start)
    weekly_meals = list(db.meal_logs.find({
        "user_id": user_id,
        "date": {"$gte": week_start_str, "$lte": today_str}
    }))
    
    # Group by date
    weekly_data = {}
    for meal in weekly_meals:
        meal_date_str = meal["date"]
        if meal_date_str not in weekly_data:
            weekly_data[meal_date_str] = 0
        weekly_data[meal_date_str] += meal["calories"]
    
    # Fill missing dates with 0
    weekly_calories = []
    weekly_dates = []
    for i in range(7):
        current_date = week_start + timedelta(days=i)
        current_date_str = date_to_string(current_date)
        weekly_dates.append(current_date_str)
        weekly_calories.append(weekly_data.get(current_date_str, 0))
    
    return DashboardStats(
        today_calories=today_calories,
        today_protein=today_protein,
        today_fat=today_fat,
        today_carbs=today_carbs,
        today_water_ml=today_water_ml,
        calorie_goal=calorie_goal,
        water_goal_ml=water_goal_ml,
        weekly_calories=weekly_calories,
        weekly_dates=weekly_dates
    )


@router.get("/tip", response_model=CoachingTip)
async def get_coaching_tip(current_user: dict = Depends(get_current_user)):
    """
    Get a personalized micro-coaching tip based on latest meal and user goal
    Uses AI to generate hyper-specific, actionable advice (15 words max)
    """
    db = get_db()
    user_id = ObjectId(current_user["id"])
    
    # Get latest meal (most recent)
    latest_meal = db.meal_logs.find_one(
        {"user_id": user_id},
        sort=[("date", -1), ("_id", -1)]
    )
    
    # Default tip if no meals logged
    if not latest_meal:
        user_goal = current_user.get("goal", "maintain")
        context = f"No meals logged yet | Goal: {user_goal}"
        tip = "Start logging your meals to get personalized nutrition tips!"
        return CoachingTip(
            tip=tip,
            meal_context=context,
            generated_at=datetime.utcnow().isoformat()
        )
    
    # Get user context
    user_name = current_user.get("name", "User")
    user_goal = current_user.get("goal", "maintain")
    user_weight = current_user.get("weight", 70)
    activity_level = current_user.get("activity_level", "moderate")
    dietary_pref = current_user.get("dietary_preference", "veg")
    
    # Format meal context
    meal_context = (
        f"Latest: {latest_meal['food_item']} ({latest_meal['calories']:.0f}cal, "
        f"{latest_meal['protein']:.1f}g protein) | Goal: {user_goal}"
    )
    
    # Create AI prompt
    prompt = (
        f"User ate {latest_meal['food_item']} with {latest_meal['calories']:.0f} calories "
        f"and {latest_meal['protein']:.1f}g protein. Their goal is {user_goal}. "
        f"Give ONE actionable next-meal tip in 15 words max."
    )
    
    # Get AI-generated tip
    try:
        user_context_for_ai = {
            "name": user_name,
            "goal": user_goal,
            "weight": user_weight,
            "activity_level": activity_level,
            "dietary_preference": dietary_pref,
        }
        
        # Call nutrition bot with the prompt
        ai_tip = nutrition_bot.get_response(prompt, user_context_for_ai)
        
        # Truncate to 15 words if needed
        words = ai_tip.split()
        if len(words) > 15:
            ai_tip = " ".join(words[:15]) + "..."
            
    except Exception as e:
        # Fallback tip if AI fails
        ai_tip = "Eat more protein-rich foods for better satiety and muscle recovery!"
    
    return CoachingTip(
        tip=ai_tip,
        meal_context=meal_context,
        generated_at=datetime.utcnow().isoformat()
    )

