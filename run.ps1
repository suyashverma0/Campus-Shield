Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting Campus Shield Full-Stack + AI System" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

Write-Host "[1/3] Starting Python FastAPI AI Service (Port 8000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd campus-shield/ai-service; .venv/Scripts/python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

Write-Host "[2/3] Starting Node.js Express Backend (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd campus-shield/backend; npm.cmd start"

Write-Host "[3/3] Starting Vite Frontend (Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd campus-shield/frontend; npm.cmd run dev"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "  All 3 services launched in separate windows!" -ForegroundColor Green
Write-Host "  Frontend:   http://localhost:5173" -ForegroundColor Green
Write-Host "  Backend:    http://localhost:5000/api" -ForegroundColor Green
Write-Host "  AI Service: http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green

