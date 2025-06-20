Write-Host "Starting LittleBill Development Environment..." -ForegroundColor Green
Write-Host ""

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "[1/2] Starting FastAPI Backend..." -ForegroundColor Yellow
Set-Location $scriptDir
& .\venv\Scripts\Activate.ps1
Start-Process powershell -ArgumentList "-NoExit", "-Command", "uvicorn app.main:app --reload" -WindowStyle Normal

Write-Host "[2/2] Starting React Frontend..." -ForegroundColor Yellow
Set-Location "$scriptDir\frontend-react"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start" -WindowStyle Normal

Write-Host ""
Write-Host "Development servers are starting..." -ForegroundColor Green
Write-Host ""
Write-Host "Backend (API): http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend (React): http://localhost:3000" -ForegroundColor Cyan
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
