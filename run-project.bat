@echo off
REM PRODE MUNDIAL 2026 - Setup and Run
color 0A
title PRODE MUNDIAL 2026 Setup

echo ============================================
echo    PRODE MUNDIAL 2026 - Setup & Run
echo ============================================
echo.
echo Generando estructura del proyecto...
echo Esto solo ocurre la primera vez.
echo.

cd /d "%~dp0"

REM Install setup
echo Paso 1: Crear directorios y archivos...
node generate-files.mjs

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: No se pudo generar los archivos.
    echo Intenta ejecutar manualmente:
    echo   npm run setup
    pause
    exit /b 1
)

echo.
echo ============================================
echo    Iniciando servidor de desarrollo
echo ============================================
echo.
echo Abre tu navegador en: http://localhost:5173
echo.
echo Login demo:
echo   Email: admin@prode.com
echo   Contraseña: admin123
echo.

npm run dev

pause

