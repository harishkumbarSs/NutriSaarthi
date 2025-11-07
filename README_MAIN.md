# 🍛 NutriSaarthi - AI-Powered Indian Nutrition Tracker

> **Smart nutrition tracking with AI-driven personalized coaching and intelligent hydration management**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![Node 16+](https://img.shields.io/badge/node-16+-green.svg)](https://nodejs.org/)
[![React 18.2](https://img.shields.io/badge/react-18.2-blue.svg)](https://react.dev/)

---

## 📋 Overview

NutriSaarthi is a comprehensive nutrition and diet tracking application designed specifically for Indian users. It combines meal logging, calorie tracking, and AI-powered recommendations with climate-aware water hydration goals.

### ✨ Key Features

- **🎯 AI Coaching Tips**: Personalized nutrition advice based on your latest meal and goals
- **💧 Smart Water Goals**: Intelligent hydration targets adjusted for your activity level and climate
- **🍜 Indian Food Database**: Extensive database of Indian foods with accurate nutritional data
- **📊 Dashboard Analytics**: Visual tracking of calories, macronutrients, and progress
- **🔐 Secure Authentication**: JWT-based secure user accounts
- **📱 Mobile Responsive**: Works seamlessly on desktop and mobile devices

---

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
setup.bat
```

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

See [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) for detailed step-by-step instructions.

---

## 🏗️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Server**: Uvicorn
- **Database**: MongoDB
- **Authentication**: JWT
- **Validation**: Pydantic

### Frontend
- **Framework**: React 18.2
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Infrastructure
- **Local Development**: MongoDB
- **Deployment Ready**: Docker-compatible
- **Cross-platform**: Windows, macOS, Linux

---

## 📁 Project Structure

```
NutriSaarthi/
├── backend/
│   ├── main.py                 # FastAPI application entry
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example             # Environment template
│   ├── db/                      # Database connection & setup
│   ├── routes/                  # API endpoints
│   │   ├── auth.py             # Authentication routes
│   │   ├── dashboard.py        # Dashboard & AI tips
│   │   ├── water.py            # Water tracking (NEW)
│   │   ├── meals.py            # Meal logging
│   │   ├── foods.py            # Food database
│   │   ├── profile.py          # User profile
│   │   ├── recommendations.py  # AI recommendations
│   │   └── ai.py               # AI services
│   ├── schemas/                 # Data models
│   ├── services/                # Business logic
│   │   ├── nutrition_chatbot.py # AI engine
│   │   └── recommendations.py   # Recommendation engine
│   └── utils/                   # Utilities
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx             # React entry
│   │   ├── App.jsx              # Root component
│   │   ├── pages/               # Page components
│   │   │   ├── Dashboard.jsx    # Main dashboard (UPDATED)
│   │   │   ├── WaterTracker.jsx # Water tracking (UPDATED)
│   │   │   ├── MealLog.jsx      # Meal logging
│   │   │   └── ...
│   │   ├── components/          # Reusable components
│   │   └── services/
│   │       └── api.js           # API service layer
│   ├── package.json             # NPM dependencies
│   ├── vite.config.js           # Vite configuration
│   └── .env.example             # Environment template
│
├── SETUP_INSTRUCTIONS.md        # Detailed setup guide
├── CONTRIBUTING.md              # Developer guidelines
├── setup.bat                     # Windows quick setup
├── setup.sh                      # macOS/Linux quick setup
└── [Documentation files]         # Additional guides
```

---

## 🆕 Latest Features

### 🎯 Feature 1: Dashboard Micro-Coaching Tip
AI-powered personalized nutrition tips on your dashboard.

**What it does:**
- Analyzes your most recent meal
- Considers your fitness goal
- Generates hyper-specific, actionable advice (15 words max)
- Displays with meal context on the dashboard
- One-click refresh for new tips

**API Endpoint:**
```
GET /api/v1/dashboard/tip
Response: {
  "tip": "Add leafy greens to increase fiber intake...",
  "meal_context": "Paneer Curry (265cal, 25g protein) | Goal: weight_loss",
  "generated_at": "2025-11-07T12:30:00Z"
}
```

### 💧 Feature 2: Intelligent Water Goal Adjustment
Climate and activity-aware hydration targets.

**What it does:**
- Calculates personalized daily water goal
- Formula: `weight × 35ml + activity_boost + climate_boost`
- Shows comparison between standard and personalized goals
- Adjusts for your activity level and climate
- Provides contextual hydration recommendations

**Personalization Factors:**
- **Activity Level**: Sedentary → Very Active (+0 to +1000ml)
- **Climate**: Cold → Tropical (-200 to +750ml)
- **Body Weight**: Individual calculation (ml/kg)

**API Endpoint:**
```
GET /api/v1/water/status
Response: {
  "current_water_ml": 500,
  "fixed_goal_ml": 2100,
  "dynamic_goal_ml": 3200,
  "percentage_fixed": 23.8,
  "percentage_dynamic": 15.6,
  "recommendation": "Drink 2700ml more to reach goal! 💧"
}
```

---

## 📚 Documentation

- **[SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)** - Comprehensive setup guide
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Developer guidelines
- **[FEATURES_IMPLEMENTED.md](./FEATURES_IMPLEMENTED.md)** - Feature specifications
- **[FEATURE_QUICK_REFERENCE.md](./FEATURE_QUICK_REFERENCE.md)** - API reference
- **[FEATURE_TESTING_GUIDE.md](./FEATURE_TESTING_GUIDE.md)** - Testing procedures

---

## 🔧 Development

### Prerequisites
- Node.js 16+
- Python 3.9+
- MongoDB (local)
- Git

### Starting Development Servers

**Backend** (Terminal 1):
```bash
cd backend
source venv/bin/activate  # macOS/Linux: source venv/bin/activate
python -c "import sys; sys.path.insert(0, '.'); from uvicorn.main import run; run('main:app', host='127.0.0.1', port=8000)"
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```

**Access:**
- App: http://127.0.0.1:5174
- API Docs: http://127.0.0.1:8000/docs

---

## 🧪 Testing

### Backend
```bash
cd backend
pytest
```

### Frontend
```bash
cd frontend
npm test
```

---

## 📤 Deployment

### Frontend
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel, Netlify, or similar
```

### Backend
```bash
cd backend
gunicorn main:app
# Deploy to Heroku, AWS, DigitalOcean, etc.
```

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

**Quick steps:**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and test locally
4. Commit: `git commit -m 'feat: Add my feature'`
5. Push: `git push origin feature/my-feature`
6. Open a Pull Request

---

## 📝 API Endpoints Summary

### Authentication
- `POST /api/v1/auth/signup` - Register
- `POST /api/v1/auth/login` - Login

### Dashboard ⭐ Updated
- `GET /api/v1/dashboard/stats` - Statistics
- `GET /api/v1/dashboard/tip` - AI Coaching Tip (NEW)

### Water Tracking ⭐ Updated
- `POST /api/v1/water` - Log water
- `GET /api/v1/water/today` - Today's intake
- `GET /api/v1/water/status` - Smart goals (NEW)

### Meals
- `POST /api/v1/meals` - Log meal
- `GET /api/v1/meals` - History

### Profile
- `POST /api/v1/profile/setup` - Setup profile
- `GET /api/v1/profile` - Get profile

### Foods
- `GET /api/v1/foods/search` - Search foods

For full API documentation, visit: http://127.0.0.1:8000/docs

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8000
kill -9 <PID>
```

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Default: `mongodb://localhost:27017/nutrisaarthi`

### Dependencies Issues
```bash
# Backend
pip install --upgrade -r requirements.txt

# Frontend
npm cache clean --force && npm install
```

---

## 📞 Support

- Check [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)
- Review [CONTRIBUTING.md](./CONTRIBUTING.md)
- Check [FEATURE_TESTING_GUIDE.md](./FEATURE_TESTING_GUIDE.md)
- API Docs: http://127.0.0.1:8000/docs

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👥 Contributors

- **Created**: November 2025
- **Last Updated**: November 7, 2025
- **Version**: 1.0.0

---

## 🎯 Roadmap

### Short Term
- [ ] Tip history and ratings
- [ ] Weekly water reports
- [ ] Push notifications

### Medium Term
- [ ] ML-based tip generation
- [ ] Advanced personalization
- [ ] Wearable integration
- [ ] Social sharing

### Long Term
- [ ] Multi-language support
- [ ] Offline functionality
- [ ] Advanced analytics
- [ ] Community features

---

## ⭐ Show Your Support

If you find this project helpful, please consider:
- ⭐ Starring the repository
- 🔗 Sharing with others
- 🐛 Reporting bugs
- 💡 Suggesting features

---

**Made with ❤️ for healthier nutrition**

*Last Updated: November 7, 2025*
