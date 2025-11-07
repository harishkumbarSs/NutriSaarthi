"""Specialized Nutrition Chatbot Service

Trained responses for Indian nutrition advice without external API dependency
"""

from typing import Dict, List, Optional
import random

class NutritionChatbot:
    def __init__(self):
        """Initialize chatbot with knowledge base"""
        self.knowledge_base = self._load_knowledge_base()
        
    def _load_knowledge_base(self) -> Dict:
        """Load nutrition knowledge specific to Indian diet"""
        return {
            "greetings": {
                "trigger": ["hi", "hello", "hey", "namaste"],
                "responses": [
                    "Namaste! I'm your NutriCoach. How can I help you with your nutrition goals today?",
                    "Hello! Ready to discuss your nutrition and health? What's on your mind?",
                    "Hey there! I'm here to help you make smart nutrition choices. What would you like to know?"
                ]
            },
            "default": {
                "responses": [
                    "I'm your NutriCoach! Ask me about:\n• Weight goals\n• Indian food nutrition\n• Meal planning\n• Exercise nutrition",
                    "I can help you with nutrition goals and healthy eating. What would you like to know?"
                ]
            }
        }

    def get_response(self, message: str, context: Dict = None) -> str:
        """Get chatbot response based on message and context"""
        # Basic response logic
        message = message.lower()
        
        # Use context for personalization
        name = context.get("name", "User") if context else "User"
        calories = context.get("today_calories", 0) if context else 0
        water = context.get("today_water", 0) if context else 0
        
        # Check for greeting
        for trigger in self.knowledge_base["greetings"]["trigger"]:
            if trigger in message:
                return f"{random.choice(self.knowledge_base['greetings']['responses'])} {name}!"
                
        # Context-based responses
        if "calories" in message:
            return f"You've consumed {calories} calories today. Keep up the good work!"
            
        if "water" in message:
            return f"You've had {water}ml of water today. Remember to stay hydrated!"
            
        # Default response
        return random.choice(self.knowledge_base["default"]["responses"])

# Create singleton instance
nutrition_bot = NutritionChatbot()