# 📦 Deployment Commands Reference

Quick copy-paste commands for deployment.

---

## 🗄️ MongoDB Atlas Setup Commands

### 1. Connection String Format
```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/nutrisaarthi?retryWrites=true&w=majority
```

### 2. Test MongoDB Connection (from backend)
```bash
cd backend
python -c "from pymongo import MongoClient; client = MongoClient('YOUR_CONNECTION_STRING'); print(list(client.db.collection_names()))"
```

---

## 🚀 Backend Deployment (Render)

### 1. Prepare Backend

```bash
# Generate requirements.txt
cd backend
pip freeze > requirements.txt

# Verify main.py has correct imports
cat main.py | grep "load_dotenv\|os.getenv"
```

### 2. Render Deployment Settings

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
gunicorn main:app --bind 0.0.0.0:$PORT
```

**Environment Variables:**
```
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/nutrisaarthi?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-generate-this-randomly
JWT_ALGORITHM=HS256
CORS_ORIGINS=https://your-frontend.vercel.app
DEBUG=False
HOST=0.0.0.0
PORT=8000
```

### 3. Verify Deployment

```bash
# Test API endpoint (replace with your URL)
curl https://your-backend.onrender.com/docs

# Test specific endpoint
curl -X GET https://your-backend.onrender.com/api/v1/foods/search?q=rice

# Check health
curl https://your-backend.onrender.com/health
```

---

## 🎨 Frontend Deployment (Vercel)

### 1. Prepare Frontend

```bash
cd frontend

# Install dependencies
npm install

# Build locally to test
npm run build

# Preview build
npm run preview
```

### 2. Vercel Configuration

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```bash
dist
```

**Root Directory:**
```bash
frontend
```

**Environment Variables:**
```
VITE_API_BASE_URL=https://your-backend.onrender.com
VITE_APP_NAME=NutriSaarthi
VITE_APP_VERSION=1.0.0
```

### 3. Verify Deployment

```bash
# Test frontend URL (replace with your URL)
curl https://your-frontend.vercel.app

# Should return HTML content
```

---

## 🔄 Git Commands for Deployment

### Push to GitHub (triggers auto-deploy)

```bash
# Add all changes
git add .

# Commit
git commit -m "feat: Deploy to production"

# Push to main (Render and Vercel will auto-deploy)
git push origin main
```

### Check Git Status
```bash
git status
git log --oneline -5
```

---

## 📋 Environment Variables Summary

### Backend (.env)
```
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/nutrisaarthi?retryWrites=true&w=majority
JWT_SECRET=generate-random-string-here-use-32-chars
JWT_ALGORITHM=HS256
CORS_ORIGINS=https://your-vercel-app.vercel.app
DEBUG=False
HOST=0.0.0.0
PORT=8000
```

### Frontend (.env)
```
VITE_API_BASE_URL=https://your-render-app.onrender.com
VITE_APP_NAME=NutriSaarthi
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_TRACKING=false
```

---

## 🔒 Generating Random JWT Secret

### Using Python
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Using OpenSSL
```bash
openssl rand -base64 32
```

### Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🧪 Testing After Deployment

### 1. Backend Health Check
```bash
# Check if backend is running
curl https://your-backend.onrender.com

# Check API docs (Swagger UI)
curl https://your-backend.onrender.com/docs

# Get API status
curl https://your-backend.onrender.com/api/v1/health
```

### 2. Frontend Health Check
```bash
# Check if frontend loads
curl https://your-frontend.vercel.app | head -20

# Should show HTML content
```

### 3. API Endpoints Test

```bash
# Test foods search
curl "https://your-backend.onrender.com/api/v1/foods/search?q=rice"

# Test signup (should work or show auth error)
curl -X POST https://your-backend.onrender.com/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Test dashboard tip
curl -X GET https://your-backend.onrender.com/api/v1/dashboard/tip \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📊 Monitoring Commands

### Check Render Logs (via curl)
```bash
# Render provides logs in dashboard
# Go to: https://dashboard.render.com → Your Service → Logs
```

### Check Vercel Logs (via curl)
```bash
# Vercel provides logs in dashboard
# Go to: https://vercel.com → Project → Deployments → Logs
```

### Monitor Using curl (simple heartbeat)
```bash
# Check backend every 5 seconds
while true; do
  curl -s https://your-backend.onrender.com/docs > /dev/null && echo "✓ Backend OK" || echo "✗ Backend Down"
  sleep 5
done
```

---

## 🔧 Useful Environment Variable Generation

### Generate JWT Secret (recommended)
```bash
# 32-character random string
python -c "import secrets; print(f'JWT_SECRET={secrets.token_urlsafe(32)}')"
```

### Generate Database URI Test
```bash
# Replace with your credentials
echo "mongodb+srv://nutrisaarthi_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/nutrisaarthi?retryWrites=true&w=majority"
```

---

## 🚨 Common Deployment Issues

### Issue: "Module not found" Error
```bash
# Solution: Reinstall dependencies
pip install -r backend/requirements.txt
npm install --prefix frontend
```

### Issue: "Connection refused" to MongoDB
```bash
# Solution: Check IP whitelist in MongoDB Atlas
# Go to: https://cloud.mongodb.com → Network Access → Add IP Address
# Set to: 0.0.0.0/0 (allow anywhere)
```

### Issue: CORS Error from Frontend
```bash
# Solution: Update CORS_ORIGINS in backend
# CORS_ORIGINS=https://your-vercel-url.vercel.app,https://another-url.com
```

### Issue: Frontend "Cannot find API"
```bash
# Solution: Check VITE_API_BASE_URL
# Verify it matches your backend URL exactly
# No trailing slash: https://backend.onrender.com (not https://backend.onrender.com/)
```

---

## 📱 Quick Deploy Status Check

```bash
#!/bin/bash
echo "🔍 Checking Deployment Status..."
echo ""

BACKEND_URL="https://your-backend.onrender.com"
FRONTEND_URL="https://your-frontend.vercel.app"

# Check Backend
echo "📊 Backend: $BACKEND_URL"
curl -s -o /dev/null -w "HTTP %{http_code}\n" $BACKEND_URL/docs

# Check Frontend
echo "🎨 Frontend: $FRONTEND_URL"
curl -s -o /dev/null -w "HTTP %{http_code}\n" $FRONTEND_URL

# Check API Connection
echo "🔗 API Connection:"
curl -s -o /dev/null -w "HTTP %{http_code}\n" $BACKEND_URL/api/v1/foods/search?q=test

echo ""
echo "✅ If all show HTTP 200 or 404, deployment is successful!"
```

---

## 🎯 Post-Deployment Steps

```bash
# 1. Verify GitHub is up to date
git status

# 2. Check live URLs work
curl https://your-backend.onrender.com/docs
curl https://your-frontend.vercel.app

# 3. Test complete flow
# - Open frontend URL in browser
# - Sign up with test account
# - Log meal
# - Check water tracking
# - View coaching tip

# 4. Share URLs
echo "🎉 Your app is live!"
echo "Frontend: https://your-frontend.vercel.app"
echo "Backend API: https://your-backend.onrender.com"
```

---

## 📖 Reference Links

- **Render Deploy Guide**: https://render.com/docs/deploy-python
- **Vercel Deploy Guide**: https://vercel.com/docs/deployments/overview
- **MongoDB Connection**: https://docs.atlas.mongodb.com/driver-connection
- **FastAPI with Gunicorn**: https://fastapi.tiangolo.com/deployment/concepts/#running-a-server

---

Last Updated: November 7, 2025
