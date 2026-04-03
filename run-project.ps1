# PRODE MUNDIAL 2026 - PowerShell Setup Script

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  PRODE MUNDIAL 2026 - Setup & Run" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath

Write-Host "Paso 1: Generando estructura del proyecto..." -ForegroundColor Yellow
Write-Host "Esto solo ocurre la primera vez."
Write-Host ""

& node generate-files.mjs

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: No se pudo generar los archivos." -ForegroundColor Red
    Write-Host "Intenta ejecutar manualmente: npm run setup" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Iniciando servidor de desarrollo" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Abre tu navegador en: http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "Login demo:" -ForegroundColor Yellow
Write-Host "  Email: admin@prode.com"
Write-Host "  Contraseña: admin123"
Write-Host ""

& npm run dev

Read-Host "Presiona Enter para cerrar"
