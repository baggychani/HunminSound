@echo off
setlocal
cd /d "%~dp0"
chcp 65001 >nul 2>&1
title Sejong Speech Sounds

echo.
echo  ------------------------------------------
echo   Sejong Speech Sounds
echo  ------------------------------------------
echo.

if /I "%~1"=="stop" (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-dev-server.ps1" -Stop
  goto :eof
)

if exist "%~dp0open-dev-browser.ps1" (
  start "" powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0open-dev-browser.ps1"
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-dev-server.ps1"
endlocal
