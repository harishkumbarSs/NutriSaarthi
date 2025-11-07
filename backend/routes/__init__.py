"""Initialize package with router collection"""
from . import (
    ai, auth, dashboard, foods, meals,
    profile, recommendations, water
)

routers = [
    ai.router,
    auth.router,
    dashboard.router,
    foods.router,
    meals.router,
    profile.router,
    recommendations.router,
    water.router
]