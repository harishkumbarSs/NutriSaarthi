from fastapi import APIRouter, Depends, HTTPException, status, Query
from bson import ObjectId
from datetime import datetime, date, timedelta
from typing import List, Optional
from pydantic import BaseModel

from db.connection import get_db
from schemas.water import WaterIntakeCreate, WaterIntakeResponse
from routes.auth import get_current_user

router = APIRouter()


def date_to_string(d: date) -> str:
    """Convert date to ISO format string for MongoDB"""
    return d.isoformat()


def string_to_date(s: str) -> date:
    """Convert ISO format string to date"""
    if isinstance(s, date):
        return s
    if isinstance(s, str):
        try:
            # Handle ISO format date string (YYYY-MM-DD)
            return datetime.fromisoformat(s).date()
        except ValueError:
            # Fallback to date.fromisoformat
            return date.fromisoformat(s)
    # Fallback: try to convert if it's something else
    return date.fromisoformat(str(s))


def calculate_dynamic_water_goal(user: dict) -> int:
    """
    Calculate intelligent water goal based on user profile
    Formula: Base (weight_kg * 35ml) + Activity Adjustment + Climate Adjustment
    
    Returns: Daily water goal in milliliters
    """
    weight = user.get("weight", 70)  # Default 70kg
    activity_level = user.get("activity_level", "moderate").lower()
    climate = user.get("climate", "temperate").lower()  # temperate, hot, cold
    
    # Base: 35ml per kg of body weight
    base_goal = int(weight * 35)
    
    # Activity adjustment
    activity_adjustments = {
        "sedentary": 0,        # No additional water
        "light": 250,          # +250ml (light walking, desk job)
        "moderate": 500,       # +500ml (regular exercise, active job)
        "active": 750,         # +750ml (daily gym, sports)
        "very_active": 1000    # +1000ml (intense training, athletic)
    }
    activity_boost = activity_adjustments.get(activity_level, 500)
    
    # Climate adjustment
    climate_adjustments = {
        "cold": -200,          # -200ml (less sweating in cold)
        "temperate": 0,        # No adjustment
        "hot": 500,            # +500ml (increased sweating)
        "tropical": 750        # +750ml (high heat and humidity)
    }
    climate_boost = climate_adjustments.get(climate, 0)
    
    # Calculate final goal
    dynamic_goal = base_goal + activity_boost + climate_boost
    
    # Ensure minimum of 1500ml and maximum of 4000ml
    dynamic_goal = max(1500, min(dynamic_goal, 4000))
    
    return dynamic_goal


class WaterStatusResponse(BaseModel):
    """Water status with both fixed and dynamic goals"""
    current_water_ml: int
    fixed_goal_ml: int
    dynamic_goal_ml: int
    percentage_fixed: float
    percentage_dynamic: float
    recommendation: str


@router.post("", response_model=WaterIntakeResponse, status_code=status.HTTP_201_CREATED)
async def log_water(water_data: WaterIntakeCreate, current_user: dict = Depends(get_current_user)):
    """Log water intake"""
    db = get_db()
    user_id = ObjectId(current_user["id"])
    
    # Use provided date or today
    intake_date = water_data.date if water_data.date else date.today()
    intake_date_str = date_to_string(intake_date)
    
    # Check if entry exists for this date
    existing = db.water_intake.find_one({
        "user_id": user_id,
        "date": intake_date_str
    })
    
    if existing:
        # Update existing entry
        new_total = existing["water_ml"] + water_data.water_ml
        db.water_intake.update_one(
            {"_id": existing["_id"]},
            {"$set": {"water_ml": new_total}}
        )
        updated = db.water_intake.find_one({"_id": existing["_id"]})
        updated["id"] = str(updated["_id"])
        updated["user_id"] = str(updated["user_id"])
        updated_date_obj = string_to_date(updated["date"])
        
        return WaterIntakeResponse(
            id=updated["id"],
            user_id=updated["user_id"],
            date=updated_date_obj,
            water_ml=updated["water_ml"],
            created_at=updated["created_at"]
        )
    else:
        # Create new entry
        water_doc = {
            "user_id": user_id,
            "date": intake_date_str,
            "water_ml": water_data.water_ml,
            "created_at": datetime.utcnow()
        }
        
        result = db.water_intake.insert_one(water_doc)
        created = db.water_intake.find_one({"_id": result.inserted_id})
        created["id"] = str(created["_id"])
        created["user_id"] = str(created["user_id"])
        created_date_obj = string_to_date(created["date"])
        
        return WaterIntakeResponse(
            id=created["id"],
            user_id=created["user_id"],
            date=created_date_obj,
            water_ml=created["water_ml"],
            created_at=created["created_at"]
        )


@router.get("", response_model=List[WaterIntakeResponse])
async def get_water_intake(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    current_user: dict = Depends(get_current_user)
):
    """Get water intake logs (optionally filtered by date range)"""
    db = get_db()
    user_id = ObjectId(current_user["id"])
    
    # Build query
    query = {"user_id": user_id}
    if start_date or end_date:
        date_query = {}
        if start_date:
            date_query["$gte"] = date_to_string(start_date)
        if end_date:
            date_query["$lte"] = date_to_string(end_date)
        query["date"] = date_query
    
    # Fetch water intake logs
    logs = db.water_intake.find(query).sort("date", -1)
    
    return [
        WaterIntakeResponse(
            id=str(log["_id"]),
            user_id=str(log["user_id"]),
            date=string_to_date(log["date"]),
            water_ml=log["water_ml"],
            created_at=log["created_at"]
        )
        for log in logs
    ]


@router.get("/today", response_model=Optional[WaterIntakeResponse])
async def get_today_water_intake(current_user: dict = Depends(get_current_user)):
    """Get today's water intake"""
    db = get_db()
    user_id = ObjectId(current_user["id"])
    today = date.today()
    today_str = date_to_string(today)
    
    log = db.water_intake.find_one({
        "user_id": user_id,
        "date": today_str
    })
    
    if not log:
        return None
    
    return WaterIntakeResponse(
        id=str(log["_id"]),
        user_id=str(log["user_id"]),
        date=string_to_date(log["date"]),
        water_ml=log["water_ml"],
        created_at=log["created_at"]
    )


@router.get("/status", response_model=WaterStatusResponse)
async def get_water_status(current_user: dict = Depends(get_current_user)):
    """
    Get today's water intake status with both fixed and dynamic goals
    Dynamic goal is intelligently calculated based on user profile
    """
    db = get_db()
    user_id = ObjectId(current_user["id"])
    today = date.today()
    today_str = date_to_string(today)
    
    # Get today's water intake
    water_doc = db.water_intake.find_one({
        "user_id": user_id,
        "date": today_str
    })
    current_water = water_doc["water_ml"] if water_doc else 0
    
    # Fixed goal (simple: 30ml per kg)
    weight = current_user.get("weight", 70)
    fixed_goal = int(weight * 30)
    
    # Dynamic goal (intelligent calculation)
    dynamic_goal = calculate_dynamic_water_goal(current_user)
    
    # Calculate percentages
    percentage_fixed = min((current_water / fixed_goal) * 100, 100) if fixed_goal > 0 else 0
    percentage_dynamic = min((current_water / dynamic_goal) * 100, 100) if dynamic_goal > 0 else 0
    
    # Generate recommendation
    if current_water < dynamic_goal:
        remaining = dynamic_goal - current_water
        recommendation = f"Drink {remaining}ml more to reach your personalized goal! 💧"
    elif current_water >= dynamic_goal:
        recommendation = "Great! You've reached your daily water goal. Stay hydrated! 🌟"
    else:
        recommendation = "Keep track of your water intake!"
    
    return WaterStatusResponse(
        current_water_ml=current_water,
        fixed_goal_ml=fixed_goal,
        dynamic_goal_ml=dynamic_goal,
        percentage_fixed=percentage_fixed,
        percentage_dynamic=percentage_dynamic,
        recommendation=recommendation
    )

