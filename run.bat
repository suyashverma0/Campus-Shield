@echo off
echo ========================================================
echo   Starting Campus Shield Full-Stack + AI System
echo ========================================================

echo [1/3] Starting Python FastAPI AI Service (Port 8000)...
start "Campus Shield - AI Service" cmd /k "cd campus-shield\ai-service && .venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

echo [2/3] Starting Node.js Express Backend (Port 5000)...
start "Campus Shield - Backend" cmd /k "cd campus-shield\backend && npm.cmd start"

echo [3/3] Starting Vite Frontend (Port 5173)...
start "Campus Shield - Frontend" cmd /k "cd campus-shield\frontend && npm.cmd run dev"

echo ========================================================
echo   All 3 services launched!
echo   Frontend:   http://localhost:5173
echo   Backend:    http://localhost:5000/api
echo   AI Service: http://127.0.0.1:8000
echo ========================================================

