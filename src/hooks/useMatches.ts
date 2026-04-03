import { useState, useEffect } from "react";
import { Match } from "../types";

export const useMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userPredictions, setUserPredictions] = useState<Record<string, any>>({});

  useEffect(() => {
    const now = new Date();
    let matchId = 1;

    // Función auxiliar para crear partidos dentro de un grupo
    const createGroupMatches = (
      groupName: string,
      teams: { name: string; flag: string }[]
    ): Match[] => {
      const matches: Match[] = [];
      // Generar partidos entre todos los equipos del grupo
      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          const homeTeam = teams[i];
          const awayTeam = teams[j];
          const scheduledDate = new Date(
            now.getTime() + (matchId * 2 + Math.floor(matchId / 3)) * 86400000
          );
          matches.push({
            id: matchId.toString(),
            homeTeam: homeTeam.name,
            awayTeam: awayTeam.name,
            homeTeamFlag: homeTeam.flag,
            awayTeamFlag: awayTeam.flag,
            group: groupName,
            scheduledDate,
            resultDeadline: new Date(scheduledDate.getTime() - 3600000),
            isFinished: false,
            phase: "groups",
          });
          matchId++;
        }
      }
      return matches;
    };

    // Definición de grupos y equipos con banderas
    const groups = [
      {
        name: "A",
        teams: [
          { name: "México", flag: "🇲🇽" },
          { name: "Sudáfrica", flag: "🇿🇦" },
          { name: "Corea del Sur", flag: "🇰🇷" },
          { name: "República Checa", flag: "🇨🇿" },
        ],
      },
      {
        name: "B",
        teams: [
          { name: "Canadá", flag: "🇨🇦" },
          { name: "Bosnia y Herzegovina", flag: "🇧🇦" },
          { name: "Qatar", flag: "🇶🇦" },
          { name: "Suiza", flag: "🇨🇭" },
        ],
      },
      {
        name: "C",
        teams: [
          { name: "Brasil", flag: "🇧🇷" },
          { name: "Marruecos", flag: "🇲🇦" },
          { name: "Haití", flag: "🇭🇹" },
          { name: "Escocia", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
        ],
      },
      {
        name: "D",
        teams: [
          { name: "Estados Unidos", flag: "🇺🇸" },
          { name: "Paraguay", flag: "🇵🇾" },
          { name: "Australia", flag: "🇦🇺" },
          { name: "Turquía", flag: "🇹🇷" },
        ],
      },
      {
        name: "E",
        teams: [
          { name: "Alemania", flag: "🇩🇪" },
          { name: "Curazao", flag: "🇨🇼" },
          { name: "Costa de Marfil", flag: "🇨🇮" },
          { name: "Ecuador", flag: "🇪🇨" },
        ],
      },
      {
        name: "F",
        teams: [
          { name: "Países Bajos", flag: "🇳🇱" },
          { name: "Japón", flag: "🇯🇵" },
          { name: "Suecia", flag: "🇸🇪" },
          { name: "Túnez", flag: "🇹🇳" },
        ],
      },
      {
        name: "G",
        teams: [
          { name: "Bélgica", flag: "🇧🇪" },
          { name: "Egipto", flag: "🇪🇬" },
          { name: "Irán", flag: "🇮🇷" },
          { name: "Nueva Zelanda", flag: "🇳🇿" },
        ],
      },
      {
        name: "H",
        teams: [
          { name: "España", flag: "🇪🇸" },
          { name: "Cabo Verde", flag: "🇨🇻" },
          { name: "Arabia Saudita", flag: "🇸🇦" },
          { name: "Uruguay", flag: "🇺🇾" },
        ],
      },
      {
        name: "I",
        teams: [
          { name: "Francia", flag: "🇫🇷" },
          { name: "Senegal", flag: "🇸🇳" },
          { name: "Irak", flag: "🇮🇶" },
          { name: "Noruega", flag: "🇳🇴" },
        ],
      },
      {
        name: "J",
        teams: [
          { name: "Argentina", flag: "🇦🇷" },
          { name: "Argelia", flag: "🇩🇿" },
          { name: "Austria", flag: "🇦🇹" },
          { name: "Jordania", flag: "🇯🇴" },
        ],
      },
      {
        name: "K",
        teams: [
          { name: "Portugal", flag: "🇵🇹" },
          { name: "RD Congo", flag: "🇨🇩" },
          { name: "Uzbekistán", flag: "🇺🇿" },
          { name: "Colombia", flag: "🇨🇴" },
        ],
      },
      {
        name: "L",
        teams: [
          { name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
          { name: "Croacia", flag: "🇭🇷" },
          { name: "Ghana", flag: "🇬🇭" },
          { name: "Panamá", flag: "🇵🇦" },
        ],
      },
    ];

    // Generar todos los partidos de todos los grupos
    const allMatches: Match[] = [];
    groups.forEach((group) => {
      const groupMatches = createGroupMatches(group.name, group.teams);
      allMatches.push(...groupMatches);
    });

    // Load user predictions from localStorage
    const savedPredictions = localStorage.getItem("mockPredictions");
    if (savedPredictions) {
      setUserPredictions(JSON.parse(savedPredictions));
    }

    setMatches(allMatches);
    setIsLoading(false);
  }, []);

  return { matches, isLoading, userPredictions };
};