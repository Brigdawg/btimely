import type { TaskCategory } from "./types";

const EMA_ALPHA_GLOBAL = 0.25;
const EMA_ALPHA_CATEGORY = 0.35;

export function parseCategoryCalibrations(json: string): Record<string, number> {
  try {
    const parsed = JSON.parse(json) as Record<string, number>;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function applyPersonalization(
  baseMinutes: number,
  category: TaskCategory,
  globalMultiplier: number,
  categoryMultipliers: Record<string, number>
): number {
  const categoryMultiplier = categoryMultipliers[category] ?? 1;
  const blended =
    baseMinutes * globalMultiplier * 0.4 + baseMinutes * categoryMultiplier * 0.6;
  return Math.max(5, Math.round(blended / 5) * 5);
}

export function updateCalibrations(
  globalMultiplier: number,
  categoryMultipliers: Record<string, number>,
  category: TaskCategory,
  estimatedMinutes: number,
  actualMinutes: number
): { globalMultiplier: number; categoryMultipliers: Record<string, number> } {
  const ratio = actualMinutes / Math.max(estimatedMinutes, 1);

  const newGlobal =
    globalMultiplier * (1 - EMA_ALPHA_GLOBAL) + ratio * EMA_ALPHA_GLOBAL;

  const currentCategory = categoryMultipliers[category] ?? 1;
  const newCategory =
    currentCategory * (1 - EMA_ALPHA_CATEGORY) + ratio * EMA_ALPHA_CATEGORY;

  return {
    globalMultiplier: clamp(newGlobal, 0.3, 3),
    categoryMultipliers: {
      ...categoryMultipliers,
      [category]: clamp(newCategory, 0.3, 3),
    },
  };
}

export function computeAccuracy(
  estimates: Array<{ estimatedMinutes: number; actualMinutes: number }>
): number | null {
  if (estimates.length === 0) return null;

  const scores = estimates.map(({ estimatedMinutes, actualMinutes }) => {
    const error = Math.abs(actualMinutes - estimatedMinutes) / actualMinutes;
    return Math.max(0, 1 - error) * 100;
  });

  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function buildRecentPatterns(
  tasks: Array<{
    category: string;
    estimatedMinutes: number;
    actualMinutes: number | null;
    title: string;
  }>
): string[] {
  return tasks
    .filter((t) => t.actualMinutes !== null)
    .slice(0, 8)
    .map((t) => {
      const ratio = (t.actualMinutes! / t.estimatedMinutes).toFixed(2);
      return `${t.category}: "${t.title}" — estimated ${t.estimatedMinutes}m, actual ${t.actualMinutes}m (${ratio}x)`;
    });
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
