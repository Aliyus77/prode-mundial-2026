import { format, formatDistanceToNow, isPast, isFuture } from "date-fns";
import { es } from "date-fns/locale";

export const formatDate = (date: Date) => format(new Date(date), "dd/MM/yyyy", { locale: es });
export const formatDateTime = (date: Date) => format(new Date(date), "dd/MM/yyyy HH:mm", { locale: es });
export const formatTimeDistance = (date: Date) => formatDistanceToNow(new Date(date), { locale: es, addSuffix: true });
export const isMatchPassed = (date: Date): boolean => isPast(new Date(date));
export const isMatchFuture = (date: Date): boolean => isFuture(new Date(date));
export const canLoadResult = (deadlineDate: Date): boolean => isFuture(new Date(deadlineDate));