# 📚 NutriSaarthi API Quick Reference

**Version:** 1.0.0  
**Last Updated:** November 7, 2025

---

## 🔗 Base URL
```
Development: http://localhost:8000
Production: (To be configured)
```

## 🔑 Authentication
All endpoints (except `/auth/*`) require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📡 API Endpoints

### 🔐 Authentication

#### Signup
```
POST /api/v1/auth/signup

Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "weight": 75,
  "height": 180,
  "age": 30,
  "gender": "male",
  "goal": "weight_loss",
  "activity_level": "moderate",
  "climate": "temperate",
  "dietary_preference": "veg"
}

Response:
{
  "id": "6735abc123def456789012",
  "name": "John Doe",
  "email": "john@example.com",
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

#### Login
```
POST /api/v1/auth/login

Request:
{
  "email": "john@example.com",
  "password": "securepassword"
}

Response:
{
  "id": "6735abc123def456789012",
  "name": "John Doe",
  "email": "john@example.com",
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

---

### 📊 Dashboard

#### Get Statistics
```
GET /api/v1/dashboard/stats

Response:
{
  "today_calories": 1850.5,
  "today_protein": 120.3,
  "today_fat": 65.2,
  "today_carbs": 185.1,
  "today_water_ml": 500,
  "calorie_goal": 2100.0,
  "water_goal_ml": 2100,
  "weekly_calories": [1800, 2100, 1950, ...],
  "weekly_dates": ["2025-11-01", "2025-11-02", ...]
}
```

#### Get AI Coaching Tip ⭐
```
GET /api/v1/dashboard/tip

Response:
{
  "tip": "Add leafy greens to increase fiber intake and improve digestion",
  "meal_context": "Latest: Paneer Curry (265cal, 25g protein) | Goal: weight_loss",
  "generated_at": "2025-11-07T12:30:00Z"
}

Status Codes:
200 OK - Tip generated successfully
401 Unauthorized - Invalid/missing token
500 Internal Server Error - AI service error
```

---

### 💧 Water Tracking

#### Log Water
```
POST /api/v1/water

Request:
{
  "water_ml": 500,
  "date": "2025-11-07"  (optional, defaults to today)
}

Response:
{
  "id": "6735abc123def456789012",
  "user_id": "user123",
  "date": "2025-11-07",
  "water_ml": 500,
  "created_at": "2025-11-07T10:30:00Z"
}
```

#### Get Today's Water
```
GET /api/v1/water/today

Response:
{
  "id": "6735abc123def456789012",
  "user_id": "user123",
  "date": "2025-11-07",
  "water_ml": 1250,
  "created_at": "2025-11-07T08:00:00Z"
}

Returns: null if no entry for today
```

#### Get Water History
```
GET /api/v1/water?start_date=2025-11-01&end_date=2025-11-07

Query Parameters:
- start_date: (optional) ISO format date
- end_date: (optional) ISO format date

Response:
[
  {
    "id": "6735abc123def456789012",
    "user_id": "user123",
    "date": "2025-11-07",
    "water_ml": 1250,
    "created_at": "2025-11-07T08:00:00Z"
  },
  ...
]
```

#### Get Smart Water Status ⭐
```
GET /api/v1/water/status

Response:
{
  "current_water_ml": 500,
  "fixed_goal_ml": 2100,
  "dynamic_goal_ml": 3200,
  "percentage_fixed": 23.8,
  "percentage_dynamic": 15.6,
  "recommendation": "Drink 2700ml more to reach your personalized goal! 💧"
}

Formula:
Fixed Goal = weight_kg × 30
Dynamic Goal = weight_kg × 35 + activity_boost + climate_boost
```

---

### 🍽️ Meals

#### Log Meal
```
POST /api/v1/meals

Request:
{
  "food_item": "Paneer Curry",
  "calories": 265,
  "protein": 25.5,
  "fat": 12.3,
  "carbs": 18.5,
  "date": "2025-11-07"  (optional)
}

Response:
{
  "id": "6735abc123def456789012",
  "user_id": "user123",
  "food_item": "Paneer Curry",
  "calories": 265,
  "protein": 25.5,
  "fat": 12.3,
  "carbs": 18.5,
  "date": "2025-11-07",
  "created_at": "2025-11-07T12:30:00Z"
}
```

#### Get Meal History
```
GET /api/v1/meals?start_date=2025-11-01&end_date=2025-11-07

Response:
[
  {
    "id": "6735abc123def456789012",
    "user_id": "user123",
    "food_item": "Paneer Curry",
    "calories": 265,
    "protein": 25.5,
    "fat": 12.3,
    "carbs": 18.5,
    "date": "2025-11-07",
    "created_at": "2025-11-07T12:30:00Z"
  },
  ...
]
```

---

### 👤 Profile

#### Setup Profile
```
POST /api/v1/profile/setup

Request:
{
  "weight": 75,
  "height": 180,
  "age": 30,
  "gender": "male",
  "goal": "weight_loss",
  "activity_level": "moderate",
  "climate": "temperate",
  "dietary_preference": "veg"
}

Response:
{
  "id": "6735abc123def456789012",
  "user_id": "user123",
  "weight": 75,
  "height": 180,
  "age": 30,
  "gender": "male",
  "goal": "weight_loss",
  "activity_level": "moderate",
  "climate": "temperate",
  "dietary_preference": "veg",
  "created_at": "2025-11-07T10:00:00Z"
}
```

#### Get Profile
```
GET /api/v1/profile

Response:
{
  "id": "6735abc123def456789012",
  "user_id": "user123",
  "weight": 75,
  "height": 180,
  "age": 30,
  "gender": "male",
  "goal": "weight_loss",
  "activity_level": "moderate",
  "climate": "temperate",
  "dietary_preference": "veg",
  "created_at": "2025-11-07T10:00:00Z"
}
```

---

### 🍜 Food Database

#### Search Foods
```
GET /api/v1/foods/search?q=paneer&limit=10

Query Parameters:
- q: Search term (required)
- limit: Number of results (default: 10, max: 50)
- type: "veg" or "non_veg" (optional)

Response:
[
  {
    "id": "6735abc123def456789012",
    "name": "Paneer Curry",
    "calories": 265,
    "protein": 25.5,
    "fat": 12.3,
    "carbs": 18.5,
    "type": "veg",
    "cuisine": "North Indian"
  },
  ...
]
```

---

## 📊 User Profile Fields

```json
{
  "weight": 75,              // kg
  "height": 180,             // cm
  "age": 30,                 // years
  "gender": "male",          // "male" or "female"
  "goal": "weight_loss",     // "weight_loss", "maintain", "weight_gain"
  "activity_level": "moderate", // "sedentary", "light", "moderate", "active", "very_active"
  "climate": "temperate",    // "cold", "temperate", "hot", "tropical"
  "dietary_preference": "veg" // "veg", "non_veg", "vegan"
}
```

---

## 💧 Water Goal Calculation

### Formula
```
Dynamic Goal = (Weight × 35) + Activity Boost + Climate Adjustment
```

### Activity Levels
| Level | Boost |
|-------|-------|
| Sedentary | +0ml |
| Light | +250ml |
| Moderate | +500ml |
| Active | +750ml |
| Very Active | +1000ml |

### Climate Adjustments
| Climate | Adjustment |
|---------|-----------|
| Cold | -200ml |
| Temperate | 0ml |
| Hot | +500ml |
| Tropical | +750ml |

### Examples
```
User: 75kg, Moderate Activity, Temperate
Fixed: 75 × 30 = 2250ml
Dynamic: (75 × 35) + 500 + 0 = 3125ml

User: 60kg, Very Active, Tropical
Fixed: 60 × 30 = 1800ml
Dynamic: (60 × 35) + 1000 + 750 = 4150ml → Capped at 4000ml
```

---

## ⏱️ Rate Limits
Currently: No rate limiting  
*Recommended for production:* 100 requests/minute per user

---

## 🔄 Response Format

### Success Response
```json
{
  "data": {},  // or array
  "success": true,
  "timestamp": "2025-11-07T12:30:00Z"
}
```

### Error Response
```json
{
  "detail": "Error message",
  "status_code": 400,
  "timestamp": "2025-11-07T12:30:00Z"
}
```

---

## 📋 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 500 | Server Error - Internal error |

---

## 🧪 Testing with cURL

### Get Coaching Tip
```bash
curl -X GET http://localhost:8000/api/v1/dashboard/tip \
  -H "Authorization: Bearer <your_token>"
```

### Log Water
```bash
curl -X POST http://localhost:8000/api/v1/water \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"water_ml": 500}'
```

### Get Water Status
```bash
curl -X GET http://localhost:8000/api/v1/water/status \
  -H "Authorization: Bearer <your_token>"
```

---

## 🔗 Related Documentation

- `FEATURES_IMPLEMENTED.md` - Detailed feature documentation
- `FEATURE_TESTING_GUIDE.md` - Testing procedures
- `README.md` - Project overview

---

**Last Updated:** November 7, 2025  
**Version:** 1.0.0
