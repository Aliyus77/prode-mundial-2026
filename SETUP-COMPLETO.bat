@echo off
REM ============================================
REM PRODE MUNDIAL 2026 - SETUP COMPLETO
REM ============================================

echo.
echo ============================================
echo  PRODE MUNDIAL 2026 - SETUP
echo ============================================
echo.

REM Verificar si Node está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js no está instalado.
    echo Descárgalo desde: https://nodejs.org
    pause
    exit /b 1
)

REM Verificar versión de Node
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION% detectado

REM Limpiar si existen node_modules viejos
if exist node_modules (
    echo.
    echo Limpiando node_modules antiguos...
    rmdir /s /q node_modules >nul 2>nul
)

if exist package-lock.json (
    del package-lock.json >nul 2>nul
)

REM Generar archivos del proyecto
echo.
echo ============================================
echo GENERANDO ARCHIVOS DEL PROYECTO...
echo ============================================
echo.

if exist src (
    echo La carpeta src ya existe.
    choice /C YN /M "Deseas regenerar los archivos?"
    if errorlevel 2 goto skip_generation
    if errorlevel 1 (
        rmdir /s /q src >nul 2>nul
    )
)

:skip_generation

REM Ejecutar generador si src no existe
if not exist src (
    echo Ejecutando node create-all-files.js...
    node create-all-files.js
    if %errorlevel% neq 0 (
        echo ERROR: No se pudieron generar los archivos.
        pause
        exit /b 1
    )
)

REM Instalar dependencias
echo.
echo ============================================
echo INSTALANDO DEPENDENCIAS...
echo ============================================
echo.
echo Esto puede tomar 2-3 minutos...
echo.

call npm install
if %errorlevel% neq 0 (
    echo ERROR: No se pudieron instalar las dependencias.
    pause
    exit /b 1
)

REM Verificar archivos importantes
echo.
echo ============================================
echo VERIFICANDO ESTRUCTURA...
echo ============================================
echo.

set missing=0
if not exist src\App.tsx echo ERROR: Falta src\App.tsx && set missing=1
if not exist src\main.tsx echo ERROR: Falta src\main.tsx && set missing=1
if not exist src\types\index.ts echo ERROR: Falta src\types\index.ts && set missing=1
if not exist src\services\mockApi.ts echo ERROR: Falta src\services\mockApi.ts && set missing=1
if not exist package.json echo ERROR: Falta package.json && set missing=1

if %missing% equ 1 (
    echo.
    echo ERROR: Faltan archivos importantes. Verifica la carpeta src/
    pause
    exit /b 1
)

echo [OK] Estructura completa
echo [OK] Dependencias instaladas
echo [OK] Proyecto listo para ejecutar

REM Mostrar instrucciones finales
echo.
echo ============================================
echo SETUP COMPLETADO EXITOSAMENTE!
echo ============================================
echo.
echo 🚀 PARA INICIAR LA APLICACION:
echo.
echo    npm run dev
echo.
echo La aplicación se abrirá en http://localhost:5173
echo.
echo 🔐 CREDENCIALES DE PRUEBA:
echo.
echo    Email:      admin@prode.com
echo    Contraseña: admin123
echo.
echo 📚 MAS INFORMACION:
echo.
echo    Abre README.md o INSTRUCCIONES.md
echo    o ejecuta: node welcome.js
echo.
echo ============================================
echo.

REM Preguntar si iniciar dev
set /p start="Deseas iniciar npm run dev ahora? (S/N): "
if /i "%start%"=="S" (
    npm run dev
) else (
    echo.
    echo Cuando quieras iniciar, ejecuta:
    echo   npm run dev
)

pause
