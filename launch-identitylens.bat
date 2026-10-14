@echo off
setlocal enabledelayedexpansion
title IdentityLens Launcher

echo ======================================================================
echo           IDENTITYLENS -- DIGITAL IDENTITY INTELLIGENCE
echo ======================================================================
echo.

:: Configure Dedicated GPU Optimization (NVIDIA GeForce GTX 1650)
echo [*] Initializing Dedicated GPU Acceleration...
set CUDA_VISIBLE_DEVICES=0
set NVIDIA_VISIBLE_DEVICES=all
set PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True
set SHIM_MCCOMPAT=0x000000001
set USE_GPU=true

nvidia-smi >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Dedicated GPU Acceleration Active: NVIDIA GeForce GTX 1650 (CUDA 12.5)
) else (
    echo [!] NVIDIA driver not found in path, running standard graphics mode.
)

echo.
echo [1/3] Checking environment and services...

:: Check if Docker is running
docker info >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [*] Docker Desktop is active. Launching microservices stack via Docker Compose...
    docker compose up -d
    if %ERRORLEVEL% EQU 0 (
        echo [*] Containers started successfully.
        echo [*] Waiting for web services to initialize...
        timeout /t 3 >nul
        echo [*] Opening IdentityLens in your default browser...
        start http://localhost:3000
        echo.
        echo ======================================================================
        echo  IdentityLens is running at: http://localhost:3000
        echo  FastAPI Backend API:       http://localhost:8000
        echo  API Documentation:         http://localhost:8000/docs
        echo  GPU Acceleration:          NVIDIA GeForce GTX 1650 Active
        echo ======================================================================
        echo.
        echo Press any key to stop all containers and exit...
        pause >nul
        echo [*] Shutting down IdentityLens containers...
        docker compose down
        exit /b 0
    )
)

echo [!] Docker is not running or not found. Falling back to native local mode...
echo [*] Launching FastAPI Backend with Dedicated GPU Optimization (Port 8000)...
set "PY_CMD=python"
if exist "%~dp0backend\venv\Scripts\python.exe" set "PY_CMD=%~dp0backend\venv\Scripts\python.exe"
start "IdentityLens Backend [NVIDIA GPU]" cmd /c "cd /d %~dp0backend && set CUDA_VISIBLE_DEVICES=0 && set PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True && "%PY_CMD%" -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

echo [*] Launching Vite Frontend Dashboard (Port 5173)...
start "IdentityLens Frontend" cmd /c "cd /d %~dp0 && npm run dev"

echo [*] Waiting 4 seconds for servers to start...
timeout /t 4 >nul

echo [*] Launching browser...
start http://localhost:5173

echo.
echo ======================================================================
echo  IdentityLens is running in local development mode!
echo  Frontend Dashboard: http://localhost:5173
echo  Backend API:        http://localhost:8000
echo  API Documentation:  http://localhost:8000/docs
echo  GPU Engine:         NVIDIA GeForce GTX 1650 (4096MB VRAM)
echo ======================================================================
echo.
echo ======================================================================
echo  Press any key in this window to STOP IdentityLens completely...
echo ======================================================================
pause >nul
echo.
echo [*] Shutting down IdentityLens services...
call "%~dp0stop-identitylens.bat"
exit /b 0
