# NutriSaarthi - Setup Instructions

Complete guide to pull and set up the NutriSaarthi project for development.

## 📋 Prerequisites

- **Node.js**: v16+ (with npm)
- **Python**: v3.9+
- **MongoDB**: Local instance running on `mongodb://localhost:27017`
- **Git**: Latest version

## 🚀 Quick Start (5 minutes)

### Step 1: Clone the Repository
```bash
git clone https://github.com/harishkumbarSs/NutriSaarthi.git
cd NutriSaarthi
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
copy env.example .env
# Edit .env with your MongoDB connection string if needed
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create environment file
copy env.example .env
# Edit .env if needed
```

### Step 4: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate  # On Windows
python -c "import sys; sys.path.insert(0, '.'); from uvicorn.main import run; run('main:app', host='127.0.0.1', port=8000)"
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Access the app:**
- Frontend: http://127.0.0.1:5174
- Backend API: http://127.0.0.1:8000
- API Documentation: http://127.0.0.1:8000/docs

---

## 📁 Project Structure

```
NutriSaarthi/
├── backend/                 # FastAPI backend
│   ├── main.py             # Entry point
│   ├── requirements.txt     # Python dependencies
│   ├── env.example          # Environment template
│   ├── db/                  # Database connection
│   ├── routes/              # API endpoints
│   ├── schemas/             # Pydantic models
│   ├── services/            # Business logic
│   └── utils/               # Utilities
│
├── frontend/                # React + Vite frontend
│   ├── package.json         # NPM dependencies
│   ├── env.example          # Environment template
│   ├── vite.config.js       # Vite configuration
│   ├── tailwind.config.js   # Tailwind CSS config
│   ├── index.html           # HTML entry point
│   ├── src/
│   │   ├── main.jsx         # React entry
│   │   ├── App.jsx          # Root component
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   └── services/        # API services
│   └── android/             # Android build (Capacitor)
│
└── [Documentation files]    # Setup guides and references
```

---

## 🔧 Environment Configuration

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/nutrisaarthi
JWT_SECRET=your-secret-key-here
JWT_ALGORITHM=HS256
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

---

## 🗄️ Database Setup

### MongoDB Connection

Make sure MongoDB is running:

```bash
# On Windows (if installed)
mongod

# On macOS (if installed via Homebrew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

### Initialize Database

The database will be automatically created on first API call. Tables/indexes are created in:
- `backend/db/connection.py`

---

## 📦 Dependencies Overview

### Backend
- **FastAPI**: Web framework
- **Uvicorn**: ASGI server
- **PyMongo**: MongoDB driver
- **Pydantic**: Data validation
- **python-dotenv**: Environment management
- **PyJWT**: JWT authentication

### Frontend
- **React 18.2**: UI framework
- **Vite**: Build tool
- **Axios**: HTTP client
- **Tailwind CSS**: Styling
- **Lucide React**: Icons

---

## 🔄 Common Workflows

### Running Tests
```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

### Building for Production

**Backend:**
```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm run build
# Output in dist/
```

### Hot Reload
Both servers support hot reload:
- **Backend**: Auto-reloads on file changes (via Uvicorn)
- **Frontend**: HMR enabled by default (Vite)

---

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check Python version
python --version

# Reinstall dependencies
pip install --upgrade -r requirements.txt

# Check MongoDB connection
# Ensure MongoDB is running and accessible
```

### Frontend Won't Start
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear npm cache
npm cache clean --force
```

### Port Already in Use
```bash
# Kill process on port 8000 (backend)
lsof -ti:8000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :8000   # Windows

# Kill process on port 5174 (frontend)
lsof -ti:5174 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5174   # Windows
```

### MongoDB Connection Failed
- Verify MongoDB is running
- Check connection string in `.env`
- Default: `mongodb://localhost:27017/nutrisaarthi`

---

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register user
- `POST /api/v1/auth/login` - Login user

### Dashboard
- `GET /api/v1/dashboard/stats` - Get dashboard statistics
- `GET /api/v1/dashboard/tip` - Get AI coaching tip ⭐ **NEW**

### Water Tracking
- `POST /api/v1/water` - Log water intake
- `GET /api/v1/water/today` - Get today's water intake
- `GET /api/v1/water/status` - Get water status with smart goals ⭐ **NEW**

### Meals
- `POST /api/v1/meals` - Log meal
- `GET /api/v1/meals` - Get meal history

### Profile
- `POST /api/v1/profile/setup` - Setup user profile
- `GET /api/v1/profile` - Get user profile

### Foods
- `GET /api/v1/foods/search` - Search foods (with autocomplete)

---

## 🆕 New Features (Latest)

### Feature 1: Dashboard Micro-Coaching Tip
- AI-powered personalized nutrition tips
- Based on latest meal and user goal
- Endpoint: `GET /api/v1/dashboard/tip`
- Displayed on Dashboard with refresh button

### Feature 2: Intelligent Water Goal Adjustment
- Dynamic water goal calculation
- Formula: `weight × 35ml + activity + climate adjustments`
- Endpoint: `GET /api/v1/water/status`
- Shows standard vs. personalized goals
- Climate selector in profile setup

---

## 🚢 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend Deployment (Heroku/AWS/DigitalOcean)
```bash
cd backend
pip install gunicorn
gunicorn main:app
```

---

## 📖 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)

---

## 👥 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'feat: Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

---

## 📝 Notes

- All API responses include proper error handling
- Authentication uses JWT tokens
- MongoDB is used for data persistence
- Frontend uses Vite for fast development
- Tailwind CSS for responsive design
- Lucide React for beautiful icons

---

## ❓ Questions?

Check the other documentation files in the repository:
- `FEATURES_IMPLEMENTED.md` - Detailed feature documentation
- `FEATURE_QUICK_REFERENCE.md` - API reference and formulas
- `FEATURE_TESTING_GUIDE.md` - Testing procedures

---

**Last Updated**: November 7, 2025
**Version**: 1.0.0
