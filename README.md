# PRODE MUNDIAL 2026 - Frontend React

Una aplicación moderna y completa para gestionar pronósticos de fútbol (PRODE) del Mundial 2026.

## 📦 Instalación y Ejecución

### Requisitos previos
- Node.js 18+ instalado
- npm o yarn

### Pasos de instalación

```bash
# 1. Navegar al directorio del proyecto
cd "D:\Dev-Work\PRODE_MUNDIAL"

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
npm run dev

# 4. Abrirá automáticamente en http://localhost:5173
```

## 🔐 Credenciales de Prueba

### Admin
- Email: `admin@prode.com`
- Contraseña: `admin123`

### Usuario Regular
Puedes registrarte con cualquier email/contraseña válida

## ✨ Características Principales

✅ **Autenticación y Registro** - Sistema completo con validación
✅ **Dashboard Admin** - Gestión de usuarios y premios
✅ **Vista de Grupos** - Seguimiento de partidos del mundial
✅ **Sistema de Puntuación** - Cálculo automático de puntos
✅ **Premios** - Asignación automática y manual
✅ **Ranking/Podio** - Top 3 por diferentes criterios
✅ **Banner Publicitario** - Carga de imágenes
✅ **Responsive Design** - Funciona en móvil y desktop
✅ **Notificaciones** - Snackbars para eventos importantes

## 🛠️ Tecnologías Utilizadas

- **React 18+** - Librería de UI
- **TypeScript** - Type safety
- **Vite** - Build tool rápido
- **Material-UI (MUI)** - Componentes UI
- **React Router DOM** - Navegación
- **React Hook Form + Zod** - Formularios y validaciones
- **Axios** - HTTP client
- **Date-fns** - Manejo de fechas
- **Context API** - Estado global

## 📁 Estructura de Carpetas

```
src/
├── components/
│   ├── common/         # Componentes reutilizables
│   ├── auth/          # Componentes de autenticación
│   └── admin/         # Componentes de admin
├── pages/             # Páginas principales
├── contexts/          # Context API
├── hooks/             # Custom hooks
├── services/          # API y mock
├── types/             # TypeScript interfaces
├── utils/             # Utilidades
├── theme.ts           # Configuración de MUI
└── App.tsx            # Componente raíz
```

## 🧪 Datos Mock

La aplicación usa datos mock para simular:
- 2 usuarios iniciales (1 admin + 1 usuario regular)
- 8 partidos de fase de grupos
- Sistema de puntuación automático
- Premios y asignaciones
- Banner publicitario

Todos los datos se guardan en memoria durante la sesión.

## 🎯 Flujo de Usuario

1. **Registro** - Crear nueva cuenta
2. **Login** - Acceder a la plataforma
3. **Ver Grupos** - Ver equipos y partidos
4. **Hacer Pronósticos** - Predecir resultados (próxima versión)
5. **Ver Puntuación** - Seguimiento de puntaje en tiempo real
6. **Premios** - Recibir notificaciones de premios ganados

### Flujo Admin

1. **Login como admin** (admin@prode.com)
2. **Dashboard Admin** - Gestionar usuarios y premios
3. **Cargar Resultados** - Ingresar resultados reales
4. **Crear Premios** - Definir nuevos premios
5. **Asignar Premios** - Manual o automáticamente

## 🚀 Próximas Mejoras

- [ ] Backend API real
- [ ] Integración con base de datos
- [ ] Sistema de pronósticos de usuarios
- [ ] Mercado de apuestas
- [ ] Notificaciones en tiempo real con WebSocket
- [ ] Exportar reportes

## 📝 Notas Técnicas

- **Validaciones**: Todas las formas usan Zod para validación de datos
- **Estado Global**: AuthContext para autenticación, NotificationContext para notificaciones
- **Mock API**: Simula asincronía con setTimeout
- **Responsive**: Usa Grid de MUI con breakpoints adaptativos
- **Tema**: Colores alusivos a fútbol/mundial

## 🐛 Troubleshooting

### "Cannot find module..."
```bash
npm install
```

### Puerto 5173 en uso
```bash
npm run dev -- --port 5174
```

### Problemas de compilación TypeScript
```bash
npm run lint
```

## 📄 Licencia

Este proyecto es de código abierto.

---

**Desarrollado con ❤️ para PRODE MUNDIAL 2026**
