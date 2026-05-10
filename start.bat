@echo off
title ComplaintIQ - Starting All Servers

echo.
echo  ========================================
echo    ComplaintIQ - Complaint Management
echo  ========================================
echo.

echo  [1/3] Starting Flask ML API on port 5000...
start "Flask ML API" cmd /k "cd /d %~dp0ml && .venv\Scripts\activate && python app.py"

timeout /t 3 /nobreak >nul

echo  [2/3] Starting Express Backend on port 5001...
start "Express Backend" cmd /k "cd /d %~dp0server && npm run dev"

timeout /t 3 /nobreak >nul

echo  [3/3] Starting React Frontend on port 5173...
start "React Frontend" cmd /k "cd /d %~dp0client && npm run dev"

timeout /t 4 /nobreak >nul

echo.
echo  ========================================
echo    All servers started successfully
echo  ========================================
echo.
echo   Flask API   : http://localhost:5000
echo   Express API : http://localhost:5001
echo   React App   : http://localhost:5173
echo.
echo   Admin Login : http://localhost:5173/login
echo   Credentials : admin / admin1234
echo.
echo  Press any key to open the app in browser...
pause >nul

start http://localhost:5173