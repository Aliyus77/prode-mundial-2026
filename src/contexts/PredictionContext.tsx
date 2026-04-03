import React, { createContext, useState, useCallback, useEffect } from "react";

export interface UserPrediction {
  matchId: string;
  homeScore: number;
  awayScore: number;
  loadedAt: number;
  userId: string;
}

interface PredictionContextType {
  predictions: Record<string, UserPrediction>;
  savePrediction: (matchId: string, homeScore: number, awayScore: number, userId: string) => void;
  getPrediction: (matchId: string, userId: string) => UserPrediction | null;
  canPredict: (matchDate: Date) => boolean;
  isPredictionLocked: (matchDate: Date, matchId: string, userId: string) => boolean;
}

export const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export const PredictionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [predictions, setPredictions] = useState<Record<string, UserPrediction>>({});

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("mockPredictions");
    if (saved) {
      setPredictions(JSON.parse(saved));
    }
  }, []);

  // Guardar predicción (solo una vez)
  const savePrediction = useCallback(
    (matchId: string, homeScore: number, awayScore: number, userId: string) => {
      const key = `${userId}-${matchId}`;
      
      // Si ya existe predicción, no permitir cambio
      if (predictions[key]) {
        console.log("Predicción ya existe para este partido");
        return;
      }

      const newPrediction: UserPrediction = {
        matchId,
        homeScore,
        awayScore,
        loadedAt: Date.now(),
        userId,
      };

      const updated = { ...predictions, [key]: newPrediction };
      setPredictions(updated);
      localStorage.setItem("mockPredictions", JSON.stringify(updated));
    },
    [predictions]
  );

  // Obtener predicción de un usuario para un partido
  const getPrediction = useCallback(
    (matchId: string, userId: string) => {
      const key = `${userId}-${matchId}`;
      return predictions[key] || null;
    },
    [predictions]
  );

  // Verificar si se puede predecir (24 horas antes del partido)
  const canPredict = useCallback((matchDate: Date) => {
    const now = new Date();
    const hoursUntil = (new Date(matchDate).getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntil > 24;
  }, []);

  // Verificar si la predicción está bloqueada
  const isPredictionLocked = useCallback(
    (matchDate: Date, matchId: string, userId: string) => {
      const prediction = getPrediction(matchId, userId);
      const now = new Date();
      const hoursUntil = (new Date(matchDate).getTime() - now.getTime()) / (1000 * 60 * 60);

      // Bloqueado si: ya tiene predicción O pasaron las 24 horas
      return !!prediction || hoursUntil <= 24;
    },
    [getPrediction]
  );

  return (
    <PredictionContext.Provider value={{ predictions, savePrediction, getPrediction, canPredict, isPredictionLocked }}>
      {children}
    </PredictionContext.Provider>
  );
};
