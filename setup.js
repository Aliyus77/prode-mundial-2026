/**
 * Script para generar la estructura completa del proyecto
 * Ejecutar: node setup.js
 */

const fs = require('fs');
const path = require('path');

const projectStructure = {
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
  // Resultado exacto: 3 puntos
  if (predictedHome === actualHome && predictedAway === actualAway) {
    return 3;
  }

  // Ganador o empate correcto: 1 punto
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
  homeScore: z.number().min(0, 'Score debe ser positivo').max(20),
  awayScore: z.number().min(0, 'Score debe ser positivo').max(20),
});
`,
};

async function createProjectStructure() {
  try {
    // Crear directorios
    const dirs = new Set();
    Object.keys(projectStructure).forEach(file => {
      const dir = path.dirname(file);
      if (dir !== '.') {
        dirs.add(dir);
      }
    });

    dirs.forEach(dir => {
      fs.mkdirSync(dir, { recursive: true });
      console.log(\`✓ Creado directorio: \${dir}\`);
    });

    // Crear archivos
    Object.entries(projectStructure).forEach(([file, content]) => {
      fs.writeFileSync(file, content);
      console.log(\`✓ Creado archivo: \${file}\`);
    });

    console.log('\\n✅ Estructura de proyecto creada exitosamente!');
    console.log('\\nPróximos pasos:');
    console.log('1. npm install');
    console.log('2. npm run dev');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createProjectStructure();
`,

  'src/services/mockApi.ts': `import { User, Match, Prize, PrizeAssignment, Score, UserPrediction } from '../types';
import { addHours } from 'date-fns';

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
  // AUTENTICACIÓN
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

  // USUARIOS
  getUsers: async () => {
    return new Promise<User[]>((resolve) => {
      setTimeout(() => {
        resolve(users.map(u => ({ ...u, password: '' })));
      }, 500);
    });
  },

  // PARTIDOS
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

        // Simular cálculo automático de puntos
        users.forEach(user => {
          const prediction = predictions.find(
            p => p.userId === user.id && p.matchId === matchId
          );
          if (prediction) {
            const correctWinner =
              homeScore > awayScore ? 'home' :
              homeScore < awayScore ? 'away' : 'draw';
            const predictedWinner =
              prediction.predictedHomeScore > prediction.predictedAwayScore ? 'home' :
              prediction.predictedHomeScore < prediction.predictedAwayScore ? 'away' : 'draw';

            if (homeScore === prediction.predictedHomeScore &&
                awayScore === prediction.predictedAwayScore) {
              prediction.points = 3;
              prediction.isCorrect = true;
            } else if (correctWinner === predictedWinner) {
              prediction.points = 1;
              prediction.isCorrect = true;
            } else {
              prediction.points = 0;
              prediction.isCorrect = false;
            }
          }
        });

        resolve();
      }, 600);
    });
  },

  // PREMIOS
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

  // BANNER
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

  // PUNTUACIÓN
  getScores: async () => {
    return new Promise<Score[]>((resolve) => {
      setTimeout(() => {
        const scores = users.map(user => ({
          userId: user.id,
          userName: user.name,
          totalPoints: predictions
            .filter(p => p.userId === user.id)
            .reduce((sum, p) => sum + p.points, 0),
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

  // PREDICCIONES
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

// Crear estructura
Object.entries(projectStructure).forEach(([file, content]) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
});

console.log('✅ Archivos básicos creados');
console.log('📁 Ejecuta setup.bat o node setup.js para generar la estructura completa');
`,
};

// El resto de archivos se crearán en el siguiente paso
console.log('✅ Script de configuración creado');
