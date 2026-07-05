@echo off
setlocal
cd /d "%~dp0"
chcp 65001 >nul 2>&1
title Sejong Speech Sounds - Stop

echo.
echo  Stopping Sejong Speech Sounds dev server...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-dev-server.ps1" -Action stop

echo.
echo  Done. This window closes automatically.
timeout /t 3 >nul
endlocal
