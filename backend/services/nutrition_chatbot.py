"""Specialized Nutrition Chatbot Service

Trained responses for Indian nutrition advice without external API dependency
"""

from typing import Dict, List, Optional
import random

    def __init__(self):

        """Initialize chatbot with basic responses"""from typing import List, Dict, Optional

        self.responses = {import random

            "greeting": "Hello! I'm your NutriSaarthi AI Coach. How can I help you with your nutrition goals today?",

            "help": "I can help you with meal planning, nutrition advice, and tracking your progress!",

            "default": "Let me help you make better nutrition choices for your health goals."class NutritionChatbot:

        }    """

        A specialized chatbot trained on Indian nutrition and fitness knowledge

    def get_response(self, question: str, context: Dict = None) -> str:    No external API dependency - uses local knowledge base

        """Get chatbot response based on question and user context"""    """

        # Simple rule-based responses

        question = question.lower()    def __init__(self):

                self.knowledge_base = self._load_knowledge_base()

        # Use context for personalization        self.conversation_history = []

        name = context.get("name", "User") if context else "User"

        calories = context.get("today_calories", 0) if context else 0    def _load_knowledge_base(self) -> Dict:

        water = context.get("today_water", 0) if context else 0        """Load nutrition knowledge specific to Indian diet"""

                return {

        if "hello" in question or "hi" in question:            "greetings": {

            return f"Hello {name}! How can I help you today?"                "trigger": ["hi", "hello", "hey", "namaste"],

                            "responses": [

        if "water" in question:                    "Namaste! I'm your NutriCoach. How can I help you with your nutrition goals today?",

            return f"You've had {water}ml of water today. Remember to stay hydrated!"                    "Hello! Ready to discuss your nutrition and health? What's on your mind?",

                                "Hey there! I'm here to help you make smart nutrition choices. What would you like to know?"

        if "calories" in question:                ]

            return f"You've consumed {calories} calories today. Keep up the good work!"            },

                        "breakfast": {

        if "meal plan" in question:                "trigger": ["breakfast", "morning meal", "breakfast ideas"],

            return "I can help you plan healthy meals based on your preferences."                "responses": [

                                "For a healthy Indian breakfast, try:\n• Oats upma with vegetables\n• Idli with sambar (low-calorie)\n• Moong dal chilla\n• Whole wheat paratha with yogurt\n• Poha with low-fat milk",

        # Default response                    "Great breakfast options:\n• Masala dosa (healthier with less oil)\n• Ragi porridge\n• Fruit with Greek yogurt\n• Whole wheat toast with peanut butter\n• Sprouts salad"

        return self.responses["default"]                ]

            },

# Create singleton instance            "weight_loss": {

nutrition_bot = NutritionChatbot()                "trigger": ["weight loss", "lose weight", "slim down", "fat loss"],
                "responses": [
                    "For weight loss, focus on:\n1. Eat 300-500 calories less than maintenance\n2. Increase protein intake (dal, paneer, chicken)\n3. Reduce refined carbs (white rice, maida)\n4. Stay hydrated (3-4 liters water)\n5. Walk 30 mins daily",
                    "Weight loss tips:\n• Eat more fiber (vegetables, whole grains)\n• Choose grilled over fried (tandoori, boiled)\n• Portion control is key\n• Avoid sugary drinks and sweets\n• Eat slowly and mindfully"
                ]
            },
            "weight_gain": {
                "trigger": ["weight gain", "gain weight", "bulk up", "muscle gain"],
                "responses": [
                    "For healthy weight gain:\n1. Eat 300-500 calories MORE than maintenance\n2. Include protein in every meal (eggs, paneer, dal)\n3. Add healthy fats (nuts, seeds, olive oil)\n4. Eat 4-5 times a day\n5. Do strength training 3-4 times/week",
                    "Muscle gain foods:\n• Paneer curry with whole wheat roti\n• Chickpea curry (chana masala)\n• Almond and peanut butters\n• Whole milk products\n• Fish and chicken\n• Nuts and seeds"
                ]
            },
            "indian_foods": {
                "trigger": ["dal", "paneer", "roti", "rice", "curry", "vegetables", "indian food"],
                "responses": [
                    "Common Indian foods nutrition:\n• Dal: 100g cooked = 100 cal, high protein\n• Paneer: 100g = 265 cal, 25g protein\n• Roti: 1 = 70 cal, 2g protein\n• Basmati rice: 100g = 130 cal\n• Veggies: Low calorie, high fiber",
                    "Healthy Indian swaps:\n• White rice → Brown/black rice\n• Refined flour → Whole wheat/multi-grain\n• Ghee → Olive/mustard oil\n• Fried snacks → Roasted chickpeas\n• Regular tea → Green/herbal tea"
                ]
            },
            "protein": {
                "trigger": ["protein", "high protein", "muscle", "increase protein", "more protein"],
                "responses": [
                    "Indian protein sources:\n• Paneer: 25g protein per 100g\n• Dals: 9g protein per cooked cup\n• Eggs: 6g protein per egg\n• Chicken: 25g protein per 100g\n• Yogurt: 10g protein per cup\n• Nuts: 6-7g protein per ounce\n\nTo increase protein intake:\n1. Add dal (lentils) to every meal\n2. Include paneer in curries\n3. Eat eggs (vegetarian option: paneer)\n4. Have yogurt for snacks\n5. Add nuts and seeds to breakfast",
                    "Protein requirements:\n• Sedentary: 0.8g per kg body weight\n• Moderately active: 1.2-1.4g per kg\n• Strength training: 1.6-2g per kg\n• Distribute across meals for better absorption\n\nHigh-protein Indian meals:\n• Dal with roti (10-12g per serving)\n• Paneer tikka with salad\n• Egg curry with rice\n• Moong dal chilla\n• Chickpea curry (chana masala)"
                ]
            },
            "vegetables": {
                "trigger": ["vegetables", "veggies", "salad", "greens"],
                "responses": [
                    "Nutrient-dense vegetables:\n• Spinach: Iron, calcium, vitamins\n• Broccoli: Fiber, calcium, antioxidants\n• Tomato: Lycopene, vitamin C\n• Carrot: Beta-carotene, fiber\n• Bell peppers: Vitamin C, antioxidants\n• Onion: Quercetin, anti-inflammatory",
                    "Vegetable tips:\n• Eat 2-3 cups daily (various colors)\n• Raw or lightly cooked to retain nutrients\n• Add to curries, dal, salads\n• Seasonal vegetables are more nutritious\n• Frozen vegetables are also good"
                ]
            },
            "water": {
                "trigger": ["water", "hydration", "drink water"],
                "responses": [
                    "Hydration guide:\n• Minimum: 2-3 liters daily\n• Active person: Add 0.5-1 liter per hour of exercise\n• Hot weather: Increase intake by 25-50%\n• Sign of dehydration: Dark urine, dizziness, fatigue",
                    "Water benefits:\n• Improves metabolism\n• Helps with digestion\n• Supports weight loss\n• Flushes toxins\n• Improves skin and energy\nTip: Drink water before, during, after meals and exercise"
                ]
            },
            "snacks": {
                "trigger": ["snack", "munchies", "evening snacks", "in-between meals"],
                "responses": [
                    "Healthy Indian snacks:\n• Roasted chickpeas (chana)\n• Mixed nuts and seeds\n• Homemade popcorn\n• Sprouts salad\n• Cucumber and carrot sticks with hummus\n• Whole grain biscuits",
                    "Quick healthy snacks:\n• Apple with peanut butter\n• Yogurt with granola\n• Roasted fox nuts (makhana)\n• Boiled moong sprouts\n• Whole wheat toast with tomato\n• Protein shake"
                ]
            },
            "calories": {
                "trigger": ["calories", "calorie", "kcal", "how many calories"],
                "responses": [
                    "Daily calorie needs:\n• Sedentary person: BMR × 1.2\n• Moderately active: BMR × 1.55\n• Very active: BMR × 1.725\n• To lose weight: 300-500 cal deficit daily\n• To gain weight: 300-500 cal surplus daily",
                    "Calculating BMR (Mifflin-St Jeor):\n• Men: (10×weight + 6.25×height - 5×age + 5)\n• Women: (10×weight + 6.25×height - 5×age - 161)\nThen multiply by activity factor to get TDEE"
                ]
            },
            "exercise": {
                "trigger": ["exercise", "workout", "gym", "fitness", "training"],
                "responses": [
                    "Fitness and nutrition combo:\n• Pre-workout: Light carbs 30-60 mins before\n• Post-workout: Protein + carbs within 30 mins\n• Rest days: Maintain calories, high protein\n• 3-4 days weight training + 2-3 days cardio\n• 1-2 rest days weekly",
                    "Workout nutrition tips:\n• Hydrate throughout exercise\n• Don't skip pre/post workout meals\n• Time protein intake after workouts\n• Keep carbs for energy\n• Avoid heavy meals right before exercise"
                ]
            },
            "digestion": {
                "trigger": ["digestion", "digest", "stomach", "gas", "bloating"],
                "responses": [
                    "Improve digestion:\n• Eat slowly and chew well (30+ chews)\n• Include fiber gradually\n• Drink warm water\n• Eat ginger, fennel (saunf) for digestion\n• Avoid eating too late\n• Include probiotics (yogurt, buttermilk)\n• Stay active after meals",
                    "Foods that aid digestion:\n• Ginger and turmeric\n• Fennel seeds (saunf)\n• Jeera (cumin)\n• Lemon juice\n• Warm water\n• Leafy greens\n• Yogurt and buttermilk"
                ]
            },
            "blood_pressure": {
                "trigger": ["blood pressure", "bp", "hypertension"],
                "responses": [
                    "Managing blood pressure:\n• Reduce salt intake (under 5g daily)\n• Increase potassium (banana, leafy greens)\n• Avoid processed foods\n• Regular exercise (30 mins daily)\n• Maintain healthy weight\n• Manage stress\n• Limit caffeine and alcohol",
                    "BP-friendly foods:\n• Garlic and ginger\n• Leafy greens (spinach, kale)\n• Tomatoes and beans\n• Whole grains\n• Oats\n• Dark chocolate (70% cocoa)\n• Herbal teas"
                ]
            },
            "diabetes": {
                "trigger": ["diabetes", "blood sugar", "glucose", "diabetic"],
                "responses": [
                    "Managing diabetes through nutrition:\n• Focus on low GI foods\n• Include high fiber (dal, vegetables)\n• Control portion sizes\n• Eat regular meals\n• Limit refined sugars and white rice\n• Include protein in every meal\n• Stay active and hydrated",
                    "Diabetes-friendly foods:\n• Whole grains (brown rice, whole wheat)\n• Legumes (all dals, chickpeas)\n• Non-starchy vegetables\n• Cinnamon (may help glucose)\n• Fenugreek seeds (methi)\n• Limit fruits to 1-2 per day\n• Avoid sugary drinks and sweets"
                ]
            },
            "immunity": {
                "trigger": ["immunity", "immune", "sick", "cold", "infection"],
                "responses": [
                    "Boost immunity naturally:\n• Vitamin C: Citrus fruits, tomatoes, peppers\n• Vitamin D: Sunlight, fortified milk, eggs\n• Zinc: Nuts, seeds, whole grains, chickpeas\n• Probiotics: Yogurt, buttermilk\n• Turmeric and ginger: Anti-inflammatory\n• Adequate sleep: 7-8 hours daily",
                    "Immunity-boosting foods:\n• Turmeric milk (haldi doodh)\n• Ginger-lemon tea\n• Garlic and onion\n• Nuts and seeds\n• Leafy greens\n• Whole grains\n• Dairy products\n• Citrus fruits"
                ]
            },
            "default": {
                "responses": [
                    "I'm your NutriCoach trained specifically for Indian nutrition. Ask me about:\n• Weight loss/gain strategies\n• Indian food calories and nutrition\n• Meal planning\n• Protein sources\n• Healthy Indian recipes\n• Fitness and nutrition combo\nWhat would you like to know?",
                    "Great question! I'm specialized in Indian nutrition. I can help with weight goals, healthy eating, exercise nutrition, and more. Be specific and I'll give you tailored advice!"
                ]
            }
        }

    def _find_best_match(self, user_message: str) -> str:
        """Find the best response from knowledge base"""
        user_message_lower = user_message.lower()

        # Check each category
        for category, data in self.knowledge_base.items():
            if category != "default":
                triggers = data.get("trigger", [])
                for trigger in triggers:
                    # Check if trigger is in the message (substring match)
                    if trigger.lower() in user_message_lower:
                        return random.choice(data.get("responses", ["I understand. Can you be more specific?"]))

        # If no specific match, check for common question patterns
        if "increase" in user_message_lower and "protein" in user_message_lower:
            return random.choice(self.knowledge_base["protein"]["responses"])
        
        if "decrease" in user_message_lower or "reduce" in user_message_lower:
            if "weight" in user_message_lower or "fat" in user_message_lower:
                return random.choice(self.knowledge_base["weight_loss"]["responses"])
        
        if "gain" in user_message_lower or "bulk" in user_message_lower:
            return random.choice(self.knowledge_base["weight_gain"]["responses"])
        
        if "health" in user_message_lower or "healthy" in user_message_lower:
            return random.choice(self.knowledge_base["indian_foods"]["responses"])

        # Default response if no match
        return random.choice(self.knowledge_base["default"]["responses"])

    def get_response(self, user_message: str, user_context: Optional[Dict] = None) -> str:
        """
        Get chatbot response based on user message and context

        Args:
            user_message: User's question or statement
            user_context: User profile info (goal, weight, age, etc.)

        Returns:
            Personalized nutrition advice
        """
        # Find best match from knowledge base
        response = self._find_best_match(user_message)

        # Personalize based on user context if available
        if user_context:
            goal = user_context.get("goal", "").lower()
            weight = user_context.get("weight", 70)

            # Add personalization based on goal
            if "weight loss" in goal and "weight loss" in user_message.lower():
                response += f"\n\nFor your goal: Based on {weight}kg, aim for 1.2-1.5g protein per kg daily."

            elif "weight gain" in goal and "weight gain" in user_message.lower():
                response += f"\n\nFor your goal: At {weight}kg, you should aim for 2000+ calories daily to gain 0.5kg/week."

        return response

    def get_greeting(self) -> str:
        """Get a random greeting"""
        return random.choice(self.knowledge_base["greetings"]["responses"])

    def get_meal_suggestion(self, meal_type: str, goal: str) -> str:
        """Get meal suggestion based on meal type and goal"""
        suggestions = {
            "breakfast_weight_loss": [
                "Moong dal chilla (without ghee) with green chutney",
                "Oats upma with lots of vegetables",
                "Idli with sambar (high protein, low calorie)"
            ],
            "breakfast_weight_gain": [
                "Parathas with ghee and yogurt",
                "Milet porridge with milk and nuts",
                "Scrambled eggs with whole grain toast"
            ],
            "lunch_weight_loss": [
                "Chicken salad with mixed vegetables",
                "Dal rice with plenty of vegetables",
                "Grilled paneer with whole wheat roti"
            ],
            "lunch_weight_gain": [
                "Dal rice with ghee and butter",
                "Chicken tikka masala with naan",
                "Paneer butter masala with whole wheat roti"
            ],
            "dinner_weight_loss": [
                "Light dal soup with vegetables",
                "Grilled fish with salad",
                "Vegetable curry with brown rice"
            ],
            "dinner_weight_gain": [
                "Rich dal curry with roti and ghee",
                "Paneer gravy with naan",
                "Mutton curry with rice"
            ]
        }

        key = f"{meal_type}_{goal}"
        if key in suggestions:
            return random.choice(suggestions[key])
        return "Contact your nutritionist for personalized meal plans"


# Initialize global chatbot instance
nutrition_bot = NutritionChatbot()
