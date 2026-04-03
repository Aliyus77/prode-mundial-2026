@echo off
REM ============================================
REM Generar archivos del proyecto
REM ============================================

echo.
echo Generando archivos de src/...
echo.

node setup-final.js

if %errorlevel% neq 0 (
    echo ERROR en la generacion
    pause
    exit /b 1
)

echo.
echo Archivos generados exitosamente.
echo.
echo Iniciando npm run dev...
echo.

npm run dev

pause
