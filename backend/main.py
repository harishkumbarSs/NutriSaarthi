import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables from .env file
load_dotenv()

# Get environment variables with defaults
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/nutrisaarthi")
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
DEBUG = os.getenv("DEBUG", "True").lower() == "true"

# Initialize FastAPI app
app = FastAPI(
    title="NutriSaarthi API",
    description="Personalized nutrition and wellness coaching API",
    version="1.0.0",
    debug=DEBUG
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routes after app initialization to avoid circular imports
from routes import ai, auth, dashboard, foods, meals, profile, recommendations, water

# Include all routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(profile.router, prefix="/api/v1/profile", tags=["Profile"])
app.include_router(meals.router, prefix="/api/v1/meals", tags=["Meals"])
app.include_router(water.router, prefix="/api/v1/water", tags=["Water"])
app.include_router(foods.router, prefix="/api/v1/foods", tags=["Foods"])
app.include_router(recommendations.router, prefix="/api/v1/recommendations", tags=["Recommendations"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI Coach"])

@app.get("/")
async def root():
    """Root endpoint to verify API is running"""
    return {
        "status": "ok",
        "message": "NutriSaarthi API is running",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=HOST,
        port=PORT,
        reload=DEBUG
    )