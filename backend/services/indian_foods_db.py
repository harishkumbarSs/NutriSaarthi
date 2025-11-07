"""Indian Foods Database for Quick Add"""

from typing import List, Dict

# Comprehensive nutritional data for common Indian foods
INDIAN_FOODS_DATABASE = {
    # GRAINS & CEREALS
    "Rice": {
        "category": "Grains",
        "subcategory": "Rice",
        "items": [
            {"name": "White Rice (Basmati)", "unit": "100g cooked", "calories": 130, "protein": 2.7, "fat": 0.3, "carbs": 28},
            {"name": "Brown Rice", "unit": "100g cooked", "calories": 111, "protein": 2.6, "fat": 0.9, "carbs": 23},
            {"name": "Jasmine Rice", "unit": "100g cooked", "calories": 130, "protein": 2.7, "fat": 0.3, "carbs": 28},
            {"name": "Black Rice", "unit": "100g cooked", "calories": 130, "protein": 3.5, "fat": 0.6, "carbs": 26}
        ]
    },
    "Wheat": {
        "category": "Grains",
        "subcategory": "Wheat",
        "items": [
            {"name": "Whole Wheat Roti", "unit": "1 medium", "calories": 70, "protein": 2.1, "fat": 0.5, "carbs": 13},
            {"name": "White Rice Roti", "unit": "1 medium", "calories": 55, "protein": 1.5, "fat": 0.3, "carbs": 11},
            {"name": "Whole Wheat Bread", "unit": "1 slice", "calories": 80, "protein": 3, "fat": 1, "carbs": 14},
            {"name": "Maida (All Purpose Flour)", "unit": "100g", "calories": 364, "protein": 9.7, "fat": 1.3, "carbs": 76}
        ]
    },
    "Oats": {
        "category": "Grains",
        "subcategory": "Oats",
        "items": [
            {"name": "Oats (Dry)", "unit": "30g (1/2 cup)", "calories": 150, "protein": 5, "fat": 3, "carbs": 27},
            {"name": "Oats (Cooked)", "unit": "100g", "calories": 68, "protein": 2.4, "fat": 1.4, "carbs": 12}
        ]
    },
    "Dal": {
        "category": "Pulses",
        "subcategory": "Dals",
        "items": [
            {"name": "Masoor Dal (Cooked)", "unit": "1 cup cooked", "calories": 230, "protein": 18, "fat": 0.8, "carbs": 39},
            {"name": "Moong Dal (Cooked)", "unit": "1 cup cooked", "calories": 212, "protein": 14.6, "fat": 0.8, "carbs": 38},
            {"name": "Chana Dal (Cooked)", "unit": "1 cup cooked", "calories": 269, "protein": 14.5, "fat": 1.7, "carbs": 45},
            {"name": "Urad Dal (Cooked)", "unit": "1 cup cooked", "calories": 187, "protein": 14, "fat": 1.8, "carbs": 32},
            {"name": "Arhar Dal (Cooked)", "unit": "1 cup cooked", "calories": 224, "protein": 15.2, "fat": 0.8, "carbs": 40}
        ]
    },
    "Legumes": {
        "category": "Pulses",
        "subcategory": "Legumes",
        "items": [
            {"name": "Chickpea (Chana) - Cooked", "unit": "1 cup cooked", "calories": 269, "protein": 14.5, "fat": 4.3, "carbs": 45},
            {"name": "Kidney Beans - Cooked", "unit": "1 cup cooked", "calories": 225, "protein": 15.3, "fat": 0.9, "carbs": 40},
            {"name": "Black Beans - Cooked", "unit": "1 cup cooked", "calories": 227, "protein": 15.2, "fat": 0.9, "carbs": 41},
            {"name": "Lentils (Red) - Cooked", "unit": "1 cup cooked", "calories": 230, "protein": 18, "fat": 0.8, "carbs": 39}
        ]
    },
    # VEGETABLES
    "Leafy Greens": {
        "category": "Vegetables",
        "subcategory": "Leafy Greens",
        "items": [
            {"name": "Spinach (Raw)", "unit": "100g", "calories": 23, "protein": 2.9, "fat": 0.4, "carbs": 3.6},
            {"name": "Spinach (Cooked)", "unit": "100g", "calories": 23, "protein": 2.9, "fat": 0.4, "carbs": 3.6},
            {"name": "Fenugreek Leaves (Methi)", "unit": "100g", "calories": 49, "protein": 4.4, "fat": 0.7, "carbs": 6},
            {"name": "Mustard Greens", "unit": "100g", "calories": 27, "protein": 2.7, "fat": 0.5, "carbs": 5}
        ]
    },
    "Common Vegetables": {
        "category": "Vegetables",
        "subcategory": "Common",
        "items": [
            {"name": "Tomato", "unit": "100g", "calories": 18, "protein": 0.9, "fat": 0.2, "carbs": 3.9},
            {"name": "Onion (Raw)", "unit": "100g", "calories": 40, "protein": 1.1, "fat": 0.1, "carbs": 9},
            {"name": "Onion (Cooked)", "unit": "100g", "calories": 30, "protein": 1, "fat": 0.1, "carbs": 7},
            {"name": "Carrot", "unit": "100g", "calories": 41, "protein": 0.9, "fat": 0.2, "carbs": 10},
            {"name": "Cucumber", "unit": "100g", "calories": 16, "protein": 0.7, "fat": 0.1, "carbs": 3.6},
            {"name": "Bell Pepper (Green)", "unit": "100g", "calories": 31, "protein": 1, "fat": 0.3, "carbs": 6},
            {"name": "Bell Pepper (Red)", "unit": "100g", "calories": 31, "protein": 1, "fat": 0.3, "carbs": 7}
        ]
    },
    "Gourds & Vegetables": {
        "category": "Vegetables",
        "subcategory": "Gourds",
        "items": [
            {"name": "Bottle Gourd (Lauki)", "unit": "100g cooked", "calories": 12, "protein": 0.6, "fat": 0.1, "carbs": 2.5},
            {"name": "Bitter Gourd (Karela)", "unit": "100g cooked", "calories": 34, "protein": 1.5, "fat": 0.2, "carbs": 8},
            {"name": "Ridge Gourd (Tinda)", "unit": "100g cooked", "calories": 15, "protein": 0.7, "fat": 0.1, "carbs": 3},
            {"name": "Pumpkin", "unit": "100g cooked", "calories": 26, "protein": 1, "fat": 0.1, "carbs": 6}
        ]
    },
    "Beans & Peas": {
        "category": "Vegetables",
        "subcategory": "Beans",
        "items": [
            {"name": "French Beans", "unit": "100g", "calories": 31, "protein": 2.1, "fat": 0.2, "carbs": 7},
            {"name": "Green Peas", "unit": "100g", "calories": 81, "protein": 5.4, "fat": 0.4, "carbs": 14},
            {"name": "Cluster Beans (Guar)", "unit": "100g", "calories": 26, "protein": 2.5, "fat": 0.2, "carbs": 4}
        ]
    },

    # DAIRY & PROTEINS
    "Paneer": {
        "category": "Dairy",
        "subcategory": "Paneer",
        "items": [
            {"name": "Paneer (Fresh)", "unit": "100g", "calories": 265, "protein": 25, "fat": 17, "carbs": 2},
            {"name": "Low Fat Paneer", "unit": "100g", "calories": 140, "protein": 28, "fat": 3, "carbs": 1}
        ]
    },
    "Yogurt": {
        "category": "Dairy",
        "subcategory": "Yogurt",
        "items": [
            {"name": "Plain Yogurt (Full Fat)", "unit": "100g", "calories": 61, "protein": 3.5, "fat": 3.3, "carbs": 4.7},
            {"name": "Plain Yogurt (Low Fat)", "unit": "100g", "calories": 40, "protein": 4.3, "fat": 0.4, "carbs": 4.7},
            {"name": "Greek Yogurt", "unit": "100g", "calories": 59, "protein": 10, "fat": 0.4, "carbs": 3.3}
        ]
    },
    "Milk": {
        "category": "Dairy",
        "subcategory": "Milk",
        "items": [
            {"name": "Whole Milk", "unit": "100ml", "calories": 61, "protein": 3.2, "fat": 3.3, "carbs": 4.8},
            {"name": "Toned Milk", "unit": "100ml", "calories": 51, "protein": 3.2, "fat": 2, "carbs": 4.8},
            {"name": "Skimmed Milk", "unit": "100ml", "calories": 35, "protein": 3.4, "fat": 0.1, "carbs": 5}
        ]
    },
    "Eggs": {
        "category": "Proteins",
        "subcategory": "Eggs",
        "items": [
            {"name": "Egg (Whole, Boiled)", "unit": "1 medium", "calories": 70, "protein": 6, "fat": 5, "carbs": 0.6},
            {"name": "Egg White (Boiled)", "unit": "1 medium", "calories": 17, "protein": 3.6, "fat": 0.1, "carbs": 0.7},
            {"name": "Egg Yolk", "unit": "1 medium", "calories": 55, "protein": 2.7, "fat": 4.5, "carbs": 0.3}
        ]
    },
    "Chicken": {
        "category": "Proteins",
        "subcategory": "Chicken",
        "items": [
            {"name": "Chicken Breast (Boiled)", "unit": "100g", "calories": 165, "protein": 31, "fat": 3.6, "carbs": 0},
            {"name": "Chicken Breast (Grilled)", "unit": "100g", "calories": 165, "protein": 31, "fat": 3.6, "carbs": 0},
            {"name": "Chicken Thigh (Boiled)", "unit": "100g", "calories": 209, "protein": 26, "fat": 11, "carbs": 0},
            {"name": "Chicken Curry", "unit": "100g", "calories": 150, "protein": 20, "fat": 7, "carbs": 2}
        ]
    },
    "Fish": {
        "category": "Proteins",
        "subcategory": "Fish",
        "items": [
            {"name": "Salmon (Cooked)", "unit": "100g", "calories": 206, "protein": 22, "fat": 12, "carbs": 0},
            {"name": "Tuna (Cooked)", "unit": "100g", "calories": 144, "protein": 30, "fat": 1, "carbs": 0},
            {"name": "Pomfret (Cooked)", "unit": "100g", "calories": 100, "protein": 20, "fat": 1.3, "carbs": 0}
        ]
    },

    # NUTS & SEEDS
    "Nuts": {
        "category": "Nuts & Seeds",
        "subcategory": "Nuts",
        "items": [
            {"name": "Almonds (Raw)", "unit": "30g (1 oz)", "calories": 164, "protein": 6, "fat": 14, "carbs": 6},
            {"name": "Cashews (Raw)", "unit": "30g (1 oz)", "calories": 155, "protein": 5, "fat": 12, "carbs": 9},
            {"name": "Walnuts", "unit": "30g (1 oz)", "calories": 185, "protein": 4.3, "fat": 18.5, "carbs": 4},
            {"name": "Peanuts (Raw)", "unit": "30g (1 oz)", "calories": 160, "protein": 7, "fat": 14, "carbs": 6}
        ]
    },
    "Seeds": {
        "category": "Nuts & Seeds",
        "subcategory": "Seeds",
        "items": [
            {"name": "Sesame Seeds", "unit": "10g", "calories": 52, "protein": 1.6, "fat": 4.7, "carbs": 2.1},
            {"name": "Sunflower Seeds", "unit": "30g", "calories": 165, "protein": 5.5, "fat": 15, "carbs": 6.5},
            {"name": "Flax Seeds", "unit": "15g", "calories": 55, "protein": 1.9, "fat": 3, "carbs": 5},
            {"name": "Chia Seeds", "unit": "15g", "calories": 61, "protein": 2, "fat": 3.5, "carbs": 5}
        ]
    },

    # CONDIMENTS & OILS
    "Oils": {
        "category": "Oils & Fats",
        "subcategory": "Oils",
        "items": [
            {"name": "Olive Oil", "unit": "15ml (1 tbsp)", "calories": 119, "protein": 0, "fat": 13.5, "carbs": 0},
            {"name": "Mustard Oil", "unit": "15ml (1 tbsp)", "calories": 119, "protein": 0, "fat": 13.5, "carbs": 0},
            {"name": "Coconut Oil", "unit": "15ml (1 tbsp)", "calories": 119, "protein": 0, "fat": 13.5, "carbs": 0},
            {"name": "Ghee (Clarified Butter)", "unit": "15ml (1 tbsp)", "calories": 120, "protein": 0, "fat": 13.6, "carbs": 0}
        ]
    },
    "Spices & Condiments": {
        "category": "Condiments",
        "subcategory": "Spices",
        "items": [
            {"name": "Salt", "unit": "1g", "calories": 0, "protein": 0, "fat": 0, "carbs": 0},
            {"name": "Turmeric Powder", "unit": "5g", "calories": 17, "protein": 0.5, "fat": 0.3, "carbs": 3},
            {"name": "Chili Powder", "unit": "5g", "calories": 16, "protein": 0.6, "fat": 0.3, "carbs": 3},
            {"name": "Ginger (Fresh)", "unit": "10g", "calories": 5, "protein": 0.1, "fat": 0.1, "carbs": 1},
            {"name": "Garlic (Fresh)", "unit": "10g", "calories": 14, "protein": 0.6, "fat": 0.05, "carbs": 3}
        ]
    },

    # BREADS & SNACKS
    "Indian Breads": {
        "category": "Breads",
        "subcategory": "Traditional",
        "items": [
            {"name": "Naan (Plain)", "unit": "1 medium", "calories": 262, "protein": 8, "fat": 6, "carbs": 44},
            {"name": "Paratha", "unit": "1 medium", "calories": 237, "protein": 6, "fat": 10, "carbs": 31},
            {"name": "Bhatura", "unit": "1 large", "calories": 350, "protein": 10, "fat": 12, "carbs": 50},
            {"name": "Poori", "unit": "1 medium", "calories": 150, "protein": 3, "fat": 7, "carbs": 18}
        ]
    },
    "Snacks": {
        "category": "Snacks",
        "subcategory": "Traditional",
        "items": [
            {"name": "Samosa", "unit": "1 medium", "calories": 252, "protein": 4, "fat": 14, "carbs": 28},
            {"name": "Pakora", "unit": "1 medium", "calories": 90, "protein": 2, "fat": 5, "carbs": 10},
            {"name": "Chips/Wafers", "unit": "30g", "calories": 150, "protein": 2, "fat": 7, "carbs": 19},
            {"name": "Popcorn (Salted)", "unit": "30g", "calories": 110, "protein": 3.5, "fat": 6, "carbs": 11}
        ]
    },

    # FRUITS
    "Fruits": {
        "category": "Fruits",
        "subcategory": "Common",
        "items": [
            {"name": "Banana", "unit": "1 medium (100g)", "calories": 89, "protein": 1.1, "fat": 0.3, "carbs": 23},
            {"name": "Apple", "unit": "1 medium (182g)", "calories": 95, "protein": 0.5, "fat": 0.3, "carbs": 25},
            {"name": "Orange", "unit": "1 medium (154g)", "calories": 62, "protein": 1.2, "fat": 0.3, "carbs": 15},
            {"name": "Mango", "unit": "1 medium (200g)", "calories": 134, "protein": 1.1, "fat": 0.4, "carbs": 35},
            {"name": "Papaya", "unit": "100g", "calories": 43, "protein": 0.5, "fat": 0.3, "carbs": 11},
            {"name": "Watermelon", "unit": "100g", "calories": 30, "protein": 0.6, "fat": 0.2, "carbs": 7.6},
            {"name": "Grapes", "unit": "100g", "calories": 67, "protein": 0.7, "fat": 0.4, "carbs": 17}
        ]
    },

    # COMMON DISHES
    "Rice Dishes": {
        "category": "Main Dishes",
        "subcategory": "Rice",
        "items": [
            {"name": "Plain Rice", "unit": "1 cup cooked", "calories": 206, "protein": 4.3, "fat": 0.5, "carbs": 45},
            {"name": "Biryani (Chicken)", "unit": "1 cup", "calories": 300, "protein": 15, "fat": 10, "carbs": 40},
            {"name": "Pulao", "unit": "1 cup", "calories": 250, "protein": 8, "fat": 8, "carbs": 38},
            {"name": "Fried Rice", "unit": "1 cup", "calories": 280, "protein": 8, "fat": 12, "carbs": 36},
        ]
    },
    "Curries": {
        "category": "Main Dishes",
        "subcategory": "Curries",
        "items": [
            {"name": "Butter Chicken", "unit": "1 cup", "calories": 220, "protein": 20, "fat": 14, "carbs": 3},
            {"name": "Dal Makhani", "unit": "1 cup", "calories": 200, "protein": 10, "fat": 10, "carbs": 20},
            {"name": "Paneer Tikka Masala", "unit": "1 cup", "calories": 240, "protein": 18, "fat": 15, "carbs": 6},
            {"name": "Chole Bhature", "unit": "1 serving", "calories": 450, "protein": 15, "fat": 15, "carbs": 65},
            {"name": "Sambar", "unit": "1 cup", "calories": 100, "protein": 8, "fat": 2, "carbs": 15},
        ]
    },
    "Soups": {
        "category": "Soups",
        "subcategory": "Traditional",
        "items": [
            {"name": "Vegetable Soup", "unit": "1 cup", "calories": 60, "protein": 2, "fat": 1, "carbs": 12},
            {"name": "Tomato Soup", "unit": "1 cup", "calories": 80, "protein": 2, "fat": 2, "carbs": 15},
            {"name": "Dal Soup", "unit": "1 cup", "calories": 120, "protein": 8, "fat": 1, "carbs": 20},
        ]
    },

    # BEVERAGES
    "Beverages": {
        "category": "Beverages",
        "subcategory": "Drinks",
        "items": [
            {"name": "Water", "unit": "250ml", "calories": 0, "protein": 0, "fat": 0, "carbs": 0},
            {"name": "Green Tea", "unit": "200ml", "calories": 3, "protein": 0, "fat": 0, "carbs": 0},
            {"name": "Black Tea (with milk)", "unit": "200ml", "calories": 30, "protein": 1, "fat": 1, "carbs": 3},
            {"name": "Coffee (with milk)", "unit": "200ml", "calories": 40, "protein": 1.5, "fat": 1.5, "carbs": 4},
            {"name": "Lassi (Sweet)", "unit": "200ml", "calories": 100, "protein": 3, "fat": 2, "carbs": 20},
        ]
    },
}


def get_all_foods():
    """Get all foods from database"""
    return INDIAN_FOODS_DATABASE


def get_food_category(category_name):
    """Get foods by category"""
    return INDIAN_FOODS_DATABASE.get(category_name, {})


def search_food(query):
    """Search for food by name"""
    query_lower = query.lower()
    results = []
    
    for category, data in INDIAN_FOODS_DATABASE.items():
        if "items" in data:
            for item in data["items"]:
                if query_lower in item["name"].lower():
                    results.append({
                        "category": category,
                        "food": item
                    })
    
    return results


def get_food_by_name(name):
    """Get specific food details by name"""
    for category, data in INDIAN_FOODS_DATABASE.items():
        if "items" in data:
            for item in data["items"]:
                if item["name"].lower() == name.lower():
                    return {
                        "category": category,
                        "food": item
                    }
    return None


def get_categories():
    """Get all available categories"""
    return list(INDIAN_FOODS_DATABASE.keys())
