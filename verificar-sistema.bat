@echo off
REM PRODE MUNDIAL 2026 - Verificacion de Readiness
REM Verifica que todo está listo antes de ejecutar

color 0B
title PRODE MUNDIAL 2026 - Sistema de Verificacion

echo ════════════════════════════════════════════════════════════
echo   PRODE MUNDIAL 2026 - VERIFICACIÓN DE SISTEMA
echo ════════════════════════════════════════════════════════════
echo.

REM Check node
echo [1/6] Verificando Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ FALLO: Node.js no está instalado
    echo Descarga Node.js desde: https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js instalado
node --version

REM Check npm
echo.
echo [2/6] Verificando npm...
npm --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ FALLO: npm no está instalado
    pause
    exit /b 1
)
echo ✅ npm instalado
npm --version

REM Check package.json
echo.
echo [3/6] Verificando package.json...
if not exist package.json (
    echo ❌ FALLO: package.json no existe
    pause
    exit /b 1
)
echo ✅ package.json existe

REM Check node_modules
echo.
echo [4/6] Verificando dependencias instaladas...
if not exist node_modules (
    echo ⚠️  AVISO: node_modules no existe
    echo Instalando dependencias...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ FALLO: No se pudo instalar dependencias
        pause
        exit /b 1
    )
)
echo ✅ node_modules existe

REM Check generate script
echo.
echo [5/6] Verificando script de generacion...
if not exist generate-files.mjs (
    echo ❌ FALLO: generate-files.mjs no existe
    pause
    exit /b 1
)
echo ✅ generate-files.mjs existe

REM Check vite config
echo.
echo [6/6] Verificando configuracion Vite...
if not exist vite.config.ts (
    echo ❌ FALLO: vite.config.ts no existe
    pause
    exit /b 1
)
echo ✅ vite.config.ts existe

echo.
echo ════════════════════════════════════════════════════════════
echo   ✅ TODAS LAS VERIFICACIONES PASARON
echo ════════════════════════════════════════════════════════════
echo.
echo   Sistema listo para ejecutar:
echo   
echo   npm run dev
echo.
echo   O ejecuta: run-project.bat
echo.
echo ════════════════════════════════════════════════════════════

pause
