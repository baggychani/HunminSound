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

rem 3000 또는 3001 중 응답하는 주소로 브라우저 열기 (백그라운드)
start "" powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -Command "Start-Sleep -Seconds 6; foreach ($p in @(3000,3001)) { try { $u = 'http://127.0.0.1:' + $p; $null = Invoke-WebRequest -Uri $u -TimeoutSec 2 -UseBasicParsing; Start-Process $u; exit } catch {} }"

call npm run dev
endlocal
