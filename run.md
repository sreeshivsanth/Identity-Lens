# 🚀 IdentityLens — Run & Deployment Guide

This guide provides step-by-step instructions to run **IdentityLens** across both development and production environments.

---

## 📑 Contents
- [Architecture Overview](#-architecture-overview)
- [Prerequisites](#-prerequisites)
- [Method 1: Docker Compose (Recommended — All Services)](#-method-1-docker-compose-recommended)
- [Method 2: Local Manual Setup (Frontend + Backend)](#-method-2-local-manual-setup)
  - [1. Frontend Dashboard (React 19 + Vite)](#1-frontend-dashboard-react-19--vite)
  - [2. Backend Engine (FastAPI)](#2-backend-engine-fastapi)
  - [3. Background Tasks & Queue (Redis + Celery)](#3-background-tasks--queue-redis--celery-optional)
- [Environment Configuration](#-environment-configuration)
- [Verifying the Installation](#-verifying-the-installation)
- [Common Troubleshooting](#-common-troubleshooting)

---

## 🏛️ Architecture Overview

IdentityLens consists of three core components:

1. **Frontend Dashboard** (`/src`): React 19 + Vite SPA with 10 operational views, glassmorphic UI, WebCrypto client-side hashing, and real-time visualization.
2. **Backend Engine API** (`/backend`): FastAPI service handling zero-knowledge scan coordination, RoBERTa sentiment analysis, spaCy PII NER, multi-jurisdiction DSAR generation, and Playwright broker opt-outs.
3. **Asynchronous Worker & Broker** (`/backend/tasks`): Celery task queue powered by Redis for scheduled scans, deep crawl jobs, and verification agents.

---

## ⚙️ Prerequisites

Ensure the following tools are installed on your machine:

| Component | Minimum Version | Recommended Version |
| :--- | :--- | :--- |
| **Node.js** | `v18.0.0+` | `v20.x` or `v22.x` |
| **npm** | `v9.0.0+` | `v10.x+` |
| **Python** | `3.10` | `3.11` (optimal for PyTorch & spaCy binary wheels) |
| **Docker & Docker Compose** *(Optional)* | `v24.0+` | Latest Docker Desktop |

---

## ⚡ Method 1: One-Click Desktop Shortcut (Fastest on Windows)

A Windows Desktop Shortcut and batch launcher have been configured in the repository.

### 1. Launch with one click
- **Desktop Shortcut:** Double-click **`IdentityLens.lnk`** directly on your Windows Desktop (or run [`launch-identitylens.bat`](file:///c:/Users/sree%20shivsanth/Downloads/identitylens/launch-identitylens.bat)).
- It automatically:
  1. Checks if Docker Desktop is active (if running, starts all containers via `docker compose up -d`).
  2. If Docker is not running, falls back to native FastAPI backend and Vite frontend automatically.
  3. Opens your default web browser to the dashboard ([http://localhost:3000](http://localhost:3000) or [http://localhost:5173](http://localhost:5173)).

### 2. Stop with one click
- Double-click [`stop-identitylens.bat`](file:///c:/Users/sree%20shivsanth/Downloads/identitylens/stop-identitylens.bat) to stop all containers and release all ports (`3000`, `5173`, `8000`).

---

## 🐳 Method 2: Docker Compose (All-in-One CLI)

The fastest CLI way to launch all microservices (Frontend, Backend API, Celery Worker, Redis broker, and Prometheus telemetry) in isolated containers:

### 1. Start all containers
Run from the project root:

```bash
docker compose up --build -d
```

### 2. Access the services

- **Frontend Dashboard:** [http://localhost:3000](http://localhost:3000)
- **FastAPI Core Engine:** [http://localhost:8000](http://localhost:8000)
- **Interactive API Docs (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Prometheus Metrics:** [http://localhost:9090](http://localhost:9090)

### 3. Manage containers

```bash
# View live container logs
docker compose logs -f

# Check running container statuses
docker compose ps

# Stop all services
docker compose down
```

---

## 💻 Method 2: Local Manual Setup

If you prefer running services directly on your host machine for development:

### 1. Frontend Dashboard (React 19 + Vite)

From the project root:

```bash
# 1. Install Node dependencies
npm install

# 2. Start the Vite development server
npm run dev
```

The frontend will be live at:
👉 **[http://localhost:5173](http://localhost:5173)**

#### Other useful frontend commands:
```bash
# Build production bundle to /dist
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint
```

---

### 2. Backend Engine (FastAPI)

Navigate to the `backend/` folder:

```bash
cd backend
```

#### Step A: Create and Activate Virtual Environment

**On Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```
*(If PowerShell blocks script execution, run: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`)*

**On Linux / macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

#### Step B: Install Dependencies

```bash
pip install -r requirements.txt
```

#### Step C: Install Playwright Browsers (Optional for automated remediation)
```bash
playwright install chromium
```

#### Step D: Optional NLP Models
The sentiment and NER engines automatically fall back to fast heuristic and regex modes if heavy models are not downloaded. To install full local models:
```bash
python -m spacy download en_core_web_sm
```

#### Step E: Start the FastAPI Server

```bash
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

The backend server is live at:
- **API Base:** [http://localhost:8000](http://localhost:8000)
- **Interactive Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

### 3. Background Tasks & Queue (Redis + Celery) *(Optional)*

If you need asynchronous OSINT scan jobs and background worker dispatch:

#### Step A: Start Redis
Using Docker (easiest on Windows/macOS):
```bash
docker run -d --name identitylens-redis -p 6379:6379 redis:7-alpine
```
Or use a native Redis server installation if available.

#### Step B: Launch Celery Worker
Make sure your Python virtual environment is activated, then run from the `backend/` folder:

**On Windows:**
```powershell
celery -A tasks.celery_app worker --loglevel=info -P solo
```
*(Note: Celery requires `-P solo` on Windows due to absence of POSIX fork).*

**On Linux / macOS:**
```bash
celery -A tasks.celery_app worker --loglevel=info --concurrency=4
```

---

## ⚙️ Environment Configuration

You can customize the backend configuration by creating a `.env` file in the `backend/` directory:

```ini
# Server Settings
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development

# Redis & Celery
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/1

# Zero-Knowledge Cryptography
DEFAULT_PBKDF2_ROUNDS=100000
ENFORCE_EPHEMERAL_STORAGE=True

# Authentication & Superadmin Credentials
ADMIN_ROOT_USERNAME=admin@identitylens.local
ADMIN_ROOT_PASSWORD=ChangeMeSecurely123!
ADMIN_EMAILS=admin@identitylens.local
ADMIN_JWT_SECRET=identitylens-secure-jwt-hmac-secret-change-me

# Dedicated GPU & Hardware Optimization (NVIDIA GeForce GTX 1650)
USE_GPU=True
CUDA_DEVICE=cuda:0
CUDA_VISIBLE_DEVICES=0
NVIDIA_VISIBLE_DEVICES=all
PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True

# External API Integrations (Optional)
HIBP_API_KEY=your_haveibeenpwned_key_here
DEHASHED_API_KEY=your_dehashed_key_here
CAPSOLVER_API_KEY=your_capsolver_key_here
PERSPECTIVE_API_KEY=your_perspective_key_here
```

### 🎮 Dedicated GPU Optimization (NVIDIA GeForce GTX 1650)
- **Automatic Binding:** When launching via `launch-identitylens.bat` or `IdentityLens.lnk`, the runtime sets `CUDA_VISIBLE_DEVICES=0` to ensure PyTorch and spaCy run on your dedicated **NVIDIA GeForce GTX 1650** rather than the integrated Intel UHD graphics.
- **Inference Speedup:** RoBERTa aspect perception classification uses half-precision **FP16** inference for minimum VRAM overhead on your 4GB card.
- **Hardware Telemetry Endpoint:** Test GPU status directly via `curl http://localhost:8000/api/v1/system/gpu`.

### 👑 Superadmin Credentials (Configurable in backend `.env`)
- **Admin Email / Username:** `admin@identitylens.local` (or whatever configured in your `.env`)
- **Master Admin Password:** Set in `ADMIN_ROOT_PASSWORD` in `backend/.env`
- **Google OAuth Login:** Any Google account can sign in. Configured admin emails receive automatic `SUPERADMIN` status with platform-wide inspection rights and unlimited scan quotas. Other Google users receive `STANDARD_USER` accounts with isolated personal vaults.

---

## 🧪 Verifying the Installation

### 1. Test Backend Health Check
```bash
curl http://localhost:8000/health
```
Expected response:
```json
{
  "status": "healthy",
  "service": "IdentityLens Engine",
  "version": "1.0.4-RELEASE",
  "zero_knowledge_enforced": true
}
```

### 2. Test Sentiment Analysis Endpoint
```bash
curl -X POST "http://localhost:8000/api/v1/sentiment/analyze" \
     -H "Content-Type: application/json" \
     -d "{\"text\": \"Their code architecture is clean, efficient, and well structured.\"}"
```

### 3. Test Legal DSAR Notice Generator
```bash
curl -X POST "http://localhost:8000/api/v1/remediation/dsar" \
     -H "Content-Type: application/json" \
     -d "{\"jurisdiction\": \"GDPR\", \"target_entity\": \"Acme Corp\", \"user_name\": \"John Doe\", \"user_email\": \"johndoe@example.com\"}"
```

---

## ❓ Common Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **Port 5173 or 8000 already in use** | Another local process is binding the port | Specify another port: `npm run dev -- --port 5174` or `uvicorn main:app --port 8001` |
| **PowerShell script execution error** | Execution policy prevents virtualenv activation | Run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` in your PowerShell session |
| **Celery fails on Windows** | Windows does not support `fork()` multiprocessing | Append `-P solo` to the worker command: `celery -A tasks.celery_app worker -P solo` |
| **PyTorch / transformers install error** | Python 3.13+ or 3.14 compatibility with PyTorch wheels | Use Python 3.10 or 3.11 for the backend venv, or use Docker which isolates Python 3.11 automatically |
| **Playwright Chromium missing** | Browser binaries not downloaded | Run `playwright install chromium` inside your active virtual environment |
