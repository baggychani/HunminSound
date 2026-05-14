# Re-saves launcher files as UTF-8 with BOM (Windows PowerShell 5.1 + CMD read Korean reliably).
$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$utf8Bom = New-Object System.Text.UTF8Encoding $true
$utf8 = New-Object System.Text.UTF8Encoding $false

$ps1 = Join-Path $repoRoot 'run-dev-server.ps1'
if (-not (Test-Path -LiteralPath $ps1)) {
  throw "Missing file: $ps1"
}
$ps1Text = [System.IO.File]::ReadAllText($ps1, $utf8)
[System.IO.File]::WriteAllText($ps1, $ps1Text, $utf8Bom)
Write-Host "Wrote UTF-8 BOM: $ps1"

$bats = @(Get-ChildItem -LiteralPath $repoRoot -Filter '*.bat' -File | Where-Object { $_.Name -notlike '._*' })
if ($bats.Count -lt 1) {
  throw "No .bat launcher found in repo root: $repoRoot"
}
if ($bats.Count -gt 1) {
  throw "Multiple .bat files in repo root; keep only one launcher .bat: $($bats.Name -join ', ')"
}
$bat = $bats[0].FullName
$batText = [System.IO.File]::ReadAllText($bat, $utf8)
[System.IO.File]::WriteAllText($bat, $batText, $utf8Bom)
Write-Host "Wrote UTF-8 BOM: $bat"
