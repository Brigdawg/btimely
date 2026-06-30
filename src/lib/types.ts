export type TaskCategory =
  | "homework"
  | "work"
  | "personal"
  | "reading"
  | "project"
  | "other";

export type TaskComplexity = "low" | "medium" | "high";

export type TaskStatus = "pending" | "in_progress" | "completed";

export interface AIEstimate {
  title: string;
  category: TaskCategory;
  complexity: TaskComplexity;
  estimatedMinutes: number;
  reasoning: string;
  breakdown: string[];
}

export interface UserCalibration {
  globalMultiplier: number;
  categoryMultipliers: Record<string, number>;
  totalCompleted: number;
  avgAccuracy: number | null;
  recentPatterns: string[];
}
