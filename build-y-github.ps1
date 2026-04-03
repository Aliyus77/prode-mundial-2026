#!/usr/bin/env pwsh

Write-Host "════════════════════════════════════════════════════════════════════════════════"
Write-Host "  🚀 BUILD Y GITHUB SETUP - PRODE MUNDIAL 2026"
Write-Host "════════════════════════════════════════════════════════════════════════════════"
Write-Host ""

$projectPath = "D:\Dev-Work\PRODE_MUNDIAL"

# Navegar a la carpeta
Set-Location $projectPath
Write-Host "✅ En carpeta: $projectPath"
Write-Host ""

# PASO 1: Build
Write-Host "════════════════════════════════════════════════════════════════════════════════"
Write-Host "  ✅ PASO 1: Build del Proyecto"
Write-Host "════════════════════════════════════════════════════════════════════════════════"
Write-Host ""
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en el build"
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host ""
Write-Host "✅ Build completado exitosamente"
Write-Host ""

# PASO 2: Verificar si Git está inicializado
Write-Host "════════════════════════════════════════════════════════════════════════════════"
Write-Host "  ✅ PASO 2: Inicializando Git"
Write-Host "════════════════════════════════════════════════════════════════════════════════"
Write-Host ""

if (!(Test-Path ".git")) {
    Write-Host "Git no está inicializado. Inicializando..."
    git init
    git config user.name "Aliyus"
    git config user.email "aaliyusdev@gmail.com"
    Write-Host "✅ Git inicializado"
} else {
    Write-Host "✅ Git ya está inicializado"
}

Write-Host ""

# PASO 3: Agregar archivos
Write-Host "════════════════════════════════════════════════════════════════════════════════"
Write-Host "  ✅ PASO 3: Agregando archivos a Git"
Write-Host "════════════════════════════════════════════════════════════════════════════════"
Write-Host ""
git add .
Write-Host "✅ Archivos agregados"
Write-Host ""

# PASO 4: Crear commit
Write-Host "════════════════════════════════════════════════════════════════════════════════"
Write-Host "  ✅ PASO 4: Creando commit"
Write-Host "════════════════════════════════════════════════════════════════════════════════"
Write-Host ""
git commit -m "PRODE MUNDIAL 2026 - v2.1 - Build listo para GitHub

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════════════════════"
Write-Host "  ✅ BUILD Y GIT COMPLETADO EXITOSAMENTE"
Write-Host "════════════════════════════════════════════════════════════════════════════════"
Write-Host ""

Write-Host "📋 PRÓXIMOS PASOS:"
Write-Host ""
Write-Host "1️⃣  Abre: https://github.com/new"
Write-Host ""
Write-Host "2️⃣  Crea un repositorio:"
Write-Host "    Nombre: prode-mundial-2026"
Write-Host "    Descripción: PRODE MUNDIAL 2026 - Sistema de Predicciones"
Write-Host "    Público o Privado: A tu elección"
Write-Host "    SIN inicializar README"
Write-Host ""
Write-Host "3️⃣  Copia el comando remoto que GitHub te da"
Write-Host ""
Write-Host "4️⃣  Ejecuta aquí (o en PowerShell en $projectPath):"
Write-Host ""
Write-Host "    git remote add origin https://github.com/Aliyus77/prode-mundial-2026.git"
Write-Host "    git branch -M main"
Write-Host "    git push -u origin main"
Write-Host ""
Write-Host "5️⃣  Ingresa tu GitHub Personal Token cuando te lo pida"
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════════════════════"
Write-Host ""

# Opcional: Preguntar si hacer push ahora
$respuesta = Read-Host "¿Deseas hacer push a GitHub ahora? (s/n)"

if ($respuesta -eq "s" -or $respuesta -eq "S") {
    Write-Host ""
    Write-Host "Por favor, ingresa la URL del repositorio cuando se te solicite"
    Write-Host "(Debe estar creado en GitHub primero)"
    Write-Host ""
    
    $remoteUrl = Read-Host "URL del repositorio (https://github.com/Aliyus77/...)"
    
    if ($remoteUrl) {
        git remote add origin $remoteUrl
        git branch -M main
        git push -u origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ ¡Push completado exitosamente!"
            Write-Host ""
            Write-Host "Verifica en: https://github.com/Aliyus77/prode-mundial-2026"
        } else {
            Write-Host ""
            Write-Host "❌ Error en el push. Intenta manualmente con los comandos arriba."
        }
    }
}

Write-Host ""
Read-Host "Presiona Enter para cerrar"
