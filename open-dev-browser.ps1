# next dev 가 응답할 때까지 최대 약 90초 간격으로 확인한 뒤 기본 브라우저로 사이트를 엽니다.
$ErrorActionPreference = 'SilentlyContinue'
$deadline = (Get-Date).AddSeconds(90)
while ((Get-Date) -lt $deadline) {
  foreach ($port in @(3000, 3001)) {
    $uri = "http://127.0.0.1:$port/"
    try {
      $r = Invoke-WebRequest -Uri $uri -TimeoutSec 3 -UseBasicParsing
      if ($null -ne $r -and $r.StatusCode -ge 200 -and $r.StatusCode -lt 500) {
        Start-Process $uri.TrimEnd('/')
        exit 0
      }
    } catch { }
  }
  Start-Sleep -Seconds 2
}
