@echo off
title IdentityLens - Cloudflare Zero Trust Free Tunnel Launcher
cls
echo ===============================================================================
echo     IDENTITYLENS - CLOUDFLARE ZERO TRUST TUNNEL LAUNCHER (ZERO COST)
echo ===============================================================================
echo.
echo This utility establishes a secure, zero-cost HTTPS tunnel from the public
echo internet to your local IdentityLens FastAPI engine (port 8000).
echo.
echo Checking for cloudflared executable...
where cloudflared >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [NOTICE] cloudflared CLI is not found on your system PATH.
    echo.
    echo To run an instant, 100%% free Cloudflare tunnel:
    echo 1. Download 'cloudflared-windows-amd64.exe' from:
    echo    https://github.com/cloudflare/cloudflared/releases/latest
    echo 2. Rename it to 'cloudflared.exe' and place it in this folder.
    echo 3. Run this script again to get your instant free public HTTPS link!
    echo.
    echo Alternatively, run:
    echo winget install --id Cloudflare.cloudflared
    echo.
    pause
    exit /b
)

echo [OK] cloudflared is detected. Launching instant zero-cost tunnel...
echo Tunnel target: http://localhost:8000
echo.
cloudflared tunnel --url http://localhost:8000
pause
