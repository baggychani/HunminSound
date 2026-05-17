@echo off
setlocal
cd /d "%~dp0"
chcp 65001 >nul 2>&1
title Sejong Speech Sounds

echo.
echo  ------------------------------------------
echo   Sejong Speech Sounds  - 개발 서버
echo  ------------------------------------------
echo.

:: ── Node.js / npm 설치 여부 확인 ──────────────────────────────────────────
where npm >nul 2>&1
if errorlevel 1 (
  echo  [오류] npm 을 찾을 수 없습니다.
  echo.
  echo  이 컴퓨터에 Node.js 가 설치되지 않았습니다.
  echo  아래 주소에서 LTS 버전을 설치한 뒤 다시 실행하세요.
  echo.
  echo    https://nodejs.org/
  echo.
  echo  설치 후 이 창을 닫고 bat 파일을 다시 실행하면 됩니다.
  echo.
  pause
  exit /b 1
)

:: node_modules 없으면 npm install 먼저 실행
if not exist "%~dp0node_modules\" (
  echo  [준비] node_modules 없음 - npm install 실행 중...
  echo.
  npm install
  if errorlevel 1 (
    echo.
    echo  [오류] npm install 실패. 위 오류 내용을 확인하세요.
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
  echo  [오류] 개발 서버 실행 중 문제가 발생했습니다. 위 로그를 확인하세요.
  pause
)
endlocal
