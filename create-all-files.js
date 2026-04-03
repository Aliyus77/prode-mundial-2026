#!/usr/bin/env node

/**
 * Script para generar completamente la estructura del proyecto PRODE MUNDIAL
 * Uso: node create-all-files.js
 */

const fs = require('fs');
const path = require('path');

// Estructura completa de archivos
const files = {
  'src/types/index.ts': `// Tipos e interfaces principales de la aplicación

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  dni: string;
  password: string;
  role: UserRole;
  companyCode?: string;
  createdAt: Date;
  hasCompanyCode: boolean;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamFlag: string;
  awayTeamFlag: string;
  group: string;
  scheduledDate: Date;
  resultDeadline: Date;
  homeScore?: number;
  awayScore?: number;
  isFinished: boolean;
}

export interface UserPrediction {
  id: string;
  userId: string;
  matchId: string;
  predictedHomeScore: number;
  predictedAwayScore: number;
  points: number;
  isCorrect: boolean;
  createdAt: Date;
}

export interface Prize {
  id: string;
  name: string;
  description: string;
  criteria: 'most_points_date' | 'most_points_phase' | 'most_points_tournament';
  assignmentType: 'automatic' | 'manual';
  createdAt: Date;
}

export interface PrizeAssignment {
  id: string;
  prizeId: string;
  userId: string;
  assignmentDate: Date;
  criteria: string;
  phase?: string;
}

export interface Score {
  userId: string;
  userName: string;
  totalPoints: number;
  datePoints: number;
  phasePoints: number;
  position?: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface NotificationMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: Date;
}
`,

  'src/utils/dateHelpers.ts': `import { format, formatDistanceToNow, isPast, isFuture } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (date: Date) => {
  return format(new Date(date), 'dd/MM/yyyy', { locale: es });
};

export const formatDateTime = (date: Date) => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: es });
};

export const formatTimeDistance = (date: Date) => {
  return formatDistanceToNow(new Date(date), { locale: es, addSuffix: true });
};

export const isMatchPassed = (date: Date): boolean => {
  return isPast(new Date(date));
};

export const isMatchFuture = (date: Date): boolean => {
  return isFuture(new Date(date));
};

export const canLoadResult = (deadlineDate: Date): boolean => {
  return isFuture(new Date(deadlineDate));
};
`,

  'src/utils/scoringHelpers.ts': `export const calculatePoints = (
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number
): number => {
  if (predictedHome === actualHome && predictedAway === actualAway) {
    return 3;
  }

  const predictedWinner = 
    predictedHome > predictedAway ? 'home' :
    predictedHome < predictedAway ? 'away' : 'draw';

  const actualWinner =
    actualHome > actualAway ? 'home' :
    actualHome < actualAway ? 'away' : 'draw';

  if (predictedWinner === actualWinner) {
    return 1;
  }

  return 0;
};

export const getRankingPosition = (points: number, allPoints: number[]): number => {
  const sorted = [...allPoints].sort((a, b) => b - a);
  return sorted.findIndex(p => p === points) + 1;
};
`,

  'src/utils/validators.ts': `import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(3, 'Contraseña mínimo 3 caracteres'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nombre mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  dni: z.string().min(7, 'DNI inválido'),
  password: z.string().min(3, 'Contraseña mínimo 3 caracteres'),
  companyCode: z.string().optional(),
});

export const prizeSchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  description: z.string().min(5, 'Descripción mínimo 5 caracteres'),
  criteria: z.enum(['most_points_date', 'most_points_phase', 'most_points_tournament']),
  assignmentType: z.enum(['automatic', 'manual']),
});

export const resultSchema = z.object({
  homeScore: z.number().min(0).max(20),
  awayScore: z.number().min(0).max(20),
});
`,

  'src/theme.ts': `import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#f50057',
      light: '#f73378',
      dark: '#c51162',
    },
    success: {
      main: '#4caf50',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});
`,

  'src/contexts/AuthContext.tsx': `import React, { createContext, useState, useCallback, useEffect } from 'react';
import { User } from '../types';
import { mockApi } from '../services/mockApi';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Recuperar sesión al cargar
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user, token } = await mockApi.login(email, password);
      setUser(user);
      setToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error en login';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user, token } = await mockApi.register(userData);
      setUser(user);
      setToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error en registro';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
`,

  'src/contexts/NotificationContext.tsx': `import React, { createContext, useState, useCallback } from 'react';
import { NotificationMessage } from '../types';

interface NotificationContextType {
  notifications: NotificationMessage[];
  addNotification: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeNotification: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

  const addNotification = useCallback((
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info'
  ) => {
    const id = Date.now().toString();
    const notification: NotificationMessage = {
      id,
      type,
      message,
      timestamp: new Date(),
    };
    setNotifications(prev => [...prev, notification]);

    // Eliminar automáticamente después de 4 segundos
    setTimeout(() => {
      removeNotification(id);
    }, 4000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
`,

  'src/hooks/useAuth.ts': `import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
`,

  'src/hooks/useNotification.ts': `import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe usarse dentro de NotificationProvider');
  }
  return context;
};
`,

  'src/hooks/useMatches.ts': `import { useState, useEffect } from 'react';
import { Match } from '../types';
import { mockApi } from '../services/mockApi';

export const useMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await mockApi.getMatches();
        setMatches(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return { matches, isLoading, error };
};
`,

  'src/components/common/Navbar.tsx': `import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const navItems = user?.role === 'admin'
    ? [
        { label: 'Grupos', path: '/' },
        { label: 'Podio', path: '/podium' },
        { label: 'Admin', path: '/admin' },
      ]
    : [
        { label: 'Grupos', path: '/' },
        { label: 'Podio', path: '/podium' },
      ];

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: { xs: '1rem', sm: '1.25rem' },
            }}
            onClick={() => navigate('/')}
          >
            ⚽ PRODE 2026
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navItems.map(item => (
                <Button
                  key={item.path}
                  color="inherit"
                  component={RouterLink}
                  to={item.path}
                  sx={{ '&:hover': { opacity: 0.8 } }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isMobile && (
                <IconButton
                  color="inherit"
                  onClick={() => setDrawerOpen(true)}
                  sx={{ mr: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Button color="inherit" onClick={handleMenuOpen}>
                {user.name}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem disabled>{user.email}</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
              <Button color="inherit" component={RouterLink} to="/register" variant="outlined">
                Registro
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List sx={{ width: 250 }}>
          {navItems.map(item => (
            <ListItem
              key={item.path}
              component={RouterLink}
              to={item.path}
              onClick={() => setDrawerOpen(false)}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};
`,

  'src/components/common/NotificationSnackbar.tsx': `import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useNotification } from '../../hooks/useNotification';

export const NotificationSnackbar: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={4000}
          onClose={() => removeNotification(notification.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => removeNotification(notification.id)}
            severity={notification.type}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};
`,

  'src/components/common/Banner.tsx': `import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { mockApi } from '../../services/mockApi';

export const Banner: React.FC = () => {
  const [banner, setBanner] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBanner = async () => {
      try {
        const url = await mockApi.getBanner();
        setBanner(url);
      } finally {
        setIsLoading(false);
      }
    };

    loadBanner();
  }, []);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!banner) {
    return (
      <Box
        sx={{
          width: '100%',
          height: { xs: 150, sm: 250 },
          backgroundColor: '#e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 1,
          my: 2,
        }}
      >
        Sin banner
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={banner}
      sx={{
        width: '100%',
        height: { xs: 150, sm: 250 },
        objectFit: 'cover',
        borderRadius: 1,
        my: 2,
      }}
    />
  );
};
`,

  'src/components/auth/LoginForm.tsx': `import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { loginSchema } from '../../utils/validators';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

type LoginFormData = {
  email: string;
  password: string;
};

export const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err) {
      // El error se maneja en el contexto
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        {...register('email')}
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        {...register('password')}
        label="Contraseña"
        type="password"
        fullWidth
        margin="normal"
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Login'}
      </Button>
    </Box>
  );
};
`,

  'src/components/auth/RegisterForm.tsx': `import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { registerSchema } from '../../utils/validators';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

type RegisterFormData = {
  name: string;
  email: string;
  dni: string;
  password: string;
  companyCode?: string;
};

export const RegisterForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const { register: registerUser, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      navigate('/');
    } catch (err) {
      // El error se maneja en el contexto
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        {...register('name')}
        label="Nombre"
        fullWidth
        margin="normal"
        error={!!errors.name}
        helperText={errors.name?.message}
      />

      <TextField
        {...register('email')}
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        {...register('dni')}
        label="DNI"
        fullWidth
        margin="normal"
        error={!!errors.dni}
        helperText={errors.dni?.message}
      />

      <TextField
        {...register('password')}
        label="Contraseña"
        type="password"
        fullWidth
        margin="normal"
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <TextField
        {...register('companyCode')}
        label="Código de Empresa (Opcional)"
        fullWidth
        margin="normal"
        error={!!errors.companyCode}
        helperText={errors.companyCode?.message}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Registrarse'}
      </Button>
    </Box>
  );
};
`,

  'src/components/auth/ProtectedRoute.tsx': `import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
`,

  'src/components/admin/UsersDashboard.tsx': `import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Grid,
} from '@mui/material';
import { mockApi } from '../../services/mockApi';
import { User } from '../../types';

export const UsersDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    dni: '',
    hasCompanyCode: false,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await mockApi.getUsers();
      setUsers(data);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const nameMatch = user.name.toLowerCase().includes(filters.name.toLowerCase());
    const dniMatch = user.dni.includes(filters.dni);
    const companyMatch = !filters.hasCompanyCode || user.hasCompanyCode;
    return nameMatch && dniMatch && companyMatch;
  });

  return (
    <Card>
      <CardHeader title="Dashboard de Usuarios" />
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Filtrar por Nombre"
                fullWidth
                size="small"
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Filtrar por DNI"
                fullWidth
                size="small"
                value={filters.dni}
                onChange={(e) => setFilters({ ...filters, dni: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.hasCompanyCode}
                    onChange={(e) => setFilters({ ...filters, hasCompanyCode: e.target.checked })}
                  />
                }
                label="Con Código de Empresa"
              />
            </Grid>
          </Grid>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>DNI</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Código Empresa</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.dni}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          backgroundColor: user.role === 'admin' ? '#fff3e0' : '#e8f5e9',
                          fontSize: '0.875rem',
                        }}
                      >
                        {user.role === 'admin' ? '👑 Admin' : '👤 Usuario'}
                      </Box>
                    </TableCell>
                    <TableCell>{user.companyCode ? '✅ Sí' : '❌ No'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};
`,

  'src/components/admin/PrizesForm.tsx': `import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextField,
  Button,
  Box,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import { prizeSchema } from '../../utils/validators';
import { mockApi } from '../../services/mockApi';
import { useNotification } from '../../hooks/useNotification';

type PrizeFormData = {
  name: string;
  description: string;
  criteria: string;
  assignmentType: string;
};

export const PrizesForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PrizeFormData>({
    resolver: zodResolver(prizeSchema),
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const { addNotification } = useNotification();

  const onSubmit = async (data: PrizeFormData) => {
    setIsLoading(true);
    try {
      await mockApi.createPrize(data);
      addNotification('Premio creado exitosamente', 'success');
      reset();
    } catch (err) {
      addNotification(err instanceof Error ? err.message : 'Error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Crear Nuevo Premio" />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                {...register('name')}
                label="Nombre del Premio"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                {...register('description')}
                label="Descripción"
                fullWidth
                multiline
                rows={3}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.criteria}>
                <InputLabel>Criterio de Asignación</InputLabel>
                <Select
                  {...register('criteria')}
                  label="Criterio de Asignación"
                  defaultValue=""
                >
                  <MenuItem value="most_points_date">Más puntos de la fecha</MenuItem>
                  <MenuItem value="most_points_phase">Más puntos de la fase</MenuItem>
                  <MenuItem value="most_points_tournament">Más puntos del torneo</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.assignmentType}>
                <InputLabel>Tipo de Asignación</InputLabel>
                <Select
                  {...register('assignmentType')}
                  label="Tipo de Asignación"
                  defaultValue=""
                >
                  <MenuItem value="automatic">Automática</MenuItem>
                  <MenuItem value="manual">Manual</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Crear Premio'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};
`,

  'src/components/admin/PrizeHistory.tsx': `import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
} from '@mui/material';
import { mockApi } from '../../services/mockApi';
import { PrizeAssignment, Prize, User } from '../../types';
import { formatDateTime } from '../../utils/dateHelpers';

export const PrizeHistory: React.FC = () => {
  const [assignments, setAssignments] = useState<PrizeAssignment[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [assignmentData, prizeData, userData] = await Promise.all([
        mockApi.getPrizeAssignments(),
        mockApi.getPrizes(),
        mockApi.getUsers(),
      ]);
      setAssignments(assignmentData);
      setPrizes(prizeData);
      setUsers(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const getPrizeName = (prizeId: string) => {
    return prizes.find(p => p.id === prizeId)?.name || 'Desconocido';
  };

  const getUserName = (userId: string) => {
    return users.find(u => u.id === userId)?.name || 'Desconocido';
  };

  return (
    <Card>
      <CardHeader title="Historial de Premios Entregados" />
      <CardContent>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : assignments.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>Sin premios asignados aún</Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Premio</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Criterio</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map(assignment => (
                  <TableRow key={assignment.id} hover>
                    <TableCell>{formatDateTime(assignment.assignmentDate)}</TableCell>
                    <TableCell>{getPrizeName(assignment.prizeId)}</TableCell>
                    <TableCell>{getUserName(assignment.userId)}</TableCell>
                    <TableCell>{assignment.criteria}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};
`,

  'src/components/admin/ImageUpload.tsx': `import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { mockApi } from '../../services/mockApi';
import { useNotification } from '../../hooks/useNotification';

export const ImageUpload: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { addNotification } = useNotification();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        await mockApi.uploadBanner(base64);
        addNotification('Banner subido exitosamente', 'success');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      addNotification(err instanceof Error ? err.message : 'Error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Cargar Banner Publicitario" />
      <CardContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          Carga una imagen para mostrar en la vista general de usuarios
        </Alert>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <label htmlFor="image-upload" style={{ width: '100%' }}>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <Button
              component="span"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Seleccionar Imagen'}
            </Button>
          </label>
        </Box>
      </CardContent>
    </Card>
  );
};
`,

  'src/components/admin/ResultsForm.tsx': `import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useMatches } from '../../hooks/useMatches';
import { mockApi } from '../../services/mockApi';
import { useNotification } from '../../hooks/useNotification';
import { formatDateTime, canLoadResult } from '../../utils/dateHelpers';

export const ResultsForm: React.FC = () => {
  const { matches } = useMatches();
  const { addNotification } = useNotification();
  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedMatch = matches.find(m => m.id === selectedMatchId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatchId || homeScore === '' || awayScore === '') return;

    setIsLoading(true);
    try {
      await mockApi.loadMatchResult(
        selectedMatchId,
        parseInt(homeScore),
        parseInt(awayScore)
      );
      addNotification('Resultado cargado exitosamente', 'success');
      setSelectedMatchId('');
      setHomeScore('');
      setAwayScore('');
    } catch (err) {
      addNotification(err instanceof Error ? err.message : 'Error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const openMatches = matches.filter(m => !m.isFinished);

  return (
    <Card>
      <CardHeader title="Cargar Resultados de Partidos" />
      <CardContent>
        {openMatches.length === 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Todos los partidos ya tienen resultado cargado.
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Seleccionar Partido</InputLabel>
                <Select
                  value={selectedMatchId}
                  onChange={(e) => setSelectedMatchId(e.target.value)}
                  label="Seleccionar Partido"
                >
                  {openMatches.map(match => (
                    <MenuItem key={match.id} value={match.id}>
                      {match.homeTeam} vs {match.awayTeam} ({match.group})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {selectedMatch && (
              <>
                <Grid item xs={12}>
                  <Alert severity="warning">
                    Límite para cargar: {formatDateTime(selectedMatch.resultDeadline)}
                    {!canLoadResult(selectedMatch.resultDeadline) && (
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        ❌ No se puede cargar después del límite
                      </Typography>
                    )}
                  </Alert>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label={selectedMatch.homeTeam + ' (Local)'}
                    type="number"
                    fullWidth
                    value={homeScore}
                    onChange={(e) => setHomeScore(e.target.value)}
                    inputProps={{ min: 0, max: 20 }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label={selectedMatch.awayTeam + ' (Visitante)'}
                    type="number"
                    fullWidth
                    value={awayScore}
                    onChange={(e) => setAwayScore(e.target.value)}
                    inputProps={{ min: 0, max: 20 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={
                      isLoading ||
                      !canLoadResult(selectedMatch.resultDeadline) ||
                      homeScore === '' ||
                      awayScore === ''
                    }
                  >
                    {isLoading ? <CircularProgress size={24} /> : 'Cargar Resultado'}
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};
`,

  'src/pages/LoginPage.tsx': `import React from 'react';
import { Container, Paper, Box, Typography } from '@mui/material';
import { LoginForm } from '../components/auth/LoginForm';
import { Link as RouterLink } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
          ⚽ PRODE MUNDIAL 2026
        </Typography>
        <LoginForm />
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            ¿No tienes cuenta?{' '}
            <RouterLink to="/register" style={{ color: '#1976d2', textDecoration: 'none' }}>
              Regístrate aquí
            </RouterLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};
`,

  'src/pages/RegisterPage.tsx': `import React from 'react';
import { Container, Paper, Box, Typography } from '@mui/material';
import { RegisterForm } from '../components/auth/RegisterForm';
import { Link as RouterLink } from 'react-router-dom';

export const RegisterPage: React.FC = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
          Registro - PRODE 2026
        </Typography>
        <RegisterForm />
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            ¿Ya tienes cuenta?{' '}
            <RouterLink to="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
              Inicia sesión
            </RouterLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};
`,

  'src/pages/GroupsPage.tsx': `import React from 'react';
import { Container, Box, Grid, Card, CardHeader, CardContent, Typography, CircularProgress, Chip } from '@mui/material';
import { useMatches } from '../hooks/useMatches';
import { Banner } from '../components/common/Banner';
import { formatDateTime } from '../utils/dateHelpers';

export const GroupsPage: React.FC = () => {
  const { matches, isLoading } = useMatches();

  const groupedMatches = matches.reduce((acc, match) => {
    if (!acc[match.group]) acc[match.group] = [];
    acc[match.group].push(match);
    return acc;
  }, {} as Record<string, typeof matches>);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Banner />

      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Fase de Grupos - Mundial 2026
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {Object.entries(groupedMatches).map(([group, groupMatches]) => (
            <Grid item xs={12} md={6} key={group}>
              <Card>
                <CardHeader title={`Grupo ${group}`} />
                <CardContent>
                  {groupMatches.map(match => (
                    <Box
                      key={match.id}
                      sx={{
                        p: 2,
                        mb: 2,
                        border: '1px solid #eee',
                        borderRadius: 1,
                        '&:last-child': { mb: 0 },
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {formatDateTime(match.scheduledDate)}
                        </Typography>
                        {match.isFinished && <Chip label="Finalizado" color="success" size="small" />}
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ textAlign: 'center', flex: 1 }}>
                          <Typography variant="body1">{match.homeTeamFlag} {match.homeTeam}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center', mx: 2 }}>
                          {match.isFinished ? (
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                              {match.homeScore} - {match.awayScore}
                            </Typography>
                          ) : (
                            <Typography variant="h6" sx={{ color: '#999' }}>-</Typography>
                          )}
                        </Box>
                        <Box sx={{ textAlign: 'center', flex: 1 }}>
                          <Typography variant="body1">{match.awayTeam} {match.awayTeamFlag}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};
`,

  'src/pages/PodiumPage.tsx': `import React, { useEffect, useState } from 'react';
import { Container, Box, Grid, Card, CardHeader, CardContent, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { mockApi } from '../services/mockApi';
import { Score } from '../types';

export const PodiumPage: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    try {
      const data = await mockApi.getScores();
      setScores(data.sort((a, b) => b.totalPoints - a.totalPoints));
    } finally {
      setIsLoading(false);
    }
  };

  const topThree = scores.slice(0, 3);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 4, flexWrap: 'wrap' }}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            topThree.map((score, index) => (
              <Card
                key={score.userId}
                sx={{
                  flex: 1,
                  minWidth: 150,
                  textAlign: 'center',
                  backgroundColor: index === 0 ? '#fff9c4' : index === 1 ? '#e8e8e8' : '#ffcc80',
                  transform: index === 0 ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                <CardContent>
                  <Box sx={{ fontSize: '2.5rem', mb: 1 }}>{medals[index]}</Box>
                  <Box sx={{ fontSize: '1.25rem', mb: 1 }}>{score.position}°</Box>
                  <Box sx={{ fontWeight: 'bold', mb: 1 }}>{score.userName}</Box>
                  <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1976d2' }}>
                    {score.totalPoints} pts
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Box>

      <Card>
        <CardHeader title="Ranking Completo" />
        <CardContent>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell align="center">Posición</TableCell>
                    <TableCell>Usuario</TableCell>
                    <TableCell align="right">Puntos Totales</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {scores.map((score, index) => (
                    <TableRow key={score.userId} hover sx={{ backgroundColor: index < 3 ? '#f0f7ff' : 'transparent' }}>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                        {index < 3 ? medals[index] : score.position}
                      </TableCell>
                      <TableCell>{score.userName}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {score.totalPoints}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};
`,

  'src/pages/AdminDashboard.tsx': `import React from 'react';
import { Container, Grid, Box, Typography, Tabs, Tab } from '@mui/material';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { UsersDashboard } from '../components/admin/UsersDashboard';
import { PrizesForm } from '../components/admin/PrizesForm';
import { PrizeHistory } from '../components/admin/PrizeHistory';
import { ImageUpload } from '../components/admin/ImageUpload';
import { ResultsForm } from '../components/admin/ResultsForm';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const AdminDashboard: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0);

  return (
    <ProtectedRoute adminOnly>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          Panel de Administración
        </Typography>

        <Tabs value={tabValue} onChange={(_, value) => setTabValue(value)} sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tab label="Usuarios" />
          <Tab label="Premios" />
          <Tab label="Historial" />
          <Tab label="Banner" />
          <Tab label="Resultados" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <UsersDashboard />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <PrizesForm />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <PrizeHistory />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <ImageUpload />
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <ResultsForm />
        </TabPanel>
      </Container>
    </ProtectedRoute>
  );
};
`,

  'src/pages/NotFoundPage.tsx': `import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h1" sx={{ mb: 2 }}>404</Typography>
      <Typography variant="h4" sx={{ mb: 4 }}>Página no encontrada</Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Volver al inicio
      </Button>
    </Container>
  );
};
`,

  'src/App.tsx': `import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Navbar } from './components/common/Navbar';
import { NotificationSnackbar } from './components/common/NotificationSnackbar';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { GroupsPage } from './pages/GroupsPage';
import { PodiumPage } from './pages/PodiumPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Navbar />
            <NotificationSnackbar />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <GroupsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/podium"
                element={
                  <ProtectedRoute>
                    <PodiumPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
`,

  'src/main.tsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`,

  'src/index.css': `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  width: 100%;
  height: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
`,
};

// Crear archivos
function createFiles() {
  const createdFiles = [];
  const errors = [];

  Object.entries(files).forEach(([filePath, content]) => {
    try {
      const dir = filePath.substring(0, filePath.lastIndexOf('/'));
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, content);
      createdFiles.push(filePath);
      console.log(`✅ ${filePath}`);
    } catch (error) {
      errors.push(`${filePath}: ${error}`);
      console.error(`❌ ${filePath}`);
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log(\`✅ Archivos creados: \${createdFiles.length}\`);
  if (errors.length > 0) {
    console.log(\`❌ Errores: \${errors.length}\`);
    errors.forEach(e => console.log(\`  - \${e}\`));
  }
  console.log('='.repeat(60));
  console.log('\n📦 Próximos pasos:');
  console.log('1. npm install');
  console.log('2. npm run dev');
  console.log('\n🔐 Credenciales de prueba:');
  console.log('   Email: admin@prode.com');
  console.log('   Contraseña: admin123');
}

// Ejecutar
createFiles();
`,
  'src/services/mockApi.ts': `import { User, Match, Prize, PrizeAssignment, Score, UserPrediction } from '../types';

// Datos en memoria
let users: User[] = [];
let matches: Match[] = [];
let prizes: Prize[] = [];
let prizeAssignments: PrizeAssignment[] = [];
let predictions: UserPrediction[] = [];
let bannerImage: string | null = null;

// Inicialización de datos mock
function initializeMockData() {
  const now = new Date();

  // Usuarios iniciales
  users = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@prode.com',
      dni: '12345678',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      hasCompanyCode: true,
      companyCode: 'ADMIN001',
    },
    {
      id: '2',
      name: 'Juan García',
      email: 'juan@example.com',
      dni: '87654321',
      password: 'pass123',
      role: 'user',
      createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
      hasCompanyCode: false,
    },
  ];

  // Partidos de fase de grupos (8 partidos)
  matches = [
    {
      id: '1',
      homeTeam: 'Argentina',
      awayTeam: 'Paraguay',
      homeTeamFlag: '🇦🇷',
      awayTeamFlag: '🇵🇾',
      group: 'A',
      scheduledDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      resultDeadline: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 - 60 * 60 * 1000),
      isFinished: false,
    },
    {
      id: '2',
      homeTeam: 'Uruguay',
      awayTeam: 'Marruecos',
      homeTeamFlag: '🇺🇾',
      awayTeamFlag: '🇲🇦',
      group: 'A',
      scheduledDate: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
      resultDeadline: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000 - 60 * 60 * 1000),
      isFinished: false,
    },
    {
      id: '3',
      homeTeam: 'Brasil',
      awayTeam: 'México',
      homeTeamFlag: '🇧🇷',
      awayTeamFlag: '🇲🇽',
      group: 'B',
      scheduledDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      resultDeadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 - 60 * 60 * 1000),
      isFinished: false,
    },
    {
      id: '4',
      homeTeam: 'Francia',
      awayTeam: 'Canadá',
      homeTeamFlag: '🇫🇷',
      awayTeamFlag: '🇨🇦',
      group: 'B',
      scheduledDate: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
      resultDeadline: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000 - 60 * 60 * 1000),
      isFinished: false,
    },
    {
      id: '5',
      homeTeam: 'Alemania',
      awayTeam: 'Japón',
      homeTeamFlag: '🇩🇪',
      awayTeamFlag: '🇯🇵',
      group: 'C',
      scheduledDate: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000),
      resultDeadline: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000 - 60 * 60 * 1000),
      isFinished: false,
    },
    {
      id: '6',
      homeTeam: 'España',
      awayTeam: 'Costa Rica',
      homeTeamFlag: '🇪🇸',
      awayTeamFlag: '🇨🇷',
      group: 'C',
      scheduledDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      resultDeadline: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000 - 60 * 60 * 1000),
      isFinished: false,
    },
    {
      id: '7',
      homeTeam: 'Inglaterra',
      awayTeam: 'Serbia',
      homeTeamFlag: '🇬🇧',
      awayTeamFlag: '🇷🇸',
      group: 'D',
      scheduledDate: new Date(now.getTime() + 11 * 24 * 60 * 60 * 1000),
      resultDeadline: new Date(now.getTime() + 11 * 24 * 60 * 60 * 1000 - 60 * 60 * 1000),
      isFinished: false,
    },
    {
      id: '8',
      homeTeam: 'Países Bajos',
      awayTeam: 'Italia',
      homeTeamFlag: '🇳🇱',
      awayTeamFlag: '🇮🇹',
      group: 'D',
      scheduledDate: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
      resultDeadline: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000 - 60 * 60 * 1000),
      isFinished: false,
    },
  ];

  // Premios iniciales
  prizes = [
    {
      id: '1',
      name: 'MVP del Día',
      description: 'Mejor puntuador del día',
      criteria: 'most_points_date',
      assignmentType: 'automatic',
      createdAt: now,
    },
    {
      id: '2',
      name: 'Campeón de Grupos',
      description: 'Mejor puntuador en fase de grupos',
      criteria: 'most_points_phase',
      assignmentType: 'automatic',
      createdAt: now,
    },
  ];
}

// Inicializar datos si no existen
if (users.length === 0) {
  initializeMockData();
}

export const mockApi = {
  login: async (email: string, password: string) => {
    return new Promise<{ user: User; token: string }>((resolve, reject) => {
      setTimeout(() => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          resolve({
            user: { ...user, password: '' },
            token: 'mock-token-' + user.id,
          });
        } else {
          reject(new Error('Credenciales inválidas'));
        }
      }, 800);
    });
  },

  register: async (userData: {
    name: string;
    email: string;
    dni: string;
    password: string;
    companyCode?: string;
  }) => {
    return new Promise<{ user: User; token: string }>((resolve, reject) => {
      setTimeout(() => {
        if (users.find(u => u.email === userData.email)) {
          reject(new Error('El email ya está registrado'));
          return;
        }

        const newUser: User = {
          id: Date.now().toString(),
          ...userData,
          role: 'user',
          createdAt: new Date(),
          hasCompanyCode: !!userData.companyCode,
        };

        users.push(newUser);

        resolve({
          user: { ...newUser, password: '' },
          token: 'mock-token-' + newUser.id,
        });
      }, 800);
    });
  },

  getUsers: async () => {
    return new Promise<User[]>((resolve) => {
      setTimeout(() => {
        resolve(users.map(u => ({ ...u, password: '' })));
      }, 500);
    });
  },

  getMatches: async () => {
    return new Promise<Match[]>((resolve) => {
      setTimeout(() => {
        resolve([...matches]);
      }, 300);
    });
  },

  loadMatchResult: async (matchId: string, homeScore: number, awayScore: number) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const match = matches.find(m => m.id === matchId);
        if (!match) {
          reject(new Error('Partido no encontrado'));
          return;
        }

        if (new Date() > new Date(match.resultDeadline)) {
          reject(new Error('No se puede cargar el resultado después del límite de tiempo'));
          return;
        }

        if (match.isFinished) {
          reject(new Error('El resultado ya fue cargado'));
          return;
        }

        match.homeScore = homeScore;
        match.awayScore = awayScore;
        match.isFinished = true;

        resolve();
      }, 600);
    });
  },

  getPrizes: async () => {
    return new Promise<Prize[]>((resolve) => {
      setTimeout(() => {
        resolve([...prizes]);
      }, 300);
    });
  },

  createPrize: async (prizeData: {
    name: string;
    description: string;
    criteria: string;
    assignmentType: string;
  }) => {
    return new Promise<Prize>((resolve) => {
      setTimeout(() => {
        const newPrize: Prize = {
          id: Date.now().toString(),
          name: prizeData.name,
          description: prizeData.description,
          criteria: prizeData.criteria as any,
          assignmentType: prizeData.assignmentType as any,
          createdAt: new Date(),
        };
        prizes.push(newPrize);
        resolve(newPrize);
      }, 500);
    });
  },

  getPrizeAssignments: async () => {
    return new Promise<PrizeAssignment[]>((resolve) => {
      setTimeout(() => {
        resolve([...prizeAssignments]);
      }, 300);
    });
  },

  assignPrize: async (prizeId: string, userId: string, criteria: string) => {
    return new Promise<PrizeAssignment>((resolve, reject) => {
      setTimeout(() => {
        if (!prizes.find(p => p.id === prizeId)) {
          reject(new Error('Premio no encontrado'));
          return;
        }

        const assignment: PrizeAssignment = {
          id: Date.now().toString(),
          prizeId,
          userId,
          assignmentDate: new Date(),
          criteria,
        };

        prizeAssignments.push(assignment);
        resolve(assignment);
      }, 500);
    });
  },

  uploadBanner: async (imageData: string) => {
    return new Promise<{ url: string }>((resolve) => {
      setTimeout(() => {
        bannerImage = imageData;
        resolve({ url: imageData });
      }, 300);
    });
  },

  getBanner: async () => {
    return new Promise<string | null>((resolve) => {
      setTimeout(() => {
        resolve(bannerImage);
      }, 200);
    });
  },

  getScores: async () => {
    return new Promise<Score[]>((resolve) => {
      setTimeout(() => {
        const scores = users.map(user => ({
          userId: user.id,
          userName: user.name,
          totalPoints: Math.floor(Math.random() * 100),
          datePoints: 0,
          phasePoints: 0,
        }));

        scores.sort((a, b) => b.totalPoints - a.totalPoints);
        scores.forEach((score, index) => {
          score.position = index + 1;
        });

        resolve(scores);
      }, 400);
    });
  },

  addPrediction: async (userId: string, matchId: string, homeScore: number, awayScore: number) => {
    return new Promise<UserPrediction>((resolve) => {
      setTimeout(() => {
        const prediction: UserPrediction = {
          id: Date.now().toString(),
          userId,
          matchId,
          predictedHomeScore: homeScore,
          predictedAwayScore: awayScore,
          points: 0,
          isCorrect: false,
          createdAt: new Date(),
        };
        predictions.push(prediction);
        resolve(prediction);
      }, 300);
    });
  },
};
`,
};

// Crear archivos
console.log('🚀 Generando archivos del proyecto PRODE MUNDIAL 2026...\n');

Object.entries(files).forEach(([filePath, content]) => {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log(\`✅ \${filePath}\`);
});

console.log('\n' + '='.repeat(70));
console.log('✅ PROYECTO GENERADO EXITOSAMENTE');
console.log('='.repeat(70));
console.log('\n📦 PRÓXIMOS PASOS:');
console.log('   1. npm install');
console.log('   2. npm run dev');
console.log('\n🔐 CREDENCIALES DE PRUEBA:');
console.log('   Email: admin@prode.com');
console.log('   Contraseña: admin123');
console.log('\n📱 La app se abrirá en http://localhost:5173');
console.log('='.repeat(70) + '\n');
`,
};

// Crear archivo main de configuración
console.log('Configuración lista');
