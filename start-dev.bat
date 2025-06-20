@echo off
echo Starting LittleBill Development Environment...
echo.

echo [1/2] Starting FastAPI Backend...
cd /d "%~dp0"
call venv\Scripts\activate.bat
start "FastAPI Backend" cmd /k "uvicorn app.main:app --reload"

echo [2/2] Starting React Frontend...
cd frontend-react
start "React Frontend" cmd /k "npm start"

echo.
echo Development servers are starting...
echo.
echo Backend (API): http://localhost:8000
echo Frontend (React): http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo.
echo Press any key to exit...
pause >nul
