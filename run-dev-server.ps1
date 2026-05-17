param(
  [switch]$Stop
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$pidFile = Join-Path $repoRoot '.dev-server.pid'

function Stop-TreeByProcessId {
  param(
    [Parameter(Mandatory = $true)]
    [int]$ProcessId
  )

  $proc = Get-Process -Id $ProcessId -ErrorAction SilentlyContinue
  if ($null -eq $proc) {
    return
  }

  & taskkill /PID $ProcessId /T /F *> $null
}

function Read-PidFile {
  if (-not (Test-Path $pidFile)) {
    return $null
  }

  $raw = (Get-Content $pidFile -Raw).Trim()
  if ([string]::IsNullOrWhiteSpace($raw)) {
    return $null
  }

  $parsedId = 0
  if (-not [int]::TryParse($raw, [ref]$parsedId)) {
    return $null
  }

  return $parsedId
}

if ($Stop) {
  $existingId = Read-PidFile
  if ($null -ne $existingId) {
    Stop-TreeByProcessId -ProcessId $existingId
  }

  if (Test-Path $pidFile) {
    Remove-Item $pidFile -Force
  }
  exit 0
}

# 이전 실행에서 남은 프로세스가 있으면 먼저 정리한다.
$staleId = Read-PidFile
if ($null -ne $staleId) {
  Stop-TreeByProcessId -ProcessId $staleId
  if (Test-Path $pidFile) {
    Remove-Item $pidFile -Force
  }
}

$devProcess = Start-Process `
  -FilePath 'cmd.exe' `
  -ArgumentList '/c npm run dev' `
  -WorkingDirectory $repoRoot `
  -NoNewWindow `
  -PassThru

Set-Content -Path $pidFile -Value $devProcess.Id -NoNewline

try {
  Wait-Process -Id $devProcess.Id
}
finally {
  if (Test-Path $pidFile) {
    Remove-Item $pidFile -Force
  }
}