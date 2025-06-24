# Script pour PowerShell

Write-Host "===============================" -ForegroundColor Green
Write-Host "   Starting LittleBill Project" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green
Write-Host ""

# Aller à la racine du script
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

# Activer l'environnement virtuel
& "$root\venv\Scripts\Activate.ps1"

Write-Host "[1/2] Lancement du backend (FastAPI)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "uvicorn app.main:app --reload"

Write-Host "[2/2] Lancement du frontend (React)..." -ForegroundColor Yellow
Start-Process powershell -WorkingDirectory "$root\frontend-react" -ArgumentList "-NoExit", "-Command", "npm start"

Write-Host ""
Write-Host "✅ Tout est lancé !" -ForegroundColor Green
Write-Host "Backend : http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend : http://localhost:3000" -ForegroundColor Cyan
Write-Host "API Docs : http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Appuie sur une touche pour quitter cette fenêtre..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

