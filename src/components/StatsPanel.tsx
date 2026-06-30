"use client";

import { TrendingUp, Target, Zap, Brain } from "lucide-react";

interface StatsPanelProps {
  stats: {
    profile: {
      globalCalibration: number;
      totalTasksCompleted: number;
      avgAccuracy: number | null;
    };
    counts: { pending: number; completed: number };
    recentTrend: number | null;
  } | null;
}

export function StatsPanel({ stats }: StatsPanelProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card rounded-xl p-4 border border-border animate-pulse-soft h-20" />
        ))}
      </div>
    );
  }

  const { profile, counts, recentTrend } = stats;
  const paceLabel =
    profile.globalCalibration > 1.1
      ? "Slower than avg"
      : profile.globalCalibration < 0.9
        ? "Faster than avg"
        : "On pace";

  const items = [
    {
      icon: Target,
      label: "Completed",
      value: String(counts.completed),
      sub: `${counts.pending} pending`,
      color: "text-primary",
    },
    {
      icon: TrendingUp,
      label: "Accuracy",
      value: profile.avgAccuracy !== null ? `${profile.avgAccuracy}%` : "—",
      sub: "last 20 tasks",
      color: "text-success",
    },
    {
      icon: Zap,
      label: "Your pace",
      value: `${profile.globalCalibration.toFixed(2)}x`,
      sub: paceLabel,
      color: "text-accent",
    },
    {
      icon: Brain,
      label: "Learning",
      value: profile.totalTasksCompleted > 0 ? "Active" : "New",
      sub:
        recentTrend !== null
          ? `Trend: ${recentTrend}% of actual`
          : "Complete tasks to train",
      color: "text-primary-light",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-card rounded-xl p-4 border border-border card-shadow"
        >
          <div className="flex items-center gap-2 mb-2">
            <item.icon className={`w-4 h-4 ${item.color}`} />
            <span className="text-xs text-muted">{item.label}</span>
          </div>
          <p className="text-xl font-bold">{item.value}</p>
          <p className="text-xs text-muted mt-0.5">{item.sub}</p>
        </div>
      ))}
    </div>
  );
}
