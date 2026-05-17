param([switch]$Stop)

$projectDir = Split-Path $MyInvocation.MyCommand.Path -Parent
Set-Location $projectDir

if ($Stop) {
    Write-Host "개발 서버를 종료합니다..." -ForegroundColor Yellow
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "종료됨." -ForegroundColor Green
    exit
}

Write-Host ""
Write-Host "  개발 서버 시작 중..." -ForegroundColor Cyan
Write-Host "  주소: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

npm run dev
