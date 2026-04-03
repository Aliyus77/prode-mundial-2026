# INSTRUCCIONES DE USO - PRODE MUNDIAL 2026

## 🚀 Instalación Rápida

### Opción 1: Generación Automática (Recomendado)

```bash
# 1. Ejecutar el script de generación (crea todas las carpetas y archivos)
node create-all-files.js

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:5173`

### Opción 2: Creación Manual

```bash
# 1. Crear estructura de carpetas
mkdir -p src/{types,services,utils,contexts,hooks,components/{common,auth,admin},pages}

# 2. Copiar archivos (usar los archivos proporcionados)

# 3. Instalar y ejecutar
npm install
npm run dev
```

## 🔐 Credenciales de Acceso

### Cuenta de Administrador
- **Email:** admin@prode.com
- **Contraseña:** admin123

### Crear Nueva Cuenta
- Usa la opción "Registro" con cualquier email y contraseña válida

## ✨ Funcionalidades Disponibles

### 👤 Usuario Regular
- ✅ Registrarse y loguearse
- ✅ Ver tabla de grupos y partidos
- ✅ Ver ranking/podio en tiempo real
- ✅ Recibir notificaciones de premios
- ✅ Logout

### 👑 Administrador (acceso con admin@prode.com)
- ✅ Dashboard de usuarios (tabla con filtros)
- ✅ Crear premios (con criterios automáticos)
- ✅ Ver historial de premios entregados
- ✅ Cargar banner publicitario (imagen)
- ✅ Cargar resultados de partidos (con restricción temporal)
- ✅ Todos los accesos de usuario regular

## 📊 Datos Mock

La aplicación incluye datos simulados:
- **2 usuarios iniciales:** Admin + Juan García
- **8 partidos de fase de grupos** de diferentes grupos (A, B, C, D)
- **2 premios predefinidos** (MVP del Día, Campeón de Grupos)
- **Sistema de puntuación automático**
- **Banner publicitario** (personalizable por admin)

Todos los datos se guardan en memoria durante la sesión.

## 🛠️ Estructura de Archivos

```
project/
├── src/
│   ├── types/index.ts              # Interfaces TypeScript
│   ├── services/mockApi.ts          # Mock API simulada
│   ├── contexts/                    # Auth y Notification Context
│   ├── hooks/                       # Custom hooks
│   ├── components/                  # Componentes React
│   ├── pages/                       # Páginas principales
│   ├── utils/                       # Helpers
│   ├── theme.ts                     # Config MUI
│   ├── App.tsx                      # Componente raíz
│   └── main.tsx                     # Entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor Vite en puerto 5173

# Producción
npm run build        # Compila TypeScript y crea build con Vite
npm run preview      # Vista previa del build producción

# Validación
npm run lint         # Verifica tipos TypeScript
```

## 📱 Responsividad

La aplicación es completamente responsive:
- **Mobile:** Navegación inferior, layouts adaptados
- **Tablet:** Diseño intermedio
- **Desktop:** Vista completa con sidebar lateral

## 🎨 Tema y Colores

- **Color Primario:** Azul (#1976d2) - Alusivo a fútbol
- **Color Secundario:** Rojo (#f50057)
- **Fondos:** Blanco y gris claro
- **Iconos:** Emojis de banderas y medallas

## 🔄 Flujo Completo de Usuario

1. **Inicio:** Pantalla de login
2. **Registro:** Crear cuenta (opcional)
3. **Dashboard:** Ver grupos y partidos
4. **Ranking:** Ver posiciones en tiempo real
5. **Premios:** Recibir notificaciones cuando gana un premio
6. **Admin Panel** (solo admin): Gestionar usuarios, premios y resultados

## 📝 Validaciones

Todas las formas usan **Zod** para validación:
- Email válido
- DNI mínimo 7 caracteres
- Contraseña mínimo 3 caracteres
- Nombre mínimo 2 caracteres

## 🐛 Troubleshooting

### "Cannot find module..."
```bash
npm install
```

### Puerto 5173 en uso
```bash
npm run dev -- --port 5174
```

### Limpiar caché
```bash
rm -rf node_modules package-lock.json
npm install
```

### Errores TypeScript
```bash
npm run lint  # Ver errores
```

## 🌐 Tecnologías

- **React 18+** - UI
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Material-UI (MUI)** - Componentes
- **React Router** - Navegación
- **React Hook Form + Zod** - Formularios
- **Axios** - HTTP (preparado para API real)
- **Date-fns** - Fechas

## 📤 Despliegue (Próximamente)

Para desplegar en producción:

```bash
# Build
npm run build

# Resultado en carpeta 'dist'
# Subir contenido de 'dist' a tu servidor
```

Servicios recomendados para hosting:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 📞 Soporte

- Revisar la consola del navegador (F12) para errores
- Los datos mock se guardan en memoria (se resetean al recargar)
- Próximas versiones incluirán backend real con API

## 📋 Checklist de Prueba

- [ ] Login con admin@prode.com / admin123
- [ ] Registro con nuevo usuario
- [ ] Ver tabla de grupos
- [ ] Ver ranking/podio
- [ ] Admin: Dashboard de usuarios
- [ ] Admin: Crear premio
- [ ] Admin: Cargar banner
- [ ] Admin: Cargar resultado (antes de fecha límite)
- [ ] Logout desde menú

## 🎯 Próximas Mejoras

- [ ] Backend API real
- [ ] Base de datos persistente
- [ ] Sistema de pronósticos por usuario
- [ ] WebSocket para actualizaciones en tiempo real
- [ ] Mercado de apuestas
- [ ] Exportar reportes PDF
- [ ] Integración con sorteo oficial FIFA 2026

---

**¡Disfruta jugando PRODE MUNDIAL 2026! ⚽**
