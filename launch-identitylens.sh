#!/usr/bin/env bash
# IdentityLens Universal Launcher (macOS / Linux)
echo "======================================================================"
echo "          IDENTITYLENS -- DIGITAL IDENTITY INTELLIGENCE"
echo "======================================================================"
echo ""

# Check Docker
if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
    echo "[*] Docker is running. Starting microservices stack..."
    docker compose up -d
    echo "[*] IdentityLens started via Docker on http://localhost:3000"
    exit 0
fi

echo "[*] Falling back to native local mode..."

# Find Python
PY_CMD="python3"
if [ -f "./backend/venv/bin/python" ]; then
    PY_CMD="./backend/venv/bin/python"
fi

# Launch Backend
echo "[*] Launching FastAPI Backend (Port 8000)..."
cd backend
$PY_CMD -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# Launch Frontend
echo "[*] Launching Vite Frontend (Port 5173)..."
npm run dev &
FRONTEND_PID=$!

echo "[*] IdentityLens running!"
echo "    Frontend: http://localhost:5173"
echo "    Backend:  http://localhost:8000"
echo "    Docs:     http://localhost:8000/docs"

# Clean shutdown on Ctrl+C or terminal close
trap "echo ''; echo '[*] Shutting down services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM EXIT

wait
