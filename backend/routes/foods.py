from fastapi import APIRouter

"""

router = APIRouter()Foods Routes
"""

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, Field
from typing import List, Optional, Dict

from db.connection import get_db
from routes.auth import get_current_user
from services.indian_foods_db import (
    get_all_foods, 
    search_food, 
    get_food_by_name, 
    get_categories
)


router = APIRouter()


class FoodItem(BaseModel):
    name: str
    calories: float
    protein: float
    fat: float
    carbs: float
    aliases: Optional[List[str]] = None
    tags: Optional[List[str]] = None


class QuickFoodItem(BaseModel):
    name: str
    unit: str
    calories: float
    protein: float
    fat: float
    carbs: float
    category: str


class FoodCategory(BaseModel):
    category: str
    items: List[Dict]


@router.get("", response_model=List[FoodItem])
async def search_foods(q: Optional[str] = Query(None), limit: int = 20, current_user: dict = Depends(get_current_user)):
    db = get_db()
    query = {}
    if q:
        query = {"$or": [
            {"name": {"$regex": q, "$options": "i"}},
            {"aliases": {"$elemMatch": {"$regex": q, "$options": "i"}}}
        ]}
    cur = db.foods.find(query).limit(limit)
    items = []
    for doc in cur:
        items.append(FoodItem(
            name=doc["name"],
            calories=doc["calories"],
            protein=doc["protein"],
            fat=doc["fat"],
            carbs=doc["carbs"],
            aliases=doc.get("aliases", []),
            tags=doc.get("tags", []),
        ))
    return items


@router.get("/quick-add/categories")
async def get_quick_add_categories(current_user: dict = Depends(get_current_user)):
    """Get all food categories for quick add"""
    try:
        categories = get_categories()
        return {
            "status": "success",
            "categories": categories,
            "total": len(categories)
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


@router.get("/quick-add/category/{category_name}")
async def get_category_foods(category_name: str, current_user: dict = Depends(get_current_user)):
    """Get all foods in a specific category for quick add"""
    try:
        category_data = get_all_foods().get(category_name)
        if not category_data:
            return {
                "status": "error",
                "message": f"Category '{category_name}' not found"
            }
        
        return {
            "status": "success",
            "category": category_name,
            "items": category_data.get("items", [])
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


@router.get("/quick-add/search")
async def quick_search_foods(q: str = Query(...), current_user: dict = Depends(get_current_user)):
    """Search foods from quick add database"""
    try:
        results = search_food(q)
        
        if not results:
            return {
                "status": "not_found",
                "message": f"No foods found matching '{q}'",
                "results": []
            }
        
        return {
            "status": "success",
            "query": q,
            "total": len(results),
            "results": results
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


@router.get("/quick-add/suggestions")
async def get_food_suggestions(q: str = Query(...), limit: int = 10, current_user: dict = Depends(get_current_user)):
    """Get autocomplete suggestions for food names as user types"""
    try:
        if not q or len(q.strip()) < 1:
            return {
                "status": "empty",
                "suggestions": [],
                "total": 0
            }
        
        query_lower = q.lower().strip()
        suggestions = []
        seen_foods = set()  # Avoid duplicates
        
        all_foods = get_all_foods()
        
        # Search through all categories and foods
        for category, data in all_foods.items():
            if "items" in data:
                for item in data["items"]:
                    food_name = item["name"]
                    # Check if query matches the beginning or contains the query
                    if query_lower in food_name.lower():
                        if food_name not in seen_foods:
                            suggestions.append({
                                "name": food_name,
                                "category": category,
                                "calories": item.get("calories", 0),
                                "unit": item.get("unit", "100g"),
                                "protein": item.get("protein", 0),
                                "fat": item.get("fat", 0),
                                "carbs": item.get("carbs", 0)
                            })
                            seen_foods.add(food_name)
                            
                            if len(suggestions) >= limit:
                                break
            
            if len(suggestions) >= limit:
                break
        
        # Sort by relevance (exact match first, then by position in string)
        suggestions.sort(key=lambda x: (
            not x["name"].lower().startswith(query_lower),
            x["name"].lower().index(query_lower)
        ))
        
        # Limit results
        suggestions = suggestions[:limit]
        
        return {
            "status": "success",
            "query": q,
            "total": len(suggestions),
            "suggestions": suggestions
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "suggestions": []
        }


@router.get("/quick-add/{food_name}")
async def get_quick_food_details(food_name: str, current_user: dict = Depends(get_current_user)):
    """Get detailed nutritional info for a specific food"""
    try:
        food_details = get_food_by_name(food_name)
        
        if not food_details:
            return {
                "status": "not_found",
                "message": f"Food '{food_name}' not found",
                "food": None
            }
        
        return {
            "status": "success",
            "food": food_details
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


