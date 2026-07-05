param(
  # start   : (default) reuse healthy server if present, otherwise launch detached
  # stop    : stop the dev server
  # restart : stop then start
  # status  : print whether the server is running and on which port
  [ValidateSet('start', 'stop', 'restart', 'status')]
  [string]$Action = 'start',

  # kept for backward compatibility with the old "-Stop" switch
  [switch]$Stop
)

$ErrorActionPreference = 'Stop'

if ($Stop) { $Action = 'stop' }

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$pidFile = Join-Path $repoRoot '.dev-server.pid'
$outLog = Join-Path $repoRoot '.dev-server.log'
$errLog = Join-Path $repoRoot '.dev-server.err.log'
$ports = @(3000, 3001)

function Read-PidFile {
  if (-not (Test-Path $pidFile)) { return $null }
  $raw = (Get-Content $pidFile -Raw -ErrorAction SilentlyContinue)
  if ([string]::IsNullOrWhiteSpace($raw)) { return $null }
  $parsedId = 0
  if (-not [int]::TryParse($raw.Trim(), [ref]$parsedId)) { return $null }
  return $parsedId
}

function Test-PidAlive {
  param([int]$ProcessId)
  return $null -ne (Get-Process -Id $ProcessId -ErrorAction SilentlyContinue)
}

function Stop-TreeByProcessId {
  param([int]$ProcessId)
  if (-not (Test-PidAlive -ProcessId $ProcessId)) { return }
  & taskkill /PID $ProcessId /T /F *> $null
}

# Returns the port number of a responding dev server, or $null.
function Get-HealthyPort {
  foreach ($port in $ports) {
    try {
      $r = Invoke-WebRequest -Uri "http://127.0.0.1:$port/" -TimeoutSec 2 -UseBasicParsing
      if ($null -ne $r -and $r.StatusCode -ge 200 -and $r.StatusCode -lt 500) { return $port }
    } catch { }
  }
  return $null
}

function Stop-DevServer {
  $existingId = Read-PidFile
  if ($null -ne $existingId) {
    Stop-TreeByProcessId -ProcessId $existingId
    Write-Host "  [STOP] Killed dev server tree (PID $existingId)."
  }

  # Safety net: kill anything still listening on the dev ports (orphaned node).
  foreach ($port in $ports) {
    $conns = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    foreach ($c in $conns) {
      $owner = $c.OwningProcess
      if ($owner -and $owner -ne 0 -and $owner -ne $PID) {
        $p = Get-Process -Id $owner -ErrorAction SilentlyContinue
        if ($null -ne $p -and $p.ProcessName -match 'node') {
          Stop-TreeByProcessId -ProcessId $owner
          Write-Host "  [STOP] Killed orphaned node process on port $port (PID $owner)."
        }
      }
    }
  }

  if (Test-Path $pidFile) { Remove-Item $pidFile -Force }
}

function Start-DevServerDetached {
  # Detached + hidden: closing the launcher window does NOT kill the server.
  $devProcess = Start-Process `
    -FilePath 'cmd.exe' `
    -ArgumentList '/c npm run dev' `
    -WorkingDirectory $repoRoot `
    -WindowStyle Hidden `
    -RedirectStandardOutput $outLog `
    -RedirectStandardError $errLog `
    -PassThru

  Set-Content -Path $pidFile -Value $devProcess.Id -NoNewline
  Write-Host "  [START] Dev server launching in background (PID $($devProcess.Id))."
  Write-Host "          Log: $outLog"

  $deadline = (Get-Date).AddSeconds(120)
  while ((Get-Date) -lt $deadline) {
    if (-not (Test-PidAlive -ProcessId $devProcess.Id)) {
      Write-Host ''
      Write-Host '  [ERROR] Dev server process exited during startup. Last log lines:'
      if (Test-Path $errLog) { Get-Content $errLog -Tail 15 | ForEach-Object { Write-Host "    $_" } }
      if (Test-Path $outLog) { Get-Content $outLog -Tail 15 | ForEach-Object { Write-Host "    $_" } }
      exit 1
    }
    $port = Get-HealthyPort
    if ($null -ne $port) {
      Write-Host "  [READY] http://localhost:$port"
      return $port
    }
    Start-Sleep -Milliseconds 800
  }

  Write-Host '  [WARN] Server did not respond within 120s. It may still be compiling.'
  Write-Host "         Check the log: $outLog"
  return $null
}

switch ($Action) {
  'status' {
    $port = Get-HealthyPort
    $procId = Read-PidFile
    if ($null -ne $port) {
      Write-Host "  [STATUS] RUNNING - http://localhost:$port $(if ($procId) { "(PID $procId)" })"
      exit 0
    }
    if ($null -ne $procId -and (Test-PidAlive -ProcessId $procId)) {
      Write-Host "  [STATUS] STARTING - process alive (PID $procId) but not responding yet."
      exit 0
    }
    Write-Host '  [STATUS] STOPPED'
    exit 3
  }

  'stop' {
    Stop-DevServer
    exit 0
  }

  'restart' {
    Stop-DevServer
    Start-Sleep -Milliseconds 500
    $null = Start-DevServerDetached
    exit 0
  }

  'start' {
    $port = Get-HealthyPort
    if ($null -ne $port) {
      Write-Host "  [OK] Dev server already running - http://localhost:$port (no restart needed)"
      exit 0
    }

    # Not responding: clear any stale process, then launch fresh.
    Stop-DevServer
    $null = Start-DevServerDetached
    exit 0
  }
}
