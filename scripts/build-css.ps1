$Root = Split-Path -Parent $PSScriptRoot
$Tailwind = Join-Path $Root "tools\tailwindcss.exe"
$InputCss = Join-Path $Root "assets\css\input.css"
$OutputCss = Join-Path $Root "assets\css\styles.css"
$OutputMinCss = Join-Path $Root "assets\css\styles.min.css"

if (-not (Test-Path $Tailwind)) {
  Write-Error "No se encontro tools\tailwindcss.exe. Descarga Tailwind local antes de compilar."
  exit 1
}

& $Tailwind -c (Join-Path $Root "tailwind.config.js") -i $InputCss -o $OutputCss
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

& $Tailwind -c (Join-Path $Root "tailwind.config.js") -i $InputCss -o $OutputMinCss --minify
exit $LASTEXITCODE
