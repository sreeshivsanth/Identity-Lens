<div align="center">

# 🔍 IdentityLens

### Digital Identity Intelligence Platform

**OSINT-Powered Scanner • Perception AI • Automated Data Removal • Zero-Knowledge Enclave**

[![Version](https://img.shields.io/badge/version-v1.0.4--RELEASE-blue?style=flat-square)](#changelog)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](#license)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)](#tech-stack)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat-square&logo=vite)](#tech-stack)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi)](#tech-stack)
[![Architecture](https://img.shields.io/badge/arch-Microservices%20%2F%20Zero--Knowledge-purple?style=flat-square)](#architecture)

---

*IdentityLens is an enterprise-grade, privacy-first platform that uncovers digital exposure footprints across 3,000+ websites, monitors credential breach repositories, performs RoBERTa aspect-based perception sentiment analysis, and executes autonomous Playwright and DSAR deletion protocols under GDPR, CCPA, and VCDPA — without permanently storing raw personal data on central servers.*

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [System Architecture Diagram](#-system-architecture-diagram)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started & Installation](#-getting-started--installation)
  - [Frontend Development](#frontend-development)
  - [Backend FastAPI Server](#backend-fastapi-server)
  - [Distributed Celery Worker](#distributed-celery-worker)
  - [Full Microservices via Docker Compose](#full-microservices-via-docker-compose)
- [Zero-Knowledge Cryptographic Protocol](#-zero-knowledge-cryptographic-protocol)
- [Core Modules & Pipeline](#-core-modules--pipeline)
  - [Phase 1: 10-Page Frontend Dashboard Suite](#phase-1-10-page-frontend-dashboard-suite)
  - [Phase 2: NLP & Perception AI Pipeline](#phase-2-nlp--perception-ai-pipeline)
  - [Phase 3: Automated Remediation Engine](#phase-3-automated-remediation-engine)
  - [Phase 4: Production Hardening & Infrastructure](#phase-4-production-hardening--infrastructure)
- [API Reference](#-api-reference)
- [Roadmap & Completion Ledger](#-roadmap--completion-ledger)
- [Changelog](#-changelog)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🔍 OSINT Discovery & Forensic Reconnaissance
- **Username Footprint Enumeration** — Scans 400+ online platforms using Sherlock, Maigret, and WhatsMyName patterns.
- **Deep Breach Monitoring** — Queries HaveIBeenPwned and DeHashed feeds; checks password hashes via k-anonymity SHA-1 buckets.
- **Data Broker Surface Detection** — Identifies exposed PII (names, phone numbers, home addresses, court records) across Spokeo, WhitePages, BeenVerified, FastPeopleSearch, and Radaris.
- **Dark Web & Leak Mirror Indexing** — Monitors Tor forums and Pastebin drops for credential dumps and infostealer logs.

### 🧠 Perception AI & Aspect Sentiment Analysis
- **Aspect-Based Sentiment Decomposition** — Classifies public mentions across Developer Reputation, Code Quality, Responsiveness, and Content Quality.
- **Toxicity & Hostility Scoring** — Google Perspective API model scoring toxicity, severe toxicity, profanity, insults, and threats.
- **Entity Disambiguation** — Jaccard 3-gram distance algorithm prevents namesake/homonym false-positives before triggering remediation.

### ⚡ Autonomous Remediation & Legal DSAR Engine
- **Headless Browser Opt-Out Automation** — Playwright workers automatically navigate data broker portals, fill suppression forms, and bypass CAPTCHA via CapSolver.
- **Multi-Jurisdiction DSAR Generator** — Generates legally binding erasure demands under GDPR Article 17, CCPA §1798.105, and Virginia VCDPA §59.1-577.
- **Proof-of-Removal Verification Crawler** — Re-crawls broker public endpoints to verify 404 record absence and detect data regeneration.

### 🛡️ Zero-Knowledge Client Cryptography
- **Client-Side SHA-256 Hashing** — Identifiers are hashed with local salts before leaving the browser.
- **AES-256-GCM Enclave** — Sensitive reports and local credentials derived via PBKDF2 (100,000 iterations).
- **Ephemeral Processing** — Central servers enforce 0-day raw data retention.

---

## 🏛️ System Architecture Diagram

```
+---------------------------------------------------------------------------------------------------+
|                                      CLIENT BROWSER (Vite + React)                                |
|  - AES-256-GCM / SHA-256 WebCrypto                                                                |
|  - 10-Page Intelligence Dashboard (Dashboard, Scan, OSINT, Breaches, Sentiment, Remediation...)   |
+---------------------------------------------------------------------------------------------------+
                                         │ (Encrypted Hashes & Task IDs)
                                         ▼
+---------------------------------------------------------------------------------------------------+
|                                IDENTITYLENS API GATEWAY (FastAPI)                                 |
|  - /api/v1/scan/start       - /api/v1/remediation/optout    - /api/v1/sentiment/analyze          |
|  - /api/v1/remediation/dsar - /api/v1/remediation/verify    - /api/v1/reports/generate           |
+---------------------------------------------------------------------------------------------------+
            │                                     │                                    │
            ▼                                     ▼                                    ▼
+-----------------------+             +-----------------------+            +-----------------------+
|  NLP & PERCEPTION AI  |             |  ASYNCHRONOUS ENGINE  |            |  REMEDIATION ENGINE   |
| - spaCy NER Pipeline  |             | - Celery Task Queue   |            | - Playwright Browser  |
| - RoBERTa Sentiment   |             | - Redis Broker/Store  |            | - CapSolver Bypasser  |
| - Perspective Toxicity|             | - Multi-Worker Nodes  |            | - Multi-Jurisdict DSAR|
| - Entity Disambig     |             |                       |            | - Removal Verification|
+-----------------------+             +-----------------------+            +-----------------------+
                                                  │
                                                  ▼
                                      +-----------------------+
                                      | EXTERNAL OSINT FEEDS  |
                                      | - HaveIBeenPwned API  |
                                      | - DeHashed API        |
                                      | - 3,000+ Data Brokers |
                                      | - Tor Mirror Scrapers |
                                      +-----------------------+
```

---

## 💻 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend UI** | React 19, Vite 8, React Router v7, Recharts, Lucide React |
| **Design System** | Custom Vanilla CSS, Dark Glassmorphism, 50+ Design Tokens, Responsive Grids |
| **Client Crypto** | Web Crypto API (SubtleCrypto: SHA-256, PBKDF2, AES-256-GCM) |
| **Backend API** | Python 3.11, FastAPI, Uvicorn, Pydantic v2 |
| **NLP & AI** | spaCy NER, Hugging Face Transformers (RoBERTa), Google Perspective API |
| **Remediation** | Playwright (Chromium Headless), CapSolver API, Jinja2 Legal Templates |
| **Async Tasks** | Celery 5.3, Redis 7 |
| **DevOps & Infra** | Docker, Docker Compose, GitHub Actions CI/CD, Prometheus Metrics |

---

## 📁 Project Structure

```
identitylens/
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
│   │   ├── sentiment_engine.py       # RoBERTa aspect-based sentiment
│   │   ├── toxicity_scorer.py        # Perspective API toxicity model
│   │   ├── risk_calculator.py        # Composite mathematical exposure score
│   │   └── report_generator.py       # Executive AI markdown report generator
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
│   ├── config.py                     # Environment variables & system settings
│   ├── Dockerfile                    # Backend Python/Playwright container
│   ├── main.py                       # Central FastAPI application server
│   └── requirements.txt              # Backend dependencies
├── monitoring/
│   └── prometheus.yml                # Prometheus metrics scraper config
├── src/
│   ├── assets/                       # Brand icons and vector assets
│   ├── components/
│   │   ├── Header.jsx                # Global header with search and notifications
│   │   ├── ScoreRing.jsx             # Animated SVG digital exposure score ring
│   │   └── Sidebar.jsx               # Navigation bar with badges and active states
│   ├── data/
│   │   └── mockData.js               # Comprehensive dataset across 10 categories
│   ├── pages/
│   │   ├── DashboardPage.jsx         # Executive overview & real-time telemetry
│   │   ├── ScanPage.jsx              # Interactive scanner & live console
│   │   ├── OsintPage.jsx             # 47-point discovered findings & metadata drawer
│   │   ├── BreachPage.jsx            # Breach monitor & k-anonymity hash checker
│   │   ├── SentimentPage.jsx         # Perception AI, aspect radar, Perspective toxicity
│   │   ├── AccountsPage.jsx          # Shadow accounts & dormant profile analyzer
│   │   ├── DeletionsPage.jsx         # Remediation pipeline & statutory DSAR modal
│   │   ├── ReportsPage.jsx           # Forensic dossier studio & printable report
│   │   ├── ActivityPage.jsx          # Cryptographic audit trail & worker logs
│   │   └── SettingsPage.jsx          # Master key vault, automations, and API keys
│   ├── utils/
│   │   └── crypto.js                 # Web Crypto API client-side AES/SHA utilities
│   ├── App.css                       # Application-specific style overrides
│   ├── App.jsx                       # Master router connecting all 10 pages
│   ├── index.css                     # Design system (50+ tokens, glassmorphism)
│   └── main.jsx                      # React 19 root bootstrap
├── docker-compose.yml                # Full microservices stack orchestration
├── Dockerfile                        # Frontend production Nginx container
├── package.json                      # Frontend dependencies & scripts
├── README.md                         # Project documentation
├── md1.txt                           # Version 1 documentation snapshot
└── md2.txt                           # Version 2 documentation snapshot
```

---

## 🚀 Getting Started & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Python**: 3.10 or 3.11 (for backend engine)
- **Docker & Docker Compose** (optional, for containerized deployment)

---

### Frontend Development

1. Install npm dependencies:
```bash
npm install
```

2. Start the local Vite development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

3. Verify production build:
```bash
npm run build
```

---

### Backend FastAPI Server

1. Navigate to the `backend/` directory:
```bash
cd backend
```

2. Create and activate a Python virtual environment:
```bash
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate
```

3. Install required packages:
```bash
pip install -r requirements.txt
playwright install chromium
```

4. Start the FastAPI development server:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation (Swagger UI) is available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

### Distributed Celery Worker

1. Ensure Redis is running on `localhost:6379`.
2. Start the Celery worker process:
```bash
celery -A tasks.celery_app worker --loglevel=info --concurrency=4
```

---

### Full Microservices via Docker Compose

To launch the entire production stack (Frontend, Backend API, Celery Worker, Redis, and Prometheus) in a single command:

```bash
docker compose up --build -d
```

Service endpoints:
- **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Prometheus Metrics**: [http://localhost:9090](http://localhost:9090)

---

## 🔐 Zero-Knowledge Cryptographic Protocol

IdentityLens adheres strictly to the **Zero-Knowledge Principle**:

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
| `POST` | `/api/v1/scan/start` | Launch asynchronous OSINT reconnaissance pipeline |
| `POST` | `/api/v1/sentiment/analyze` | RoBERTa aspect-based sentiment & Perspective toxicity scoring |
| `POST` | `/api/v1/remediation/dsar` | Generate certified GDPR Art. 17 / CCPA statutory notice |
| `POST` | `/api/v1/remediation/optout` | Dispatch Playwright browser worker to submit broker opt-out |
| `GET` | `/api/v1/remediation/verify` | Crawl broker endpoint to verify record absence (Proof-of-Removal) |
| `POST` | `/api/v1/reports/generate` | Generate LLM-powered forensic executive audit dossier |

---

## 🗺️ Roadmap & Completion Ledger

### Phase 1 — Core Scanner & Dashboard ✅ *COMPLETED*
- [x] Project scaffolding (Vite + React 19)
- [x] Design system (50+ CSS custom properties, dark mode, glassmorphism)
- [x] Sidebar navigation with active states and notification badges
- [x] Header with search & notification dot indicator
- [x] Animated Score Ring component with dynamic gradient calculations
- [x] Dashboard page (overview metrics, Recharts area/bar graphs, recent discoveries)
- [x] Mock OSINT data layer across 10 categories
- [x] Scan initiation page (`ScanPage.jsx`) with live terminal telemetry
- [x] OSINT results page (`OsintPage.jsx`) with filtering, batch actions, and metadata inspector
- [x] Breach monitor page (`BreachPage.jsx`) with k-anonymity SHA-1 lookup simulator
- [x] Sentiment analysis page (`SentimentPage.jsx`) with aspect radar and Perspective toxicity metrics
- [x] Shadow accounts page (`AccountsPage.jsx`) with dormant profile takeover alerts
- [x] Deletion queue page (`DeletionsPage.jsx`) with Playwright step indicators and SLA tracking
- [x] Reports page (`ReportsPage.jsx`) with instant report compiler and printable dossier
- [x] Activity log page (`ActivityPage.jsx`) with cryptographic block hash verification
- [x] Settings page (`SettingsPage.jsx`) with master key export and enclave controls

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

### Phase 4 — Production Hardening & Infrastructure ✅ *COMPLETED*
- [x] Zero-Knowledge client WebCrypto encryption (`src/utils/crypto.js` & `backend/crypto/zero_knowledge.py`)
- [x] FastAPI production API gateway (`backend/main.py`)
- [x] Celery & Redis distributed task queues (`backend/tasks/`)
- [x] Multi-stage Dockerfile for frontend (Nginx) & backend (Playwright/Python)
- [x] Complete Docker Compose microservices orchestration (`docker-compose.yml`)
- [x] Prometheus metrics scraping configuration (`monitoring/prometheus.yml`)
- [x] GitHub Actions automated CI/CD pipeline (`.github/workflows/ci.yml`)

---

## 📝 Changelog

### v1.0.4-RELEASE — 2026-10-13 (Current)
**Full Multi-Phase Engine & Production Microservices Release**

#### Added
- ✅ Built out all 9 remaining Phase 1 pages:
  - `ScanPage.jsx`: Live terminal scanner simulation with streaming logs and module toggles.
  - `OsintPage.jsx`: 47-point exposure browser with batch opt-out actions and forensic inspection drawer.
  - `BreachPage.jsx`: Historical breach ledger and interactive k-anonymity SHA-1 hash checker.
  - `SentimentPage.jsx`: Radar charts for domain aspects and Google Perspective toxicity metrics.
  - `AccountsPage.jsx`: Footprint explorer across 400+ platforms with dormant takeover warnings.
  - `DeletionsPage.jsx`: Autonomous Playwright pipeline tracker and statutory DSAR generator modal.
  - `ReportsPage.jsx`: On-demand report compilation studio and printable forensic dossier.
  - `ActivityPage.jsx`: Real-time cryptographic audit trail with worker telemetry.
  - `SettingsPage.jsx`: Zero-knowledge master key export, autonomous scan schedules, and API vault.
- ✅ Connected master routing in `App.jsx` for all 10 pages.
- ✅ Implemented Phase 2 NLP backend: spaCy NER pipeline, entity disambiguation, RoBERTa sentiment classifier, Perspective API toxicity scorer, and risk calculator.
- ✅ Implemented Phase 3 Remediation engine: Playwright broker automators, CapSolver bypasser, multi-jurisdiction DSAR generator, and verification crawler.
- ✅ Implemented Phase 4 Production hardening: WebCrypto client utilities, Celery distributed tasks, FastAPI backend, Docker Compose microservices, and Prometheus monitoring.

---

### v1.0.0-alpha — 2026-10-13
**Initial Release — Dashboard Foundation**
- Scaffolding, CSS design system, Sidebar, Header, Animated Score Ring, and Dashboard page.

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
