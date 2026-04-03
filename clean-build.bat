@echo off
echo ════════════════════════════════════════════════════════════════════════════════
echo  LIMPIEZA COMPLETA Y BUILD FRESCO - PRODE MUNDIAL 2026
echo ════════════════════════════════════════════════════════════════════════════════
echo.

cd D:\Dev-Work\PRODE_MUNDIAL

echo.
echo ✅ PASO 1: Limpiar carpeta dist (build anterior)
echo ════════════════════════════════════════════════════════════════════════════════
if exist dist (
    echo Eliminando dist/...
    rmdir /s /q dist
    echo ✅ dist/ eliminada
) else (
    echo dist/ no existe, continuando...
)

echo.
echo ✅ PASO 2: Limpiar caché de Vite
echo ════════════════════════════════════════════════════════════════════════════════
if exist node_modules\.vite (
    echo Eliminando node_modules\.vite...
    rmdir /s /q node_modules\.vite
    echo ✅ Caché de Vite eliminada
)

echo.
echo ✅ PASO 3: Instalar dependencias (si necesario)
echo ════════════════════════════════════════════════════════════════════════════════
npm install

echo.
echo ✅ PASO 4: Build fresco
echo ════════════════════════════════════════════════════════════════════════════════
npm run build

if %errorlevel% equ 0 (
    echo.
    echo ════════════════════════════════════════════════════════════════════════════════
    echo  ✅ BUILD COMPLETADO EXITOSAMENTE
    echo ════════════════════════════════════════════════════════════════════════════════
    echo.
    echo Carpeta dist/ creada con todos los cambios
    echo.
    echo PRÓXIMO PASO: Ejecuta npm run dev para ver los cambios
    echo.
) else (
    echo.
    echo ════════════════════════════════════════════════════════════════════════════════
    echo  ❌ ERROR EN BUILD
    echo ════════════════════════════════════════════════════════════════════════════════
)

pause
