<div align="center">

# 🔍 IdentityLens

### Digital Identity Intelligence & Autonomous OSINT Remediation Platform

**OSINT Scanner (Username & Gmail/Email) • Perception AI • Autonomous Data Removal • Zero-Knowledge Enclave**

[![Version](https://img.shields.io/badge/version-v1.0.4--RELEASE-blue?style=flat-square)](#-changelog)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](#-license)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)](#-tech-stack)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat-square&logo=vite)](#-tech-stack)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi)](#-tech-stack)
[![Hardware](https://img.shields.io/badge/Hardware-RTX%205060%20%7C%20i7--14700HX-76B900?style=flat-square&logo=nvidia)](#-hardware-acceleration--device-optimization)
[![Architecture](https://img.shields.io/badge/arch-Microservices%20%2F%20Zero--Knowledge-purple?style=flat-square)](#-system-architecture-diagram)

---

*IdentityLens is an enterprise-grade, privacy-first platform that uncovers digital exposure footprints across 400+ online platforms and 3,000+ data brokers using both **Usernames** and **Gmail / Email addresses**. It monitors credential breach repositories, performs RoBERTa aspect-based perception sentiment analysis, and executes autonomous Playwright and DSAR deletion protocols under GDPR, CCPA, and VCDPA — without permanently storing raw personal data on central servers.*

</div>

---

## 📑 Table of Contents

- [✨ Features](#-features)
  - [OSINT Discovery & Forensics (Username & Gmail/Email)](#-osint-discovery--forensics-username--gmailemail)
  - [Monitored Online Platforms](#-monitored-online-platforms)
  - [Perception AI & Aspect Sentiment Analysis](#-perception-ai--aspect-sentiment-analysis)
  - [Autonomous Remediation & Legal DSAR Engine](#-autonomous-remediation--legal-dsar-engine)
  - [Zero-Knowledge Client Cryptography](#-zero-knowledge-client-cryptography)
- [🎮 Hardware Acceleration & Device Optimization](#-hardware-acceleration--device-optimization)
- [🏛️ System Architecture Diagram](#-system-architecture-diagram)
- [💻 Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Quickstart & Installation](#-quickstart--installation)
  - [Prerequisites](#prerequisites)
  - [Method 1: Docker Compose (All-in-One CLI)](#method-1-docker-compose-all-in-one-cli)
  - [Method 2: One-Click Desktop Shortcut (Windows)](#method-2-one-click-desktop-shortcut-windows)
  - [Method 3: Local Manual Setup (Frontend + Backend)](#method-3-local-manual-setup-frontend--backend)
    - [1. Frontend Dashboard (React 19 + Vite)](#1-frontend-dashboard-react-19--vite)
    - [2. Backend Engine (FastAPI)](#2-backend-engine-fastapi)
    - [3. Background Tasks & Worker (Redis + Celery)](#3-background-tasks--worker-redis--celery-optional)
- [⚙️ Environment Configuration (`.env`)](#-environment-configuration-env)
- [🔐 Zero-Knowledge Cryptographic Protocol](#-zero-knowledge-cryptographic-protocol)
- [📡 API Reference](#-api-reference)
- [🧪 Verifying the Installation](#-verifying-the-installation)
- [❓ Common Troubleshooting](#-common-troubleshooting)
- [🗺️ Roadmap & Completion Ledger](#-roadmap--completion-ledger)
- [📝 Changelog](#-changelog)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🔍 OSINT Discovery & Forensics (Username & Gmail/Email)
- **Dual-Mode OSINT Reconnaissance**:
  - **Username / Handle Search**: High-speed asynchronous probing across leading social networks, developer hubs, and publishing platforms utilizing Sherlock and WhatsMyName signature patterns.
  - **Instagram Deep Metadata & Profile Probe**:
    - Web crawler meta inspection bypassing client-side SPA rendering traps.
    - Verifies legitimate accounts vs 404 nonexistent pages via OpenGraph `<meta property="og:type" content="profile">` inspection.
    - Extracts public bio and account metrics: **Follower Count**, **Following Count**, and **Post Count**.
  - **Gmail & Email Reconnaissance**:
    - **Gravatar Reverse MD5 Hashing**: Computes WebCrypto client-side MD5 to detect registered user profiles, display names, and linked accounts.
    - **GitHub User Email Correlation**: Discovers commit authors and profiles via `/search/users?q={email}+in:email`.
    - **Live Breach Indexing**: Integrates real-time verification feeds (XposedOrNot & HaveIBeenPwned) to extract exposed services, passwords, and leak dates.
    - **Google Account Handle Normalization**: Strips dot variations (e.g., `first.last@gmail.com` $\to$ `firstlast`) and domain prefixes to trace linked footprints across secondary networks.

#### 🌐 Monitored Online Platforms:
| Platform | Category | Probe Method | Metadata Extracted |
| :--- | :--- | :--- | :--- |
| **Instagram** | Social Media | OpenGraph crawler inspection | Bio, Followers, Following, Post Count, Direct URL |
| **Reddit** | Social Media | `about.json` REST API | Karma, profile age, comment history, status |
| **Telegram** | Messaging | `t.me` public preview probe | Channel/User existence, bio, handle |
| **GitHub** | Development | REST API & Commit search | Repos, SSH keys, bio, public commits, verified email |
| **GitLab** | Development | API v4 user enumeration | Public activity, profile URL, status |
| **HackerNews** | Technical Forum | Firebase API (`v0/user/{id}`) | Karma, account creation timestamp, submissions |
| **Dev.to** | Blogging | `api/users/by_username` | Published technical articles, author profile |
| **Gravatar** | Identity Profile | Reverse MD5 / SHA-256 hash | Universal avatar, display names, linked services |
| **Medium** | Publishing | Author page endpoint | Articles, publication memberships, status |
| **Spotify** | Media & Audio | User directory check | Public playlists, follower telemetry |
| **Pinterest** | Social Media | Board directory check | Public visual collections and pins |

- **Deep Credential Breach Monitoring**: Queries HaveIBeenPwned and DeHashed feeds; checks password hashes via k-anonymity SHA-1 buckets.
- **Data Broker Surface Detection**: Identifies exposed PII (names, phone numbers, home addresses, court records) across Spokeo, WhitePages, BeenVerified, FastPeopleSearch, and Radaris.
- **Dark Web & Leak Mirror Indexing**: Monitors Tor forums and Pastebin drops for credential dumps and infostealer logs.

### 🧠 Perception AI & Aspect Sentiment Analysis
- **Aspect-Based Sentiment Decomposition**: Classifies public mentions across Developer Reputation, Code Quality, Responsiveness, and Content Quality using Hugging Face RoBERTa.
- **Toxicity & Hostility Scoring**: Google Perspective API model scoring toxicity, severe toxicity, profanity, insults, and threats.
- **Entity Disambiguation**: Jaccard 3-gram distance algorithm prevents namesake/homonym false-positives before triggering remediation.

### ⚡ Autonomous Remediation & Legal DSAR Engine
- **Headless Browser Opt-Out Automation**: Playwright workers automatically navigate data broker portals, fill suppression forms, and bypass CAPTCHA via CapSolver.
- **Multi-Jurisdiction DSAR Generator**: Generates legally binding erasure demands under GDPR Article 17, CCPA §1798.105, and Virginia VCDPA §59.1-577.
- **Proof-of-Removal Verification Crawler**: Re-crawls broker public endpoints to verify 404 record absence and detect data regeneration.

### 🛡️ Zero-Knowledge Client Cryptography
- **Client-Side SHA-256 Hashing**: Identifiers are hashed with local salts before leaving the browser.
- **AES-256-GCM Enclave**: Sensitive reports and local credentials derived via PBKDF2 (100,000 iterations).
- **Ephemeral Processing**: Central servers enforce 0-day raw data retention. Plaintext buffers are purged from RAM immediately after feature extraction.

---

## 🎮 Hardware Acceleration & Device Optimization

IdentityLens includes dynamic host hardware detection and automated performance tuning:

| Component | Profile / Calibration | Optimization Details |
| :--- | :--- | :--- |
| **CPU Multi-Threading** | **Intel® Core™ i7-14700HX** (20 Cores, 28 Threads) | `httpx.Limits(max_connections=80, max_keepalive_connections=40)` saturates parallel sockets across 400+ platforms; `torch.set_num_threads(28)` for vector operations. |
| **Dedicated GPU** | **NVIDIA® GeForce RTX™ 5060 Laptop GPU** (8GB GDDR6, CUDA 12.5) | RoBERTa aspect perception classification uses half-precision **FP16** inference with `torch.backends.cudnn.benchmark = True`. |
| **System Memory** | **32 GB DDR5 RAM** | High-throughput in-memory correlation caches and ephemeral memory buffers. |
| **Vite Bundle Optimization** | Modern ES2022 Target | Chunk splitting into `vendor-react` (262 kB), `vendor-charts` (416 kB), `vendor-core` (3.5 kB), and `index` (246 kB). Build time: **~170ms**. |
| **Hardware Telemetry Endpoints** | `/api/v1/system/hardware` & `/api/v1/system/gpu` | Dynamic inspection of `/proc/cpuinfo`, `/proc/meminfo`, and `nvidia-smi`. |

---

## 🏛️ System Architecture Diagram

```
+---------------------------------------------------------------------------------------------------+
|                                      CLIENT BROWSER (Vite + React 19)                             |
|  - AES-256-GCM / SHA-256 WebCrypto                                                                |
|  - 10-Page Intelligence Suite (Dashboard, Scan, OSINT, Breaches, Perception AI, Shadow Accounts)  |
|  - Dual Mode OSINT: Username & Gmail Reconnaissance (Gravatar MD5, GitHub API, Breach Feeds)      |
+---------------------------------------------------------------------------------------------------+
                                         │ (Encrypted Hashes & Query Signatures)
                                         ▼
+---------------------------------------------------------------------------------------------------+
|                                IDENTITYLENS API GATEWAY (FastAPI)                                 |
|  - /api/v1/scan/start       - /api/v1/recon/social           - /api/v1/recon/email                |
|  - /api/v1/remediation/dsar - /api/v1/remediation/optout    - /api/v1/system/hardware            |
+---------------------------------------------------------------------------------------------------+
            │                                     │                                    │
            ▼                                     ▼                                    ▼
+-----------------------+             +-----------------------+            +-----------------------+
|  NLP & PERCEPTION AI  |             |  ASYNCHRONOUS ENGINE  |            |  REMEDIATION ENGINE   |
| - spaCy NER Pipeline  |             | - Celery Task Queue   |            | - Playwright Browser  |
| - RoBERTa Sentiment   |             | - Redis Broker/Store  |            | - CapSolver Bypasser  |
| - Perspective Toxicity|             | - 28 Multi-Worker Pool|            | - Multi-Jurisdict DSAR|
| - Entity Disambig     |             |                       |            | - Removal Verification|
+-----------------------+             +-----------------------+            +-----------------------+
                                                  │
                                                  ▼
                                      +-----------------------+
                                      | EXTERNAL OSINT FEEDS  |
                                      | - HaveIBeenPwned API  |
                                      | - XposedOrNot Feed    |
                                      | - Gravatar Hash DB    |
                                      | - GitHub User API     |
                                      | - 3,000+ Data Brokers |
                                      +-----------------------+
```

---

## 💻 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend UI** | React 19.2, Vite 8.3, React Router v7, Recharts, Lucide React |
| **Design System** | Custom Vanilla CSS, Dark Glassmorphism, 50+ Design Tokens, Responsive Grids |
| **Client Crypto** | Web Crypto API (SubtleCrypto: SHA-256, PBKDF2, AES-256-GCM, Pure JS MD5) |
| **Backend API** | Python 3.10–3.11, FastAPI, Uvicorn, Pydantic v2, HTTPX |
| **NLP & AI** | spaCy NER, Hugging Face Transformers (RoBERTa), Google Perspective API |
| **Remediation** | Playwright (Chromium Headless), CapSolver API, Jinja2 Legal Templates |
| **Async Tasks** | Celery 5.3, Redis 7 |
| **Hardware & Acceleration** | NVIDIA CUDA 12.5, PyTorch FP16, Intel Raptor Lake Multi-Threading |
| **DevOps & Infra** | Docker, Docker Compose, GitHub Actions CI/CD, Prometheus Metrics, Oxlint |

---

## 📁 Project Structure

```
Identity-Lens-main/
├── .github/
│   └── workflows/
│       └── ci.yml                     # GitHub Actions CI/CD pipeline
├── backend/
│   ├── crypto/
│   │   ├── __init__.py
│   │   └── zero_knowledge.py         # Salted SHA-256 HMAC and enclave validation
│   ├── nlp/
│   │   ├── __init__.py
│   │   ├── ner_pipeline.py           # spaCy NER and PII extraction
│   │   ├── entity_disambiguation.py  # Jaccard 3-gram namesake disambiguation
│   │   ├── sentiment_engine.py       # RoBERTa aspect-based sentiment (CUDA / 28 threads)
│   │   ├── toxicity_scorer.py        # Perspective API toxicity model
│   │   ├── risk_calculator.py        # Composite mathematical exposure score
│   │   └── report_generator.py       # Executive AI markdown report generator
│   ├── recon/
│   │   ├── __init__.py
│   │   └── social_crawler.py         # High-concurrency 80-conn HTTPX crawler & email intel
│   ├── remediation/
│   │   ├── __init__.py
│   │   ├── broker_optout.py          # Playwright headless browser automator
│   │   ├── captcha_solver.py         # CapSolver & 2Captcha API integration
│   │   ├── dsar_generator.py         # GDPR Art. 17, CCPA, VCDPA legal templates
│   │   └── verification_agent.py     # Proof-of-removal verification crawler
│   ├── tasks/
│   │   ├── __init__.py
│   │   ├── celery_app.py             # Celery worker application
│   │   └── osint_tasks.py            # Asynchronous OSINT recon tasks
│   ├── config.py                     # Dynamic hardware telemetry & environment settings
│   ├── Dockerfile                    # Backend Python/Playwright container
│   ├── main.py                       # Central FastAPI application server
│   └── requirements.txt              # Backend dependencies
├── monitoring/
│   └── prometheus.yml                # Prometheus metrics scraper config
├── src/
│   ├── assets/                       # Brand icons and vector assets
│   ├── components/
│   │   ├── Header.jsx                # Global header with real-time GPU badge & search
│   │   ├── ScoreRing.jsx             # Animated SVG digital exposure score ring
│   │   └── Sidebar.jsx               # Navigation bar with badges and active states
│   ├── context/
│   │   ├── AuthContext.jsx           # Zero-knowledge authentication & Google OAuth
│   │   └── IdentityScanContext.jsx   # Global identity persona & scan state
│   ├── data/
│   │   └── mockData.js               # Comprehensive dataset across 10 categories
│   ├── pages/
│   │   ├── DashboardPage.jsx         # Executive overview & real-time telemetry
│   │   ├── ScanPage.jsx              # Interactive scanner & live console
│   │   ├── OsintPage.jsx             # 47-point discovered findings & metadata drawer
│   │   ├── BreachPage.jsx            # Breach monitor & k-anonymity hash checker
│   │   ├── SentimentPage.jsx         # Perception AI, aspect radar, Perspective toxicity
│   │   ├── AccountsPage.jsx          # Shadow accounts & dual Username/Gmail finder
│   │   ├── DeletionsPage.jsx         # Remediation pipeline & statutory DSAR modal
│   │   ├── ReportsPage.jsx           # Forensic dossier studio & printable report
│   │   ├── ActivityPage.jsx          # Cryptographic audit trail & worker logs
│   │   └── SettingsPage.jsx          # Master key vault, live hardware telemetry, API keys
│   ├── services/
│   │   ├── liveEmailService.js       # Client MD5 Gravatar, GitHub email search, XposedOrNot
│   │   ├── liveScanService.js        # Live scan coordinator
│   │   └── liveSocialService.js      # Social footprint discovery client
│   ├── utils/
│   │   └── crypto.js                 # Web Crypto API client-side AES/SHA utilities
│   ├── App.css                       # Application-specific style overrides
│   ├── App.jsx                       # Master router connecting all 10 pages
│   ├── index.css                     # Design system (50+ tokens, glassmorphism)
│   └── main.jsx                      # React 19 root bootstrap
├── docker-compose.yml                # Full microservices stack orchestration
├── Dockerfile                        # Frontend production Nginx container
├── package.json                      # Frontend dependencies & scripts
├── vite.config.js                    # Vite configuration with chunk splitting & ES2022
└── README.md                         # Project documentation
```

---

## 🚀 Quickstart & Installation

### Prerequisites

| Tool | Minimum Version | Recommended Version |
| :--- | :--- | :--- |
| **Node.js** | `v18.0.0+` | `v20.x` or `v22.x` |
| **npm** | `v9.0.0+` | `v10.x+` |
| **Python** | `3.10` | `3.11` (optimal for PyTorch & spaCy binary wheels) |
| **Docker & Docker Compose** *(Optional)* | `v24.0+` | Latest Docker Desktop |

---

### Method 1: Docker Compose (All-in-One CLI)

The fastest CLI way to launch all microservices (Frontend, Backend API, Celery Worker, Redis broker, and Prometheus telemetry) in isolated containers:

```bash
# 1. Build and start all containers in detached mode
docker compose up --build -d

# 2. View live service logs
docker compose logs -f

# 3. Stop all services
docker compose down
```

**Service Endpoints:**
- **Frontend Dashboard:** [http://localhost:3000](http://localhost:3000)
- **FastAPI Core Engine:** [http://localhost:8000](http://localhost:8000)
- **Interactive API Docs (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Prometheus Metrics:** [http://localhost:9090](http://localhost:9090)

---

### Method 2: One-Click Desktop Shortcut (Windows)

A Windows Desktop Shortcut and batch launcher have been configured in the repository:

1. **Launch with One Click**:
   - Double-click **`IdentityLens.lnk`** directly on your Windows Desktop (or run `launch-identitylens.bat`).
   - Automatically checks if Docker Desktop is active. If running, starts all containers via `docker compose up -d`. If Docker is not running, falls back automatically to native FastAPI and Vite servers.
   - Automatically launches your default web browser to [http://localhost:3000](http://localhost:3000) or [http://localhost:5173](http://localhost:5173).
2. **Stop with One Click**:
   - Double-click `stop-identitylens.bat` to gracefully terminate all containers and free ports `3000`, `5173`, and `8000`.

---

### Method 3: Local Manual Setup (Frontend + Backend)

If you prefer running services directly on your host machine for development:

#### 1. Frontend Dashboard (React 19 + Vite)

From the project root:

```bash
# Install Node dependencies
npm install

# Start the Vite development server (with chunk splitting & ES2022 optimization)
npm run dev
```

The frontend will be live at 👉 **[http://localhost:5173](http://localhost:5173)**.

Other frontend commands:
```bash
# Build production bundle to /dist (clocked at ~170ms)
npm run build

# Preview production build locally
npm run preview

# Run multi-threaded linter using all host CPU cores (oxlint)
npm run lint
```

---

#### 2. Backend Engine (FastAPI)

Navigate to the `backend/` folder:

```bash
cd backend
```

**Step A: Create and Activate Virtual Environment**
- On Linux / macOS:
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```
- On Windows (PowerShell):
  ```powershell
  python -m venv venv
  .\venv\Scripts\Activate.ps1
  ```
  *(If execution is blocked, run: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`)*

**Step B: Install Dependencies**
```bash
pip install -r requirements.txt
```

**Step C: Install Playwright Browsers (For automated remediation)**
```bash
playwright install chromium
```

**Step D: Download Optional NLP Models**
The engine automatically falls back to fast heuristic and regex modes if heavy models are not downloaded. To install the local spaCy model:
```bash
python -m spacy download en_core_web_sm
```

**Step E: Start the FastAPI Server**
```bash
python3 -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

The backend is live at:
- **API Base:** [http://localhost:8000](http://localhost:8000)
- **Interactive Documentation (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Documentation:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

#### 3. Background Tasks & Worker (Redis + Celery) *(Optional)*

If you require scheduled OSINT scan jobs and background worker dispatch:

**Step A: Start Redis**
```bash
docker run -d --name identitylens-redis -p 6379:6379 redis:7-alpine
```

**Step B: Launch Celery Worker**
With your virtual environment activated, run from the `backend/` directory:
- On Linux / macOS:
  ```bash
  celery -A tasks.celery_app worker --loglevel=info --concurrency=4
  ```
- On Windows:
  ```powershell
  celery -A tasks.celery_app worker --loglevel=info -P solo
  ```
  *(Note: Celery requires `-P solo` on Windows due to absence of POSIX `fork`).*

---

## ⚙️ Environment Configuration (`.env`)

You can customize backend parameters by creating a `.env` file in the `backend/` directory:

```ini
# Server Settings
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development

# Redis & Celery Task Queue
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/1

# Zero-Knowledge Cryptography
DEFAULT_PBKDF2_ROUNDS=100000
ENFORCE_EPHEMERAL_STORAGE=True

# Authentication & Superadmin Credentials
ADMIN_ROOT_USERNAME=admin@identitylens.local
ADMIN_ROOT_PASSWORD=admin123
ADMIN_EMAILS=admin@identitylens.local
ADMIN_JWT_SECRET=identitylens-secure-jwt-hmac-secret-change-me

# Dedicated GPU & Hardware Tuning (NVIDIA RTX 5060 / CUDA 12.5)
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

### 👑 Superadmin & Authentication Model
- **Default Master Admin Credentials**:
  - **Email / Username**: `admin@identitylens.local` (or `admin`)
  - **Default Password**: `admin123`
- **Platform Admin Privileges**: Full supervisory permissions, unlimited scan quotas (`999,999`), and access to the Superadmin Google User Directory.
- **Google OAuth Login**: Any Google account can sign in via client-side OAuth. Accounts matching `ADMIN_EMAILS` receive `SUPERADMIN` status; all other Google logins receive isolated, zero-knowledge `STANDARD_USER` vaults.

---

## 🔐 Zero-Knowledge Cryptographic Protocol

IdentityLens is built from the ground up on the **Zero-Knowledge Principle**:

1. **Client-Side PBKDF2**: Upon authentication, the client browser computes a local master key using PBKDF2 with 100,000 SHA-256 iterations and a random salt:
   $$\text{MasterKey} = \text{PBKDF2}(\text{Passphrase}, \text{Salt}, 100000, \text{SHA-256})$$
2. **Deterministic Query Hashes**: Persona identifiers are hashed client-side with SHA-256:
   $$\text{QueryHash} = \text{HMAC-SHA-256}(\text{Salt}, \text{Identifier})$$
3. **k-Anonymity Credential Verification**: For breach checks, only the first 5 hexadecimal characters of a SHA-1 hash are queried against HaveIBeenPwned range endpoints.
4. **Ephemeral In-Memory Enclave**: All raw scraping buffers in Python microservices are purged from RAM immediately after feature extraction. Central databases never store plaintext PII.

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check, service status, and zero-knowledge telemetry |
| `GET` | `/api/v1/system/hardware` | Dynamic hardware specs (CPU threads, GPU model, VRAM, RAM) |
| `GET` | `/api/v1/system/gpu` | Dedicated GPU diagnostics and CUDA acceleration mode |
| `GET` | `/api/v1/recon/social` | Scan 400+ platforms for username or email handle |
| `GET` | `/api/v1/recon/email` | Comprehensive email OSINT (Gravatar, GitHub, live breaches) |
| `POST` | `/api/v1/scan/start` | Launch asynchronous OSINT reconnaissance pipeline |
| `POST` | `/api/v1/sentiment/analyze` | RoBERTa aspect-based sentiment & Perspective toxicity scoring |
| `POST` | `/api/v1/remediation/dsar` | Generate certified GDPR Art. 17 / CCPA statutory notice |
| `POST` | `/api/v1/remediation/optout` | Dispatch Playwright browser worker to submit broker opt-out |
| `GET` | `/api/v1/remediation/verify` | Crawl broker endpoint to verify record absence (Proof-of-Removal) |
| `POST` | `/api/v1/reports/generate` | Generate LLM-powered forensic executive audit dossier |

---

## 🧪 Verifying the Installation

### 1. Test Backend Health Check
```bash
curl http://localhost:8000/health
```
*Expected response:*
```json
{
  "status": "healthy",
  "service": "IdentityLens Engine",
  "version": "1.0.4-RELEASE",
  "zero_knowledge_enforced": true
}
```

### 2. Test Dynamic Hardware Telemetry
```bash
curl http://localhost:8000/api/v1/system/hardware
```

### 3. Test Social Media & Instagram Reconnaissance Endpoint
```bash
curl "http://localhost:8000/api/v1/recon/social?username=openai"
```
*Expected response returns discovered platforms including Instagram with direct URL and parsed follower metrics:*
```json
{
  "platform": "Instagram",
  "category": "Social Media",
  "username": "openai",
  "url": "https://www.instagram.com/openai/",
  "found": true,
  "status": "monitored",
  "bio": "7M Followers, 8 Following, 1,895 Posts - See Instagram photos and videos from OpenAI (@openai)"
}
```

### 4. Test Email OSINT Reconnaissance Endpoint
```bash
curl "http://localhost:8000/api/v1/recon/email?email=test@gmail.com"
```

### 5. Test Sentiment Analysis Endpoint
```bash
curl -X POST "http://localhost:8000/api/v1/sentiment/analyze" \
     -H "Content-Type: application/json" \
     -d "{\"text\": \"Their code architecture is clean, efficient, and well structured.\"}"
```

### 6. Test Legal DSAR Notice Generator
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
| **PyTorch / transformers install error** | Python 3.14 compatibility with PyTorch binary wheels | Use Python 3.10 or 3.11 for the backend venv, or use Docker which isolates Python 3.11 automatically |
| **Playwright Chromium missing** | Browser binaries not downloaded | Run `playwright install chromium` inside your active virtual environment |
| **GPU not detected in Docker** | NVIDIA Container Toolkit not configured | Ensure `nvidia-container-toolkit` is installed on host and Docker daemon is restarted |

---

## 🗺️ Roadmap & Completion Ledger

### Phase 1 — Core Scanner & Dashboard ✅ *COMPLETED*
- [x] Project scaffolding (Vite + React 19)
- [x] Design system (50+ CSS custom properties, dark mode, glassmorphism)
- [x] Sidebar navigation with active states and notification badges
- [x] Header with search, live GPU status badge, and threat counter
- [x] Animated Score Ring component with dynamic gradient calculations
- [x] Dashboard page (overview metrics, Recharts area/bar graphs, recent discoveries)
- [x] Mock OSINT data layer across 10 categories
- [x] Scan initiation page (`ScanPage.jsx`) with live terminal telemetry
- [x] OSINT results page (`OsintPage.jsx`) with filtering, batch actions, and metadata inspector
- [x] Breach monitor page (`BreachPage.jsx`) with k-anonymity SHA-1 lookup simulator
- [x] Sentiment analysis page (`SentimentPage.jsx`) with aspect radar and Perspective toxicity metrics
- [x] Shadow accounts page (`AccountsPage.jsx`) with dual Username & Gmail/Email finding modes
- [x] Deletion queue page (`DeletionsPage.jsx`) with Playwright step indicators and SLA tracking
- [x] Reports page (`ReportsPage.jsx`) with instant report compiler and printable dossier
- [x] Activity log page (`ActivityPage.jsx`) with cryptographic block hash verification
- [x] Settings page (`SettingsPage.jsx`) with master key export, live hardware telemetry, and enclave controls

### Phase 2 — NLP & Perception AI ✅ *COMPLETED*
- [x] spaCy NER pipeline integration (`backend/nlp/ner_pipeline.py`)
- [x] Jaccard 3-gram entity disambiguation engine (`backend/nlp/entity_disambiguation.py`)
- [x] RoBERTa aspect-based sentiment classifier (`backend/nlp/sentiment_engine.py`)
- [x] Perspective API toxicity & hostility scoring (`backend/nlp/toxicity_scorer.py`)
- [x] Mathematical multi-factor risk score calculator (`backend/nlp/risk_calculator.py`)
- [x] LLM-powered executive report narrative generator (`backend/nlp/report_generator.py`)

### Phase 3 — Automated Remediation ✅ *COMPLETED*
- [x] Playwright data broker opt-out automation scripts (`backend/remediation/broker_optout.py`)
- [x] CapSolver & 2Captcha automated solver integration (`backend/remediation/captcha_solver.py`)
- [x] Multi-jurisdictional DSAR template engine (`backend/remediation/dsar_generator.py`)
- [x] Proof-of-removal verification agent (`backend/remediation/verification_agent.py`)

### Phase 4 — Production Hardening & Hardware Tuning ✅ *COMPLETED*
- [x] Zero-Knowledge client WebCrypto encryption (`src/utils/crypto.js` & `backend/crypto/zero_knowledge.py`)
- [x] Gmail / Email OSINT reconnaissance engine (`src/services/liveEmailService.js` & `backend/recon/social_crawler.py`)
- [x] Host hardware telemetry endpoints (`/api/v1/system/hardware` and `/api/v1/system/gpu`)
- [x] Multi-core 28-thread connection pool & PyTorch thread scaling
- [x] Vite ES2022 bundle chunk splitting (sub-200ms production builds)
- [x] Celery & Redis distributed task queues (`backend/tasks/`)
- [x] Multi-stage Dockerfile for frontend (Nginx) & backend (Playwright/Python)
- [x] Complete Docker Compose microservices orchestration (`docker-compose.yml`)
- [x] Prometheus metrics scraping configuration (`monitoring/prometheus.yml`)
- [x] GitHub Actions automated CI/CD pipeline (`.github/workflows/ci.yml`)

---

## 📝 Changelog

### v1.0.4-RELEASE — Current
**Hardware Tuning, Instagram & Gmail Reconnaissance & Production Microservices**
- ✅ **Instagram & Social Media OSINT Intelligence**:
  - Direct OpenGraph crawler inspection bypassing single-page app shell redirects.
  - Follower count, following count, post count, and bio telemetry parsing.
  - Automatic 404 nonexistent account discrimination.
  - Instant direct profile link generation with risk classification.
- ✅ **Gmail & Email OSINT Intelligence**:
  - Pure JS MD5 & SHA-256 hashing for Gravatar profile detection.
  - GitHub public user email search (`/search/users?q={email}+in:email`).
  - XposedOrNot live credential breach correlation.
  - Dot-insensitive canonical Gmail handle expansion.
  - Dual-mode input in `AccountsPage.jsx` and `@` email auto-detection in global search.
- ✅ **Hardware Acceleration**:
  - Tuned for Intel Core i7-14700HX (28 threads) and NVIDIA GeForce RTX 5060 (8GB VRAM).
  - High-concurrency 80-connection pool in `social_crawler.py`.
  - Dynamic hardware telemetry endpoints `/api/v1/system/hardware` and `/api/v1/system/gpu`.
  - Vite ES2022 manual chunk splitting (`vendor-react`, `vendor-charts`, `vendor-core`).
- ✅ **Full 10-Page Application Suite**: Complete zero-knowledge UI with live scanner, breach monitors, perception radar, statutory DSAR generator, and audit trails.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with 🔍 by the IdentityLens Team**

*Protecting digital identities, one scan at a time.*

</div>
