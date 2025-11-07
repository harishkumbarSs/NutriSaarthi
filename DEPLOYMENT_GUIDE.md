# 🚀 NutriSaarthi - Deployment Guide

Complete guide to deploy NutriSaarthi on free platforms.

---

## 📋 Deployment Options Overview

| Platform | Best For | Free Tier | Setup Time |
|----------|----------|-----------|-----------|
| **Vercel** | Frontend (React) | ✅ Yes | 5 min |
| **Render** | Backend (FastAPI) | ✅ Yes | 10 min |
| **Railway** | Backend (FastAPI) | ✅ Yes (limited) | 10 min |
| **MongoDB Atlas** | Database | ✅ Yes | 10 min |
| **Netlify** | Frontend (React) | ✅ Yes | 5 min |

---

## 🎯 Recommended Stack (Free)

- **Frontend**: Vercel (React + Vite)
- **Backend**: Render (FastAPI + Python)
- **Database**: MongoDB Atlas (Cloud MongoDB)

---

# PART 1: DATABASE SETUP (MongoDB Atlas)

## Step 1: Create MongoDB Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Register Free"
3. Sign up with email or GitHub
4. Verify your email

## Step 2: Create a Free Cluster

1. After login, click "Build a Database"
2. Select **M0 Sandbox** (Free tier)
3. Choose your preferred region (closest to you)
4. Click "Create"
5. Wait 2-3 minutes for cluster creation

## Step 3: Create Database User

1. In left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Set username: `nutrisaarthi_user`
5. Set a strong password (save it!)
6. Click "Add User"

## Step 4: Add IP Whitelist

1. In left sidebar, click "Network Access"
2. Click "Add IP Address"
3. Select "Allow access from anywhere" (0.0.0.0/0)
4. Click "Confirm"

## Step 5: Get Connection String

1. Click "Database" in left sidebar
2. Click "Connect" button on your cluster
3. Select "Drivers" → "Python" → "3.12 or later"
4. Copy the connection string

**Your connection string:**
```
mongodb+srv://nutrisaarthi_user:12Harish34@cluster0.0qft9xv.mongodb.net/?appName=Cluster0
```

**Important**: MongoDB Atlas requires **Python 3.12 or later** for this connection string format.

Save this for later!

---

# PART 2: BACKEND DEPLOYMENT (Render)

## ⚠️ IMPORTANT: Python 3.12+ Required

MongoDB Atlas now requires **Python 3.12 or later**. Make sure your local environment and Render deployment both use Python 3.12+.

### Check Your Python Version Locally

```bash
python --version
```

If you have Python 3.12+, you're good. If not, download from https://www.python.org/downloads/

## Step 1: Prepare Backend for Deployment

### 1.1: Create `backend/requirements.txt`

Create or update your `backend/requirements.txt` with these exact packages:

```
fastapi==0.109.0
uvicorn==0.27.0
pymongo==4.6.0
pyjwt==2.8.0
pydantic==2.5.0
pydantic-settings==2.1.0
gunicorn==20.1.0
python-dotenv==0.21.0
```

**Note**: The `requirements.txt` file is already created in your project with these exact packages. ✅

### 1.2: Update `backend/main.py` for Production

Make sure your `main.py` handles environment variables:

```python
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/nutrisaarthi")
```

### 1.3: Create `backend/build.sh`

```bash
#!/bin/bash
pip install -r requirements.txt
```

### 1.4: Update `backend/.env` for Production

Create environment file with:
```
MONGODB_URI=mongodb+srv://nutrisaarthi_user:12Harish34@cluster0.0qft9xv.mongodb.net/?appName=Cluster0
JWT_SECRET=your-production-secret-key-change-this
JWT_ALGORITHM=HS256
CORS_ORIGINS=https://your-frontend-url.vercel.app
HOST=0.0.0.0
PORT=8000
DEBUG=False
```

## Step 2: Deploy to Render

### 2.1: Create Render Account

1. Go to: https://render.com
2. Click "Sign Up"
3. Sign up with GitHub (easiest)
4. Authorize Render to access GitHub

### 2.2: Create New Web Service

1. Click "+" → "Web Service"
2. Select "Deploy an existing Git repository"
3. Authorize Render to access your GitHub
4. Select `NutriSaarthi` repository

### 2.3: Configure Service

**Fill in these details:**

- **Name**: `nutrisaarthi-api` (or any name)
- **Root Directory**: `backend` (important!)
- **Runtime**: `Python 3.12` (required for MongoDB)
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn main:app`
- **Plan**: `Free` (on right side)

### 2.4: Add Environment Variables

1. Scroll down to "Environment"
2. Add these key-value pairs:

```
MONGODB_URI = mongodb+srv://nutrisaarthi_user:12Harish34@cluster0.0qft9xv.mongodb.net/?appName=Cluster0
JWT_SECRET = your-production-secret-key
JWT_ALGORITHM = HS256
CORS_ORIGINS = https://your-frontend-url.vercel.app
DEBUG = False
```

### 2.5: Deploy

1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. You'll get a URL like: `https://nutrisaarthi-api.onrender.com`
4. Copy this URL for frontend configuration

**Note**: Free tier on Render spins down after 15 minutes of inactivity. It will restart when accessed (takes 30 seconds).

---

# PART 3: FRONTEND DEPLOYMENT (Vercel)

## Step 1: Prepare Frontend for Deployment

### 1.1: Update `frontend/.env` for Production

```
VITE_API_BASE_URL=https://nutrisaarthi-api.onrender.com
```

### 1.2: Build and Test Locally

```bash
cd frontend
npm run build
npm run preview
```

Verify everything works before deploying.

## Step 2: Deploy to Vercel

### 2.1: Create Vercel Account

1. Go to: https://vercel.com
2. Click "Sign Up"
3. Sign up with GitHub (easiest)

### 2.2: Import Project

1. Click "Add New..." → "Project"
2. Select "Import Git Repository"
3. Paste your GitHub repo URL or select from list
4. Click "Import"

### 2.3: Configure Project

**Fill in these details:**

- **Project Name**: `nutrisaarthi`
- **Framework**: `Vite`
- **Root Directory**: `frontend` (click "Edit" to change)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: (see below)

### 2.4: Add Environment Variables

1. In "Environment Variables" section, add:

```
VITE_API_BASE_URL = https://nutrisaarthi-api.onrender.com
```

### 2.5: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes
3. You'll get a URL like: `https://nutrisaarthi.vercel.app`

**That's it!** Your app is live! 🎉

---

# Alternative: Deploy Backend on Railway

If you prefer Railway over Render:

## Step 1: Create Railway Account

1. Go to: https://railway.app
2. Sign up with GitHub
3. Authorize Railway

## Step 2: Create New Project

1. Click "Create New Project"
2. Select "Deploy from GitHub repo"
3. Select your `NutriSaarthi` repository

## Step 3: Add Environment Variables

1. Click on your project
2. Go to "Variables"
3. Add your MongoDB URI and other env variables

## Step 4: Configure Service

1. Click "main" service
2. Set "Start Command": `gunicorn main:app --bind 0.0.0.0:$PORT`
3. Set "Root Directory": `backend`

---

# Alternative: Deploy Frontend on Netlify

If you prefer Netlify over Vercel:

## Step 1: Create Netlify Account

1. Go to: https://netlify.com
2. Sign up with GitHub

## Step 2: Deploy

1. Click "Add New Site" → "Import an existing project"
2. Select your GitHub repository
3. Set Build command: `npm run build` (in frontend folder)
4. Set Publish directory: `frontend/dist`
5. Add environment variable: `VITE_API_BASE_URL=your-backend-url`
6. Click "Deploy"

---

# Updating & Redeployment

## Automatic Deployment (Recommended)

Both Vercel and Render support automatic deployment:

1. Push changes to GitHub main branch
2. Vercel/Render automatically redeploys
3. Your changes are live in 1-2 minutes

## Manual Deployment

### Render Backend:
1. Push code to GitHub
2. Render automatically redeploys (webhook)

### Vercel Frontend:
1. Push code to GitHub
2. Vercel automatically redeploys (webhook)

---

# Testing After Deployment

## 1. Test Backend API

```bash
# Check if API is running
curl https://nutrisaarthi-api.onrender.com/docs

# Test an endpoint
curl -X GET https://nutrisaarthi-api.onrender.com/api/v1/foods/search?q=rice
```

## 2. Test Frontend

1. Open: `https://nutrisaarthi.vercel.app`
2. Try to sign up/login
3. Test meal logging
4. Check water tracking
5. Verify coaching tips appear

## 3. Check Backend Logs

**Render:**
1. Go to your Render dashboard
2. Click your service
3. Click "Logs" tab
4. Look for errors

**Railway:**
1. Click your project
2. Go to "Logs" section
3. Check for errors

---

# Common Issues & Solutions

## Issue 1: Backend Returns 502 Bad Gateway

**Causes:**
- Environment variables not set
- MongoDB connection string wrong
- Dependencies not installed

**Solutions:**
1. Check all environment variables are correct
2. Verify MongoDB Atlas connection string
3. View deployment logs for errors

## Issue 2: Frontend Shows "Cannot Connect to API"

**Causes:**
- `VITE_API_BASE_URL` not set correctly
- Backend URL changed
- CORS issues

**Solutions:**
1. Check `VITE_API_BASE_URL` in Vercel environment
2. Verify backend URL is correct
3. Check backend CORS_ORIGINS includes frontend URL

## Issue 3: "Free Instance Spinning Down" Error

**This happens on Render free tier:**
- Free instances sleep after 15 minutes of inactivity
- First request after sleep takes 30 seconds
- **Solution**: Upgrade to paid tier or use Railway

## Issue 4: MongoDB Connection Timeout

**Causes:**
- IP whitelist not configured
- Connection string has wrong password
- Network issue

**Solutions:**
1. Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0)
2. Verify connection string and password
3. Try from different network

---

# Cost Breakdown (FREE)

| Service | Cost | Notes |
|---------|------|-------|
| **Vercel** | $0 | Unlimited apps, 100GB bandwidth |
| **Render** | $0 | Free tier with sleep mode |
| **Railway** | $0 | $5 credit monthly |
| **MongoDB Atlas** | $0 | 512MB storage free |
| **TOTAL** | **$0/month** | ✅ Completely free! |

---

# Production Checklist

Before going live, ensure:

- [ ] All environment variables are set
- [ ] MongoDB Atlas is configured
- [ ] CORS_ORIGINS includes your frontend URL
- [ ] Frontend VITE_API_BASE_URL is correct
- [ ] API endpoints respond with 200 OK
- [ ] Frontend loads without errors
- [ ] Authentication works (signup/login)
- [ ] Meal logging works
- [ ] Water tracking works
- [ ] Coaching tips appear
- [ ] Smart water goals display

---

# Monitoring & Maintenance

## Monitoring Deployments

**Vercel:**
- Click project → "Analytics" tab
- Monitor response times and errors

**Render:**
- Click service → "Metrics" tab
- Monitor CPU, memory, bandwidth

## Logs

**Check logs regularly for:**
- API errors
- Database connection issues
- Unhandled exceptions
- Performance warnings

---

# Scaling After Free Tier

When ready to upgrade:

### Vercel
- **Hobby Plan**: $20/month
- **Pro Plan**: $25/month
- Unlimited deployments, priority support

### Render
- **Starter Plan**: $7/month
- No auto spin-down
- Better performance

### Railway
- **Usage-based**: Starting at $5/month
- Pay only what you use

---

# Next Steps

1. ✅ Set up MongoDB Atlas
2. ✅ Deploy backend on Render
3. ✅ Deploy frontend on Vercel
4. ✅ Test everything works
5. ✅ Share your app with others!

---

## 📞 Support Links

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Railway Docs**: https://docs.railway.app
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com

---

**Your app is now live on the internet! 🌍🎉**

Last Updated: November 7, 2025
