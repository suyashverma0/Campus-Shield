# Campus Shield — AI-Powered University Lost & Found Platform

Campus Shield is an end-to-end, full-stack college Lost & Found platform powered by PyTorch ResNet50 CNN feature extraction, Node.js/Express, MongoDB Atlas, and a React + Vite frontend.

---

## 🏗️ Architecture

```
React (Vite) Frontend [Port 5173]
       ↕  (REST APIs + JWT Bearer + FormData Uploads)
Node.js / Express Backend [Port 5000] ─── Static Image Serving (/uploads)
       ↕                                  └── MongoDB Atlas / MongoMemoryServer
Python FastAPI AI Service [Port 8000] (ResNet50 2048-d Feature Extraction & Cosine Similarity)
```

---

## 🚀 Running the Full Stack Locally

### 1. Python FastAPI AI Service
```bash
cd campus-shield/ai-service
# Activate virtual environment
.venv/Scripts/python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
Health check: `http://127.0.0.1:8000/health`

### 2. Node.js Express Backend
```bash
cd campus-shield/backend
npm start
```
Server: `http://localhost:5000` (API routes at `http://localhost:5000/api`)

### 3. React Frontend
```bash
cd campus-shield/frontend
npm run dev
```
Open: `http://localhost:5173`

---

## 🧪 Running Tests

### AI Service Tests (Pytest)
```bash
cd campus-shield/ai-service
.venv/Scripts/python.exe -m pytest
```

### Backend Integration Tests (Vitest)
```bash
cd campus-shield/backend
npm test
```

### End-to-End AI Workflow Verification
```bash
cd campus-shield/backend
node tests/verify_e2e.js
```
