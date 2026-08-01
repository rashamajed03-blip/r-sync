import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Camelot Wheel compatibility map — used across search, recommendations, and set planner. */
export const CAMELOT_WHEEL = [
  "1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B", "6A", "6B",
  "7A", "7B", "8A", "8B", "9A", "9B", "10A", "10B", "11A", "11B", "12A", "12B",
] as const;

export type CamelotKey = (typeof CAMELOT_WHEEL)[number];

/** Returns harmonically compatible Camelot keys for a given key (same number, relative, and adjacent). */
export function getCompatibleKeys(key: string): string[] {
  const num = parseInt(key.slice(0, -1), 10);
  const letter = key.slice(-1) as "A" | "B";
  if (Number.isNaN(num)) return [key];
  const wrap = (n: number) => (((n - 1) % 12) + 12) % 12 + 1;
  const relative = `${num}${letter === "A" ? "B" : "A"}`;
  const up = `${wrap(num + 1)}${letter}`;
  const down = `${wrap(num - 1)}${letter}`;
  return [key, relative, up, down];
}
