import React, { createContext, useState, useCallback, useEffect } from "react";
import { Prize, PrizeAssignment } from "../types";

interface PrizeContextType {
  prizes: Prize[];
  assignments: PrizeAssignment[];
  createPrize: (prize: Omit<Prize, "id" | "createdAt">) => void;
  assignPrize: (assignment: Omit<PrizeAssignment, "id" | "assignmentDate">) => void;
  getPrizesForCriteria: (criteria: string) => Prize[];
  getAssignmentsForPrize: (prizeId: string) => PrizeAssignment[];
  getFirstUserToLoadResults: (userIds: string[]) => string | null;
}

export const PrizeContext = createContext<PrizeContextType | undefined>(undefined);

export const PrizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [assignments, setAssignments] = useState<PrizeAssignment[]>([]);

  // Load from localStorage
  useEffect(() => {
    const savedPrizes = localStorage.getItem("mockPrizes");
    const savedAssignments = localStorage.getItem("mockAssignments");
    if (savedPrizes) setPrizes(JSON.parse(savedPrizes));
    if (savedAssignments) setAssignments(JSON.parse(savedAssignments));
  }, []);

  const createPrize = useCallback((prize: Omit<Prize, "id" | "createdAt">) => {
    const newPrize: Prize = {
      ...prize,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    const updated = [...prizes, newPrize];
    setPrizes(updated);
    localStorage.setItem("mockPrizes", JSON.stringify(updated));
  }, [prizes]);

  const assignPrize = useCallback((assignment: Omit<PrizeAssignment, "id" | "assignmentDate">) => {
    const newAssignment: PrizeAssignment = {
      ...assignment,
      id: Date.now().toString(),
      assignmentDate: new Date(),
    };
    const updated = [...assignments, newAssignment];
    setAssignments(updated);
    localStorage.setItem("mockAssignments", JSON.stringify(updated));
  }, [assignments]);

  const getPrizesForCriteria = useCallback((criteria: string) => {
    return prizes.filter(p => p.criteria === criteria);
  }, [prizes]);

  const getAssignmentsForPrize = useCallback((prizeId: string) => {
    return assignments.filter(a => a.prizeId === prizeId);
  }, [assignments]);

  // Get the first user to load results (for tie resolution)
  const getFirstUserToLoadResults = useCallback((userIds: string[]): string | null => {
    const predictions = JSON.parse(localStorage.getItem("mockPredictions") || "{}");
    
    // Find the user who loaded predictions first
    let firstUserId: string | null = null;
    let earliestTime = Infinity;
    
    userIds.forEach(userId => {
      const userPredictionTime = predictions[userId]?.loadedAt;
      if (userPredictionTime && userPredictionTime < earliestTime) {
        earliestTime = userPredictionTime;
        firstUserId = userId;
      }
    });
    
    // If no one has loaded predictions, fall back to first ID
    return firstUserId || userIds[0];
  }, []);

  return (
    <PrizeContext.Provider value={{ prizes, assignments, createPrize, assignPrize, getPrizesForCriteria, getAssignmentsForPrize, getFirstUserToLoadResults }}>
      {children}
    </PrizeContext.Provider>
  );
};
