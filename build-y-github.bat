@echo off
echo ════════════════════════════════════════════════════════════════════════════════
echo  BUILD y GITHUB SETUP - PRODE MUNDIAL 2026
echo ════════════════════════════════════════════════════════════════════════════════

cd D:\Dev-Work\PRODE_MUNDIAL

echo.
echo ✅ PASO 1: Build del Proyecto
echo ════════════════════════════════════════════════════════════════════════════════
npm run build

if errorlevel 1 (
    echo ❌ ERROR en el build
    pause
    exit /b 1
)

echo.
echo ✅ PASO 2: Inicializando Git (si no existe)
echo ════════════════════════════════════════════════════════════════════════════════
git status >nul 2>&1
if errorlevel 1 (
    echo Git no inicializado, inicializando...
    git init
    git config user.name "Aliyus"
    git config user.email "aaliyusdev@gmail.com"
) else (
    echo Git ya está inicializado
)

echo.
echo ✅ PASO 3: Agregando archivos a Git
echo ════════════════════════════════════════════════════════════════════════════════
git add .

echo.
echo ✅ PASO 4: Creando commit
echo ════════════════════════════════════════════════════════════════════════════════
git commit -m "PRODE MUNDIAL 2026 - Versión 2.1 - Build listo para GitHub"

echo.
echo ════════════════════════════════════════════════════════════════════════════════
echo  ✅ BUILD COMPLETADO EXITOSAMENTE
echo ════════════════════════════════════════════════════════════════════════════════
echo.
echo 📋 PRÓXIMOS PASOS EN GITHUB:
echo.
echo 1. Abre: https://github.com/new
echo.
echo 2. Crea un repositorio con el nombre "prode-mundial-2026"
echo.
echo 3. Copia el comando remoto que te da GitHub:
echo    git remote add origin https://github.com/Aliyus77/prode-mundial-2026.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 4. Pega los comandos en PowerShell en esta carpeta:
echo    D:\Dev-Work\PRODE_MUNDIAL
echo.
echo ════════════════════════════════════════════════════════════════════════════════

pause
