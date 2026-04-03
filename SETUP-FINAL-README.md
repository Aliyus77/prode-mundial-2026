# PRODE MUNDIAL 2026 - Setup Final

## 🚀 Inicio Rápido

Ejecuta este comando en PowerShell o CMD desde la carpeta del proyecto:

```bash
npm run dev
```

Esto hará automáticamente:
1. ✅ Crear la estructura de directorios src/
2. ✅ Generar todos los archivos del proyecto
3. ✅ Iniciar el servidor Vite en http://localhost:5173

## 📋 Si necesitas setup manual

Si por alguna razón el comando anterior no funciona, ejecuta:

```bash
node generate-files.mjs
npm run dev
```

## 🔐 Login Demo

Una vez que el servidor esté en línea, abre:
```
http://localhost:5173
```

**Admin:**
- Email: `admin@prode.com`
- Contraseña: `admin123`

**Usuario común:**
- Email: `juan@example.com`  
- Contraseña: `pass123`

O crea tu propia cuenta con el formulario de Registro.

## 📂 Estructura del Proyecto

```
src/
├── types/              # Interfaces TypeScript
├── components/         # Componentes React
│   ├── common/        # Componentes generales
│   ├── auth/          # Componentes de autenticación
│   └── admin/         # Componentes administrativos
├── pages/             # Páginas principales
├── contexts/          # Context API
├── hooks/             # Custom hooks
├── services/          # Servicios API
├── utils/             # Utilidades
├── theme.ts           # Configuración MUI
├── App.tsx            # Componente principal
└── main.tsx           # Punto de entrada
```

##✨ Funcionalidades

- ✅ Autenticación con login/registro
- ✅ Dashboard de admin
- ✅ Visualización de grupos y partidos
- ✅ Sistema de ranking/podio
- ✅ Validación con Zod
- ✅ UI responsiva con Material-UI
- ✅ Datos mock (sin backend real)

## 🔧 Tecnologías

- React 18+ con TypeScript
- Material-UI v5
- Vite
- React Router
- React Hook Form + Zod
- Date-fns
- Context API

## ❌ Si aún hay problemas

Intenta en este orden:

1. `npm install` (instala dependencias de nuevo)
2. `npm run setup` (solo genera archivos)
3. `npm run dev` (inicia el servidor)

---

¡Diviértete con PRODE MUNDIAL 2026! ⚽
