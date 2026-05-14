@echo off
setlocal
title 세종말소리 · Sejong Speech Sounds
cd /d "%~dp0"

rem 파일 인코딩: UTF-8(BOM 권장). chcp 65001 후 한글 출력이 안정적입니다.
chcp 65001 >nul 2>&1

echo.
echo  ------------------------------------------
echo   세종말소리 · Sejong Speech Sounds
echo   개발 서버 시작
echo  ------------------------------------------
echo.
echo  서버를 시작합니다. 잠시 기다려주세요...
echo  준비되면 브라우저가 자동으로 열립니다.
echo.
echo  메인 사이트  http://localhost:3000  ^(3000이 바쁘면 터미널에 나온 포트^)
echo  CMS 관리자  http://localhost:3000/studio
echo.
echo  이 CMD 창을 닫으면 개발 서버 프로세스도 함께 종료됩니다.
echo  ------------------------------------------
echo.

rem 서버가 실제로 응답할 때까지 폴링한 뒤 기본 브라우저로 엽니다. (open-dev-browser.ps1)
start "" powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0open-dev-browser.ps1"

call npm run dev
endlocal
