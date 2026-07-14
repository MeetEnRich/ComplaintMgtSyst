@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo         ComplaintIQ Automated Setup Script
echo ========================================================
echo.

:: 1. Check Prerequisites
echo [1/4] Checking prerequisites...

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python 3.10+ and try again.
    pause
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js (npm) is not installed or not in PATH.
    echo Please install Node.js 18+ and try again.
    pause
    exit /b 1
)
echo OK - Python and Node.js found.
echo.

:: 2. Backend Setup
echo [2/4] Setting up Express Backend (Node.js)...
cd server
if not exist ".env" (
    if exist ".env.example" (
        echo Creating .env file from .env.example...
        copy .env.example .env >nul
    )
)
call npm install
cd ..
echo OK - Backend dependencies installed.
echo.

:: 3. Frontend Setup
echo [3/4] Setting up React Frontend (Vite)...
cd client
if not exist ".env" (
    echo Creating client/.env file...
    echo VITE_API_URL=http://localhost:5001/api > .env
)
call npm install
cd ..
echo OK - Frontend dependencies installed.
echo.

:: 4. ML Microservice Setup
echo [4/4] Setting up Flask ML Microservice (Python)...
cd ml
if not exist ".venv" (
    echo Creating Python virtual environment...
    python -m venv .venv
)
echo Installing ML requirements (this may take a few minutes)...
call .venv\Scripts\activate.bat
pip install -r requirements.txt
deactivate
cd ..
echo OK - ML Microservice dependencies installed.
echo.

echo ========================================================
echo                   Setup Complete!
echo ========================================================
echo You can now start the application by double-clicking:
echo start.bat
echo.
pause
