#!/bin/bash

# NutriSaarthi Quick Start Script for macOS/Linux
# This script sets up and starts both backend and frontend

echo ""
echo "========================================"
echo "NutriSaarthi - Development Setup"
echo "========================================"
echo ""

# Check if backend virtual env exists
if [ ! -d "backend/venv" ]; then
    echo "[1/6] Creating Python virtual environment..."
    cd backend
    python3 -m venv venv
    cd ..
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi

# Install backend dependencies
echo "[2/6] Installing backend dependencies..."
cd backend
source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1
cd ..
echo "✓ Backend dependencies installed"

# Check and copy backend .env
if [ ! -f "backend/.env" ]; then
    echo "[3/6] Creating backend .env file..."
    cp backend/env.example backend/.env
    echo "✓ Backend .env created (edit with your values)"
else
    echo "✓ Backend .env already exists"
fi

# Install frontend dependencies
echo "[4/6] Installing frontend dependencies..."
cd frontend
npm install > /dev/null 2>&1
cd ..
echo "✓ Frontend dependencies installed"

# Check and copy frontend .env
if [ ! -f "frontend/.env" ]; then
    echo "[5/6] Creating frontend .env file..."
    cp frontend/env.example frontend/.env
    echo "✓ Frontend .env created"
else
    echo "✓ Frontend .env already exists"
fi

echo "[6/6] Setup complete!"
echo ""
echo "========================================"
echo "To start development:"
echo "========================================"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python -c \"import sys; sys.path.insert(0, '.'); from uvicorn.main import run; run('main:app', host='127.0.0.1', port=8000)\""
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then open: http://127.0.0.1:5174"
echo "API Docs:  http://127.0.0.1:8000/docs"
echo ""
echo "========================================"
echo ""
