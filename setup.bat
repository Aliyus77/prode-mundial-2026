@echo off
REM Script para crear la estructura de carpetas del proyecto

echo Creando estructura de carpetas...

mkdir src\types 2>nul
mkdir src\services 2>nul
mkdir src\utils 2>nul
mkdir src\contexts 2>nul
mkdir src\hooks 2>nul
mkdir src\components\common 2>nul
mkdir src\components\auth 2>nul
mkdir src\components\admin 2>nul
mkdir src\pages 2>nul

echo.
echo Estructura de carpetas creada exitosamente.
echo.
echo Ahora ejecuta: npm install && npm run dev
echo.
pause
