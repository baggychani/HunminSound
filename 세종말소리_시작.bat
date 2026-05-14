@echo off
setlocal
cd /d "%~dp0"
rem UTF-8: switch code page before any Korean (title/echo).
chcp 65001 >nul 2>&1
title 세종말소리 · Sejong Speech Sounds

echo.
echo  ------------------------------------------
echo   세종말소리 · Sejong Speech Sounds
echo   개발 서버 제어
echo  ------------------------------------------
echo.

if /I "%~1"=="stop" (
  echo  실행 중인 개발 서버를 정리합니다...
  powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-dev-server.ps1" -Stop
  echo.
  echo  정리 완료.
  echo  ------------------------------------------
  goto :eof
)

echo  서버를 시작합니다. 잠시 기다려주세요...
echo  준비되면 브라우저가 자동으로 열립니다.
echo.
echo  메인 사이트  http://localhost:3000  ^(3000이 바쁘면 터미널에 나온 포트^)
echo  CMS 관리자  http://localhost:3000/studio
echo.
echo  종료 방법:
echo   1^) 이 창에서 Ctrl+C
echo   2^) 또는 새 창에서  세종말소리_시작.bat stop
echo  ------------------------------------------
echo.

if exist "%~dp0open-dev-browser.ps1" (
  rem 서버가 실제로 응답할 때까지 폴링한 뒤 기본 브라우저로 엽니다.
  start "" powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0open-dev-browser.ps1"
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-dev-server.ps1"
endlocal
