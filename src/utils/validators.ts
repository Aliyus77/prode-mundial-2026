import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(3, "Mínimo 3 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  dni: z.string().min(7, "DNI inválido"),
  password: z.string().min(3, "Mínimo 3 caracteres"),
  companyCode: z.string().optional(),
});

export const prizeSchema = z.object({
  name: z.string().min(2, "Requerido"),
  description: z.string().min(5, "Mínimo 5 caracteres"),
  photoUrl: z.string().optional(),
  criteria: z.enum(["most_points_date", "most_points_phase", "most_points_tournament"]),
  assignmentType: z.enum(["automatic", "manual"]),
  tieResolution: z.enum(["all", "draw", "first"]).default("all"),
  phase: z.string().optional(),
});