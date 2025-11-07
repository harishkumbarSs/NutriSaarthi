# Contributing Guide - NutriSaarthi

Guide for developers who cloned the repository and want to contribute.

## ✅ Pre-Cloning Checklist

Ensure you have:
- [ ] Node.js v16+
- [ ] Python 3.9+
- [ ] MongoDB running locally
- [ ] Git installed
- [ ] 30 minutes for initial setup

---

## 🔄 Initial Setup (First Time)

### 1️⃣ Clone Repository
```bash
git clone https://github.com/harishkumbarSs/NutriSaarthi.git
cd NutriSaarthi
```

### 2️⃣ Backend Setup

**Windows:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy env.example .env
```

**macOS/Linux:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp env.example .env
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
copy env.example .env  # Windows
cp env.example .env    # macOS/Linux
```

---

## 🚀 Daily Development Workflow

### Starting Development

**Terminal 1 - Backend (http://127.0.0.1:8000):**
```bash
cd backend
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
python -c "import sys; sys.path.insert(0, '.'); from uvicorn.main import run; run('main:app', host='127.0.0.1', port=8000)"
```

**Terminal 2 - Frontend (http://127.0.0.1:5174):**
```bash
cd frontend
npm run dev
```

### Stop Development
- Press `Ctrl+C` in both terminals
- Deactivate Python venv: `deactivate`

---

## 📝 Before You Start Coding

### Understanding the Architecture

```
Backend Flow:
User Request → FastAPI Router → Service Layer → MongoDB → Response

Frontend Flow:
User Action → React Component → API Service → Axios → Display
```

### Key Files to Know

**Backend:**
- `main.py` - Server entry point
- `routes/` - API endpoints
- `services/` - Business logic
- `schemas/` - Data models
- `db/connection.py` - Database connection

**Frontend:**
- `src/main.jsx` - React entry
- `src/App.jsx` - Root component
- `src/pages/` - Page components
- `src/services/api.js` - API calls
- `src/components/` - Reusable components

---

## 🆕 Adding New Features

### Backend Feature (Example: New Endpoint)

1. **Create Route** in `backend/routes/myfeature.py`:
```python
from fastapi import APIRouter, Depends
from pydantic import BaseModel

router = APIRouter()

class MyRequestModel(BaseModel):
    name: str
    value: int

@router.post("/myfeature")
async def create_feature(data: MyRequestModel):
    # Your logic here
    return {"status": "success", "data": data}
```

2. **Register Route** in `backend/main.py`:
```python
from routes import myfeature

app.include_router(
    myfeature.router,
    prefix="/api/v1/myfeature",
    tags=["MyFeature"]
)
```

3. **Test Endpoint**:
- Visit: http://127.0.0.1:8000/docs
- Try out your endpoint

### Frontend Feature (Example: New Page)

1. **Create Component** in `src/pages/MyPage.jsx`:
```jsx
import { useState } from 'react';
import { api } from '../services/api';

export default function MyPage() {
  const [data, setData] = useState(null);

  const handleFetch = async () => {
    const response = await api.get('/myfeature');
    setData(response.data);
  };

  return (
    <div>
      <button onClick={handleFetch}>Fetch Data</button>
      {data && <p>{JSON.stringify(data)}</p>}
    </div>
  );
}
```

2. **Add Route** in `src/App.jsx`:
```jsx
import MyPage from './pages/MyPage';

// In your routing logic
<Route path="/my-page" element={<MyPage />} />
```

3. **Test Page**:
- Navigate to: http://127.0.0.1:5174/my-page

---

## 🧪 Testing Your Changes

### Backend Testing
```bash
cd backend
pytest  # Run all tests
pytest tests/test_specific.py  # Run specific test
```

### Frontend Testing
```bash
cd frontend
npm test  # Run all tests
npm run test:watch  # Watch mode
```

### Manual Testing
1. Start both servers
2. Open http://127.0.0.1:5174
3. Interact with UI
4. Check browser console (F12) for errors
5. Check server logs for API errors

---

## 📤 Git Workflow

### Creating a Feature Branch
```bash
git checkout -b feature/my-awesome-feature
```

### Committing Changes
```bash
# Check what changed
git status

# Add changes
git add .

# Commit with meaningful message
git commit -m "feat: Add my awesome feature

- Detail 1
- Detail 2"
```

### Pushing Changes
```bash
git push origin feature/my-awesome-feature
```

### Creating Pull Request
1. Go to GitHub repository
2. Click "Compare & pull request"
3. Add description
4. Submit PR

---

## 📋 Code Style Guidelines

### Python (Backend)
- Use snake_case for functions: `get_user_data()`
- Use PascalCase for classes: `UserModel`
- Use docstrings for functions
- Follow PEP 8 standards

### JavaScript/React (Frontend)
- Use camelCase for functions: `getUserData()`
- Use PascalCase for components: `UserProfile`
- Use arrow functions: `const handleClick = () => {}`
- Add comments for complex logic

---

## 🐛 Common Issues & Solutions

### Issue: "ModuleNotFoundError" in Backend
```bash
# Solution: Reinstall requirements
pip install -r requirements.txt
```

### Issue: "npm ERR!" in Frontend
```bash
# Solution: Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: MongoDB connection refused
```bash
# Solution: Start MongoDB
mongod  # Windows/macOS
sudo systemctl start mongod  # Linux
```

### Issue: Port already in use
```bash
# Find process on port 8000
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

---

## 🔒 Database Operations

### Adding MongoDB Indexes
```python
# In backend/db/connection.py
db.users.create_index("email", unique=True)
db.meal_logs.create_index([("user_id", 1), ("date", -1)])
```

### Querying Data
```python
from pymongo import MongoClient
client = MongoClient('mongodb://localhost:27017')
db = client['nutrisaarthi']
users = db.users.find_one({"email": "user@example.com"})
```

---

## 📚 File Modifications Checklist

When making changes, update these if needed:

- [ ] `backend/requirements.txt` - if adding Python packages
- [ ] `frontend/package.json` - if adding NPM packages
- [ ] `.env.example` files - if adding new environment variables
- [ ] Documentation files - if changing features
- [ ] API routes - register new routes in `main.py`

---

## ✨ Quality Checklist Before Push

- [ ] Code is tested locally
- [ ] No console errors in browser/server
- [ ] Database changes are documented
- [ ] New endpoints work via /docs UI
- [ ] Environment variables are added to .example
- [ ] Comments added for complex logic
- [ ] No hardcoded values (use .env)
- [ ] Git commit message is descriptive

---

## 🚢 After Your Changes

### Check Backend Changes
```bash
cd backend
python -m py_compile *.py  # Check for syntax errors
```

### Check Frontend Changes
```bash
cd frontend
npm run lint  # Check for linting issues
```

### Run Both Servers Again
- Ensure no errors on startup
- Test the feature end-to-end
- Clear browser cache if needed

---

## 📞 Need Help?

### Review These Files First:
1. `README.md` - Project overview
2. `SETUP_INSTRUCTIONS.md` - This file
3. `FEATURES_IMPLEMENTED.md` - Feature details
4. `FEATURE_QUICK_REFERENCE.md` - API reference

### Check Logs:
- **Backend**: Check terminal output for error messages
- **Frontend**: Press `F12` → Console tab in browser

### Common Resources:
- FastAPI Docs: http://127.0.0.1:8000/docs
- React DevTools: Browser extension
- MongoDB Compass: Visual database tool

---

## 🎯 Next Steps After Setup

1. ✅ Run both servers successfully
2. ✅ Log in with test credentials
3. ✅ Explore existing features
4. ✅ Read `FEATURES_IMPLEMENTED.md`
5. ✅ Try making a small change
6. ✅ Create your first feature!

---

**Happy Coding! 🚀**

Last Updated: November 7, 2025
