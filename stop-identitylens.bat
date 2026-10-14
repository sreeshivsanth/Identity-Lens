@echo off
title IdentityLens Shutdown

echo ======================================================================
echo              SHUTTING DOWN IDENTITYLENS
echo ======================================================================
echo.

:: Stop Docker containers if running
docker info >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [*] Stopping Docker Compose containers...
    cd /d %~dp0
    docker compose down
)

:: Terminate running Node/Python processes bound to our dev ports
echo [*] Terminating local development listeners...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1

echo.
echo [*] IdentityLens services have been stopped cleanly.
timeout /t 2 >nul
exit /b 0
