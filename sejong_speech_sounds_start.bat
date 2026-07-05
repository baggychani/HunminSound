@echo off
setlocal
cd /d "%~dp0"
chcp 65001 >nul 2>&1
title Sejong Speech Sounds

rem ────────────────────────────────────────────────────────────
rem  Usage:
rem    double-click            → start server (reuse if already running) + open browser
rem    ..._start.bat stop      → stop the dev server
rem    ..._start.bat restart   → force restart + open browser
rem    ..._start.bat status    → show whether the server is running
rem
rem  The server now runs DETACHED in the background:
rem    • closing this window does NOT kill the server
rem    • double-clicking again just opens the browser (no restart)
rem    • logs: .dev-server.log / .dev-server.err.log
rem ────────────────────────────────────────────────────────────

echo.
echo  ------------------------------------------
echo   Sejong Speech Sounds  -  Dev Launcher
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

if /I "%~1"=="stop" (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-dev-server.ps1" -Action stop
  echo.
  echo  Server stopped. You can close this window.
  timeout /t 3 >nul
  goto :eof
)

if /I "%~1"=="status" (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-dev-server.ps1" -Action status
  echo.
  pause
  goto :eof
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

if /I "%~1"=="restart" (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-dev-server.ps1" -Action restart
) else (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-dev-server.ps1" -Action start
)

if errorlevel 1 (
  echo.
  echo  [ERROR] Dev server failed to start. Check .dev-server.err.log
  pause
  exit /b 1
)

rem Server is ready (or already was) → open the browser.
if exist "%~dp0open-dev-browser.ps1" (
  start "" powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0open-dev-browser.ps1"
)

echo.
echo  Browser opening... You can safely CLOSE this window.
echo  (The server keeps running in the background.)
echo.
echo  To stop the server later:  sejong_speech_sounds_start.bat stop
echo.
timeout /t 6 >nul
endlocal
