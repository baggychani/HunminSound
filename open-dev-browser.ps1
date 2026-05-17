$url = "http://localhost:3000"
$maxWaitSec = 40
$interval = 1
$elapsed = 0

Write-Host "브라우저 자동 열기 대기 중..." -ForegroundColor DarkGray

while ($elapsed -lt $maxWaitSec) {
    Start-Sleep -Seconds $interval
    $elapsed += $interval
    try {
        $req = [System.Net.WebRequest]::Create($url)
        $req.Timeout = 800
        $res = $req.GetResponse()
        $res.Close()
        Start-Process $url
        exit
    } catch {
        # 아직 서버 준비 안 됨 — 계속 대기
    }
}

# 타임아웃 — 그냥 열기 시도
Start-Process $url
