import { useState, useEffect, useCallback } from "react";
import { Match } from "../types";

// Grupos reales del Mundial 2026
const GROUP_DEFINITIONS: Record<string, { teams: string[]; flags: string[] }> = {
  A: { teams: ["México", "Sudáfrica", "Corea del Sur", "Rep. Checa"], flags: ["🇲🇽", "🇿🇦", "🇰🇷", "🇨🇿"] },
  B: { teams: ["Canadá", "Bosnia y Herz.", "Qatar", "Suiza"], flags: ["🇨🇦", "🇧🇦", "🇶🇦", "🇨🇭"] },
  C: { teams: ["Brasil", "Marruecos", "Haití", "Escocia"], flags: ["🇧🇷", "🇲🇦", "🇭🇹", "🏴󠁧󠁢󠁳󠁣󠁴󠁿"] },
  D: { teams: ["Estados Unidos", "Paraguay", "Australia", "Turquía"], flags: ["🇺🇸", "🇵🇾", "🇦🇺", "🇹🇷"] },
  E: { teams: ["Alemania", "Curazao", "Costa de Marfil", "Ecuador"], flags: ["🇩🇪", "🇨🇼", "🇨🇮", "🇪🇨"] },
  F: { teams: ["Países Bajos", "Japón", "Suecia", "Túnez"], flags: ["🇳🇱", "🇯🇵", "🇸🇪", "🇹🇳"] },
  G: { teams: ["Bélgica", "Egipto", "Irán", "Nueva Zelanda"], flags: ["🇧🇪", "🇪🇬", "🇮🇷", "🇳🇿"] },
  H: { teams: ["España", "Cabo Verde", "Arabia Saudita", "Uruguay"], flags: ["🇪🇸", "🇨🇻", "🇸🇦", "🇺🇾"] },
  I: { teams: ["Francia", "Senegal", "Irak", "Noruega"], flags: ["🇫🇷", "🇸🇳", "🇮🇶", "🇳🇴"] },
  J: { teams: ["Argentina", "Argelia", "Austria", "Jordania"], flags: ["🇦🇷", "🇩🇿", "🇦🇹", "🇯🇴"] },
  K: { teams: ["Portugal", "RD Congo", "Uzbekistán", "Colombia"], flags: ["🇵🇹", "🇨🇩", "🇺🇿", "🇨🇴"] },
  L: { teams: ["Inglaterra", "Croacia", "Ghana", "Panamá"], flags: ["🏴󠁧󠁢󠁥󠁮󠁧󠁿", "🇭🇷", "🇬🇭", "🇵🇦"] },
};

// Pares de rondas en un grupo de 4 equipos
const ROUND_PAIRS = [[0, 1], [2, 3], [0, 2], [1, 3], [0, 3], [1, 2]];

function buildMatches(): Match[] {
  const matches: Match[] = [];
  let id = 1;
  const groupKeys = Object.keys(GROUP_DEFINITIONS);
  // Jornadas: 11 jun, 15 jun, 22 jun 2026 por grupo
  const roundOffsets = [0, 4, 11]; // días desde inicio por jornada

  groupKeys.forEach((group, groupIdx) => {
    const { teams, flags } = GROUP_DEFINITIONS[group];
    ROUND_PAIRS.forEach(([i, j], pairIdx) => {
      const round = Math.floor(pairIdx / 2); // 0,1,2
      const dayOffset = roundOffsets[round] + groupIdx * 0.5; // escalonar grupos
      const baseDate = new Date("2026-06-11T18:00:00");
      baseDate.setDate(baseDate.getDate() + Math.floor(dayOffset));
      baseDate.setHours(18 + (groupIdx % 3) * 2, 0, 0, 0); // distintos horarios

      const scheduledDate = new Date(baseDate);
      const resultDeadline = new Date(scheduledDate.getTime() - 24 * 60 * 60 * 1000);

      // Primeros 12 partidos son pasados con resultados (para demo)
      const isPast = id <= 12;
      const isFinished = isPast;

      matches.push({
        id: String(id++),
        homeTeam: teams[i],
        awayTeam: teams[j],
        homeTeamFlag: flags[i],
        awayTeamFlag: flags[j],
        group,
        scheduledDate: isPast ? new Date(new Date().getTime() - (13 - id) * 86400000) : scheduledDate,
        resultDeadline: isPast
          ? new Date(new Date().getTime() - (14 - id) * 86400000)
          : resultDeadline,
        isFinished,
        homeScore: isFinished ? Math.floor(Math.random() * 4) : undefined,
        awayScore: isFinished ? Math.floor(Math.random() * 3) : undefined,
      });
    });
  });

  return matches;
}

const STORAGE_KEY = "mockMatchResults";

export const useMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const base = buildMatches();
    // Aplicar resultados guardados
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const overrides: Record<string, { homeScore: number; awayScore: number }> = JSON.parse(saved);
      const updated = base.map(m =>
        overrides[m.id]
          ? { ...m, homeScore: overrides[m.id].homeScore, awayScore: overrides[m.id].awayScore, isFinished: true }
          : m
      );
      setMatches(updated);
    } else {
      setMatches(base);
    }
    setIsLoading(false);
  }, []);

  const updateMatchResult = useCallback((matchId: string, homeScore: number, awayScore: number) => {
    setMatches(prev => {
      const updated = prev.map(m =>
        m.id === matchId ? { ...m, homeScore, awayScore, isFinished: true } : m
      );
      // Persistir solo los overrides
      const saved = localStorage.getItem(STORAGE_KEY);
      const overrides = saved ? JSON.parse(saved) : {};
      overrides[matchId] = { homeScore, awayScore };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
      return updated;
    });
  }, []);

  return { matches, isLoading, updateMatchResult };
};