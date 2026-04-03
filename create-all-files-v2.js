#!/usr/bin/env node

/**
 * Script para generar completamente la estructura del proyecto PRODE MUNDIAL
 * Uso: node create-all-files-v2.js
 * 
 * VERSIÓN MEJORADA: Archivos más pequeños y sin problemas de sintaxis
 */

const fs = require('fs');
const path = require('path');

// Crear directorios
const dirs = [
  'src/types',
  'src/services',
  'src/utils',
  'src/contexts',
  'src/hooks',
  'src/components/common',
  'src/components/auth',
  'src/components/admin',
  'src/pages'
];

console.log('🚀 Generando estructura del proyecto PRODE MUNDIAL...\n');

dirs.forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
  console.log(\`✓ Directorio: \${dir}\`);
});

// Archivos
const files = {
  'src/types/index.ts': \`export type UserRole = 'admin' | 'user';

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

export interface NotificationMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: Date;
}\`,

  'src/utils/dateHelpers.ts': \`import { format, formatDistanceToNow, isPast, isFuture } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (date: Date) => format(new Date(date), 'dd/MM/yyyy', { locale: es });
export const formatDateTime = (date: Date) => format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: es });
export const formatTimeDistance = (date: Date) => formatDistanceToNow(new Date(date), { locale: es, addSuffix: true });
export const isMatchPassed = (date: Date): boolean => isPast(new Date(date));
export const isMatchFuture = (date: Date): boolean => isFuture(new Date(date));
export const canLoadResult = (deadlineDate: Date): boolean => isFuture(new Date(deadlineDate));\`,

  'src/utils/scoringHelpers.ts': \`export const calculatePoints = (
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number
): number => {
  if (predictedHome === actualHome && predictedAway === actualAway) return 3;
  
  const predictedWinner = 
    predictedHome > predictedAway ? 'home' :
    predictedHome < predictedAway ? 'away' : 'draw';
  
  const actualWinner =
    actualHome > actualAway ? 'home' :
    actualHome < actualAway ? 'away' : 'draw';
  
  return predictedWinner === actualWinner ? 1 : 0;
};\`,

  'src/utils/validators.ts': \`import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(3, 'Mínimo 3 caracteres'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  dni: z.string().min(7, 'DNI inválido'),
  password: z.string().min(3, 'Mínimo 3 caracteres'),
  companyCode: z.string().optional(),
});

export const prizeSchema = z.object({
  name: z.string().min(2, 'Requerido'),
  description: z.string().min(5, 'Mínimo 5 caracteres'),
  criteria: z.enum(['most_points_date', 'most_points_phase', 'most_points_tournament']),
  assignmentType: z.enum(['automatic', 'manual']),
});\`,

  'src/theme.ts': \`import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#f50057' },
    success: { main: '#4caf50' },
    error: { main: '#f44336' },
  },
  typography: { fontFamily: 'Roboto, sans-serif' },
});\`,

  'src/contexts/AuthContext.tsx': \`import React, { createContext, useState, useCallback, useEffect } from 'react';
import { User } from '../types';

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
      // Mock login
      const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);
      if (!user) throw new Error('Credenciales inválidas');
      
      setUser(user);
      setToken('mock-token-' + user.id);
      localStorage.setItem('token', 'mock-token-' + user.id);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error';
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
      const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      if (users.find((u: any) => u.email === userData.email)) {
        throw new Error('Email ya registrado');
      }
      
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        role: 'user',
        createdAt: new Date(),
        hasCompanyCode: !!userData.companyCode,
      };
      
      users.push(newUser);
      localStorage.setItem('mockUsers', JSON.stringify(users));
      
      setUser(newUser);
      setToken('mock-token-' + newUser.id);
      localStorage.setItem('token', 'mock-token-' + newUser.id);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error';
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
};\`,

  'src/contexts/NotificationContext.tsx': \`import React, { createContext, useState, useCallback } from 'react';
import { NotificationMessage } from '../types';

interface NotificationContextType {
  notifications: NotificationMessage[];
  addNotification: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeNotification: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

  const addNotification = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message, timestamp: new Date() }]);
    setTimeout(() => removeNotification(id), 4000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};\`,

  'src/hooks/useAuth.ts': \`import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};\`,

  'src/hooks/useNotification.ts': \`import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification debe usarse dentro de NotificationProvider');
  return context;
};\`,

  'src/hooks/useMatches.ts': \`import { useState, useEffect } from 'react';
import { Match } from '../types';

export const useMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    const mockMatches: Match[] = [
      { id: '1', homeTeam: 'Argentina', awayTeam: 'Paraguay', homeTeamFlag: '🇦🇷', awayTeamFlag: '🇵🇾', group: 'A', scheduledDate: new Date(now.getTime() + 5 * 86400000), resultDeadline: new Date(now.getTime() + 5 * 86400000 - 3600000), isFinished: false },
      { id: '2', homeTeam: 'Uruguay', awayTeam: 'Marruecos', homeTeamFlag: '🇺🇾', awayTeamFlag: '🇲🇦', group: 'A', scheduledDate: new Date(now.getTime() + 6 * 86400000), resultDeadline: new Date(now.getTime() + 6 * 86400000 - 3600000), isFinished: false },
      { id: '3', homeTeam: 'Brasil', awayTeam: 'México', homeTeamFlag: '🇧🇷', awayTeamFlag: '🇲🇽', group: 'B', scheduledDate: new Date(now.getTime() + 7 * 86400000), resultDeadline: new Date(now.getTime() + 7 * 86400000 - 3600000), isFinished: false },
      { id: '4', homeTeam: 'Francia', awayTeam: 'Canadá', homeTeamFlag: '🇫🇷', awayTeamFlag: '🇨🇦', group: 'B', scheduledDate: new Date(now.getTime() + 8 * 86400000), resultDeadline: new Date(now.getTime() + 8 * 86400000 - 3600000), isFinished: false },
      { id: '5', homeTeam: 'Alemania', awayTeam: 'Japón', homeTeamFlag: '🇩🇪', awayTeamFlag: '🇯🇵', group: 'C', scheduledDate: new Date(now.getTime() + 9 * 86400000), resultDeadline: new Date(now.getTime() + 9 * 86400000 - 3600000), isFinished: false },
      { id: '6', homeTeam: 'España', awayTeam: 'Costa Rica', homeTeamFlag: '🇪🇸', awayTeamFlag: '🇨🇷', group: 'C', scheduledDate: new Date(now.getTime() + 10 * 86400000), resultDeadline: new Date(now.getTime() + 10 * 86400000 - 3600000), isFinished: false },
      { id: '7', homeTeam: 'Inglaterra', awayTeam: 'Serbia', homeTeamFlag: '🇬🇧', awayTeamFlag: '🇷🇸', group: 'D', scheduledDate: new Date(now.getTime() + 11 * 86400000), resultDeadline: new Date(now.getTime() + 11 * 86400000 - 3600000), isFinished: false },
      { id: '8', homeTeam: 'Países Bajos', awayTeam: 'Italia', homeTeamFlag: '🇳🇱', awayTeamFlag: '🇮🇹', group: 'D', scheduledDate: new Date(now.getTime() + 12 * 86400000), resultDeadline: new Date(now.getTime() + 12 * 86400000 - 3600000), isFinished: false },
    ];
    setMatches(mockMatches);
    setIsLoading(false);
  }, []);

  return { matches, isLoading };
};\`,

  'src/components/common/Navbar.tsx': \`import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
          ⚽ PRODE 2026
        </Typography>
        {user ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" component={RouterLink} to="/">Grupos</Button>
            <Button color="inherit" component={RouterLink} to="/podium">Podio</Button>
            {user.role === 'admin' && <Button color="inherit" component={RouterLink} to="/admin">Admin</Button>}
            <Button color="inherit" onClick={() => { logout(); navigate('/login'); }}>Logout</Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" component={RouterLink} to="/login">Login</Button>
            <Button color="inherit" component={RouterLink} to="/register">Registro</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};\`,

  'src/components/common/NotificationSnackbar.tsx': \`import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useNotification } from '../../hooks/useNotification';

export const NotificationSnackbar: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <>
      {notifications.map((notif) => (
        <Snackbar key={notif.id} open={true} onClose={() => removeNotification(notif.id)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert onClose={() => removeNotification(notif.id)} severity={notif.type}>{notif.message}</Alert>
        </Snackbar>
      ))}
    </>
  );
};\`,

  'src/components/common/Banner.tsx': \`import React from 'react';
import { Box } from '@mui/material';

export const Banner: React.FC = () => {
  return (
    <Box sx={{ width: '100%', height: { xs: 150, sm: 250 }, backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1, my: 2 }}>
      Banner Publicitario
    </Box>
  );
};\`,

  'src/components/auth/LoginForm.tsx': \`import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box, Alert } from '@mui/material';
import { loginSchema } from '../../utils/validators';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const LoginForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err) {}
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField {...register('email')} label="Email" type="email" fullWidth margin="normal" error={!!errors.email} helperText={errors.email?.message as string} />
      <TextField {...register('password')} label="Contraseña" type="password" fullWidth margin="normal" error={!!errors.password} helperText={errors.password?.message as string} />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} disabled={isLoading}>Login</Button>
    </Box>
  );
};\`,

  'src/components/auth/RegisterForm.tsx': \`import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box, Alert } from '@mui/material';
import { registerSchema } from '../../utils/validators';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const RegisterForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(registerSchema) });
  const { register: registerUser, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await registerUser(data);
      navigate('/');
    } catch (err) {}
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField {...register('name')} label="Nombre" fullWidth margin="normal" error={!!errors.name} helperText={errors.name?.message as string} />
      <TextField {...register('email')} label="Email" type="email" fullWidth margin="normal" error={!!errors.email} helperText={errors.email?.message as string} />
      <TextField {...register('dni')} label="DNI" fullWidth margin="normal" error={!!errors.dni} helperText={errors.dni?.message as string} />
      <TextField {...register('password')} label="Contraseña" type="password" fullWidth margin="normal" error={!!errors.password} helperText={errors.password?.message as string} />
      <TextField {...register('companyCode')} label="Código Empresa (Opcional)" fullWidth margin="normal" />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} disabled={isLoading}>Registrarse</Button>
    </Box>
  );
};\`,

  'src/components/auth/ProtectedRoute.tsx': \`import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface Props {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<Props> = ({ children, adminOnly = false }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  return <>{children}</>;
};\`,

  'src/pages/LoginPage.tsx': \`import React from 'react';
import { Container, Paper, Box, Typography } from '@mui/material';
import { LoginForm } from '../components/auth/LoginForm';
import { Link as RouterLink } from 'react-router-dom';

export const LoginPage: React.FC = () => (
  <Container maxWidth="sm" sx={{ py: 4 }}>
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>⚽ PRODE 2026</Typography>
      <LoginForm />
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2">¿No tienes cuenta? <RouterLink to="/register" style={{ color: '#1976d2' }}>Regístrate</RouterLink></Typography>
      </Box>
    </Paper>
  </Container>
);\`,

  'src/pages/RegisterPage.tsx': \`import React from 'react';
import { Container, Paper, Box, Typography } from '@mui/material';
import { RegisterForm } from '../components/auth/RegisterForm';
import { Link as RouterLink } from 'react-router-dom';

export const RegisterPage: React.FC = () => (
  <Container maxWidth="sm" sx={{ py: 4 }}>
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>Registro</Typography>
      <RegisterForm />
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2">¿Ya tienes cuenta? <RouterLink to="/login" style={{ color: '#1976d2' }}>Inicia sesión</RouterLink></Typography>
      </Box>
    </Paper>
  </Container>
);\`,

  'src/pages/GroupsPage.tsx': \`import React from 'react';
import { Container, Box, Grid, Card, CardHeader, CardContent, Typography, Chip } from '@mui/material';
import { useMatches } from '../hooks/useMatches';
import { Banner } from '../components/common/Banner';

export const GroupsPage: React.FC = () => {
  const { matches } = useMatches();
  const grouped = matches.reduce((acc, m) => {
    if (!acc[m.group]) acc[m.group] = [];
    acc[m.group].push(m);
    return acc;
  }, {} as Record<string, typeof matches>);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Banner />
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Fase de Grupos</Typography>
      <Grid container spacing={3}>
        {Object.entries(grouped).map(([group, groupMatches]) => (
          <Grid item xs={12} md={6} key={group}>
            <Card>
              <CardHeader title={\`Grupo \${group}\`} />
              <CardContent>
                {groupMatches.map(m => (
                  <Box key={m.id} sx={{ p: 2, mb: 2, border: '1px solid #eee', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#666' }}>{m.scheduledDate.toLocaleDateString()}</Typography>
                      {m.isFinished && <Chip label="Finalizado" color="success" size="small" />}
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 1 }}>
                      <Typography>{m.homeTeamFlag} {m.homeTeam}</Typography>
                      <Typography sx={{ fontWeight: 'bold', color: '#1976d2' }}>{m.isFinished ? m.homeScore + ' - ' + m.awayScore : '-'}</Typography>
                      <Typography>{m.awayTeam} {m.awayTeamFlag}</Typography>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};\`,

  'src/pages/PodiumPage.tsx': \`import React from 'react';
import { Container, Box, Card, CardContent, Typography } from '@mui/material';

export const PodiumPage: React.FC = () => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Ranking</Typography>
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
      <Card sx={{ flex: 1, minWidth: 150, textAlign: 'center', backgroundColor: '#fff9c4' }}>
        <CardContent>
          <Typography sx={{ fontSize: '2.5rem', mb: 1 }}>🥇</Typography>
          <Typography>1° lugar</Typography>
          <Typography>100 pts</Typography>
        </CardContent>
      </Card>
      <Card sx={{ flex: 1, minWidth: 150, textAlign: 'center', backgroundColor: '#e8e8e8' }}>
        <CardContent>
          <Typography sx={{ fontSize: '2.5rem', mb: 1 }}>🥈</Typography>
          <Typography>2° lugar</Typography>
          <Typography>80 pts</Typography>
        </CardContent>
      </Card>
      <Card sx={{ flex: 1, minWidth: 150, textAlign: 'center', backgroundColor: '#ffcc80' }}>
        <CardContent>
          <Typography sx={{ fontSize: '2.5rem', mb: 1 }}>🥉</Typography>
          <Typography>3° lugar</Typography>
          <Typography>60 pts</Typography>
        </CardContent>
      </Card>
    </Box>
  </Container>
);\`,

  'src/pages/AdminDashboard.tsx': \`import React from 'react';
import { Container, Typography } from '@mui/material';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export const AdminDashboard: React.FC = () => (
  <ProtectedRoute adminOnly>
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Panel de Administración</Typography>
      <Typography sx={{ mt: 2 }}>Dashboard admin en construcción</Typography>
    </Container>
  </ProtectedRoute>
);\`,

  'src/pages/NotFoundPage.tsx': \`import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Container sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h1" sx={{ mb: 2 }}>404</Typography>
      <Typography variant="h4" sx={{ mb: 4 }}>Página no encontrada</Typography>
      <Button variant="contained" onClick={() => navigate('/')}>Volver</Button>
    </Container>
  );
};\`,

  'src/index.css': \`* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}\`,

  'src/App.tsx': \`import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Navbar } from './components/common/Navbar';
import { NotificationSnackbar } from './components/common/NotificationSnackbar';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
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
              <Route path="/" element={<ProtectedRoute><GroupsPage /></ProtectedRoute>} />
              <Route path="/podium" element={<ProtectedRoute><PodiumPage /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;\`,

  'src/main.tsx': \`import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Inicializar usuarios mock
const mockUsers = [
  { id: '1', name: 'Admin', email: 'admin@prode.com', dni: '12345678', password: 'admin123', role: 'admin', createdAt: new Date(), hasCompanyCode: true, companyCode: 'ADMIN001' },
  { id: '2', name: 'Juan García', email: 'juan@example.com', dni: '87654321', password: 'pass123', role: 'user', createdAt: new Date(), hasCompanyCode: false },
];
localStorage.setItem('mockUsers', JSON.stringify(mockUsers));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)\`,
};

console.log('\\n📝 Generando archivos...\n');

Object.entries(files).forEach(([filePath, content]) => {
  fs.writeFileSync(filePath, content);
  console.log(\`✓ \${filePath}\`);
});

console.log(\`
\\n✅ COMPLETADO!\\n
Próximos pasos:
  1. npm install
  2. npm run dev
\\n\`);
