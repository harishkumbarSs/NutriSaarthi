@echo off
REM NutriSaarthi Quick Start Script for Windows
REM This script sets up and starts both backend and frontend

echo.
echo ========================================
echo NutriSaarthi - Development Setup
echo ========================================
echo.

REM Check if backend virtual env exists
if not exist "backend\venv" (
    echo [1/6] Creating Python virtual environment...
    cd backend
    python -m venv venv
    cd ..
    echo ✓ Virtual environment created
) else (
    echo ✓ Virtual environment already exists
)

REM Install backend dependencies
echo [2/6] Installing backend dependencies...
cd backend
call venv\Scripts\activate
pip install -r requirements.txt > nul 2>&1
cd ..
echo ✓ Backend dependencies installed

REM Check and copy backend .env
if not exist "backend\.env" (
    echo [3/6] Creating backend .env file...
    copy backend\env.example backend\.env > nul
    echo ✓ Backend .env created (edit with your values)
) else (
    echo ✓ Backend .env already exists
)

REM Install frontend dependencies
echo [4/6] Installing frontend dependencies...
cd frontend
call npm install > nul 2>&1
cd ..
echo ✓ Frontend dependencies installed

REM Check and copy frontend .env
if not exist "frontend\.env" (
    echo [5/6] Creating frontend .env file...
    copy frontend\env.example frontend\.env > nul
    echo ✓ Frontend .env created
) else (
    echo ✓ Frontend .env already exists
)

echo [6/6] Setup complete!
echo.
echo ========================================
echo To start development:
echo ========================================
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   venv\Scripts\activate
echo   python -c "import sys; sys.path.insert(0, '.'); from uvicorn.main import run; run('main:app', host='127.0.0.1', port=8000)"
echo.
echo Terminal 2 - Frontend:
echo   cd frontend
echo   npm run dev
echo.
echo Then open: http://127.0.0.1:5174
echo API Docs:  http://127.0.0.1:8000/docs
echo.
echo ========================================
echo.
pause
