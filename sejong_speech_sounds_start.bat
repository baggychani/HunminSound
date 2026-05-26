@echo off
setlocal
cd /d "%~dp0"
chcp 65001 >nul 2>&1
title Sejong Speech Sounds

echo.
echo  ------------------------------------------
echo   Sejong Speech Sounds  - Dev Server
echo  ------------------------------------------
echo.

where npm >nul 2>&1
if errorlevel 1 (
  echo  [ERROR] npm not found.
  echo.
  echo  Node.js is not installed on this computer.
  echo  Please install the LTS version from:
  echo.
  echo    https://nodejs.org/
  echo.
  echo  After installing, close this window and run the bat again.
  echo.
  pause
  exit /b 1
)

if not exist "%~dp0node_modules\" (
  echo  [SETUP] node_modules not found - running npm install...
  echo.
  npm install
  if errorlevel 1 (
    echo.
    echo  [ERROR] npm install failed. Check the error above.
    pause
    exit /b 1
  )
)

if /I "%~1"=="stop" (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-dev-server.ps1" -Stop
  goto :eof
)

if exist "%~dp0open-dev-browser.ps1" (
  start "" powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0open-dev-browser.ps1"
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-dev-server.ps1"
if errorlevel 1 (
  echo.
  echo  [ERROR] Dev server exited with an error. Check the log above.
  pause
)
endlocal