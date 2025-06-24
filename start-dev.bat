# Script Pour Windows CMD classique

@echo off
echo ==============================
echo  Starting LittleBill Project
echo ==============================
echo.

REM Activer l'environnement virtuel
call venv\Scripts\activate.bat

echo [1/2] Lancement du backend (FastAPI)...
start "FastAPI Backend" cmd /k "uvicorn app.main:app --reload"

echo [2/2] Lancement du frontend (React)...
cd frontend-react
start "React Frontend" cmd /k "npm start"
cd ..

echo.
echo Tout est lancé !
echo Backend : http://localhost:8000
echo Frontend : http://localhost:3000
echo Documentation API : http://localhost:8000/docs
echo.
pause
