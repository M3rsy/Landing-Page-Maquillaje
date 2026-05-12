$Root = Split-Path -Parent $PSScriptRoot
$Tools = Join-Path $Root "tools"
$Tailwind = Join-Path $Tools "tailwindcss.exe"
$Version = "v3.4.17"
$Url = "https://github.com/tailwindlabs/tailwindcss/releases/download/$Version/tailwindcss-windows-x64.exe"

New-Item -ItemType Directory -Path $Tools -Force | Out-Null

Write-Host "Descargando Tailwind CSS $Version..."
Invoke-WebRequest -Uri $Url -OutFile $Tailwind
Write-Host "Tailwind local listo en tools\tailwindcss.exe"
