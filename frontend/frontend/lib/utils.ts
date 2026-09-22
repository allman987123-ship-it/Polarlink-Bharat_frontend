import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(dateStr: string): string {
  if (!dateStr) return "N/A";
  try {
    return dateStr;
  } catch {
    return dateStr;
  }
}

export function getSeverityBadgeColor(severity: string): string {
  switch (severity?.toUpperCase()) {
    case "CRITICAL":
      return "bg-red-950/80 border-red-500 text-red-400";
    case "WARNING":
      return "bg-amber-950/80 border-amber-500 text-amber-400";
    case "ADVISORY":
      return "bg-blue-950/80 border-blue-500 text-blue-400";
    default:
      return "bg-slate-900 border-slate-700 text-slate-300";
  }
}

export function getRiskLevelColor(level: string): string {
  switch (level?.toUpperCase()) {
    case "CRITICAL":
      return "text-red-400 border-red-500 bg-red-950/40";
    case "HIGH":
      return "text-orange-400 border-orange-500 bg-orange-950/40";
    case "MODERATE":
      return "text-amber-400 border-amber-500 bg-amber-950/40";
    default:
      return "text-emerald-400 border-emerald-500 bg-emerald-950/40";
  }
}
