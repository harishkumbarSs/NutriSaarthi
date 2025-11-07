"""AI service functions"""
from typing import List
from dataclasses import dataclass

@dataclass
class ParsedFood:
    food_item: str
    quantity: float
    unit: str
    calories: float
    protein: float
    fat: float
    carbs: float

def parse_meal_text(text: str) -> List[ParsedFood]:
    """Parse free text meal description into structured data"""
    # Simple parsing example (in production, use ML model)
    foods = []
    
    # Split by commas and lines
    items = [x.strip() for x in text.replace('\n', ',').split(',') if x.strip()]
    
    for item in items:
        # Basic parsing - just extract first word as food
        words = item.split()
        if not words:
            continue
            
        food = {
            'food_item': words[0],
            'quantity': 1.0,
            'unit': 'serving',
            'calories': 100,  # Default values
            'protein': 5,
            'fat': 3,
            'carbs': 15
        }
        
        foods.append(ParsedFood(**food))
    
    return foods