export type UserRole = "admin" | "user";

export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  dni: string;
  password: string;
  role: UserRole;
  companyCode?: string;
  createdAt: Date;
  hasCompanyCode: boolean;
}

export interface CompanyConfig {
  id: string;
  name: string;
  logo?: string;
  updatedAt: Date;
  updatedBy: string;
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
  phase?: "groups" | "round16" | "quarterfinals" | "semifinals" | "final";
}

export type PrizeCriteria = "most_points_date" | "most_points_phase" | "most_points_tournament";
export type PrizeAssignmentType = "automatic" | "manual";
export type TieResolution = "all" | "draw" | "first";

export interface Prize {
  id: string;
  name: string;
  description: string;
  photoUrl?: string;
  criteria: PrizeCriteria;
  assignmentType: PrizeAssignmentType;
  tieResolution: TieResolution;
  phase?: string;
  createdAt: Date;
  createdBy: string;
}

export interface PrizeAssignment {
  id: string;
  prizeId: string;
  userId: string;
  userName: string;
  assignmentDate: Date;
  criteria: PrizeCriteria;
  phase?: string;
  points?: number;
  assignedBy: string;
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
  type: "success" | "error" | "info" | "warning";
  message: string;
  timestamp: Date;
}