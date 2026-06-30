"use client";

import { useState } from "react";
import {
  Clock,
  CheckCircle2,
  Play,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { formatMinutes } from "@/lib/personalization";

export interface TaskData {
  id: string;
  title: string;
  description: string;
  category: string;
  complexity: string;
  estimatedMinutes: number;
  rawEstimatedMinutes: number;
  actualMinutes: number | null;
  status: string;
  aiReasoning: string | null;
  fileName: string | null;
  createdAt: string;
  completedAt: string | null;
}

interface TaskCardProps {
  task: TaskData;
  breakdown?: string[];
  onStart: (id: string) => void;
  onComplete: (id: string, actualMinutes: number) => Promise<boolean>;
  onDelete: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  homework: "bg-blue-100 text-blue-700",
  work: "bg-purple-100 text-purple-700",
  personal: "bg-green-100 text-green-700",
  reading: "bg-amber-100 text-amber-700",
  project: "bg-rose-100 text-rose-700",
  other: "bg-gray-100 text-gray-700",
};

export function TaskCard({ task, breakdown, onStart, onComplete, onDelete }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [actualInput, setActualInput] = useState("");
  const [inputUnit, setInputUnit] = useState<"minutes" | "hours">("minutes");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isCompleted = task.status === "completed";
  const isInProgress = task.status === "in_progress";

  async function handleSubmitFeedback(e?: React.FormEvent) {
    e?.preventDefault();
    setSubmitError(null);

    const value = parseFloat(actualInput);
    if (!value || value <= 0) {
      setSubmitError("Please enter a valid time greater than 0.");
      return;
    }

    const minutes = inputUnit === "hours" ? Math.round(value * 60) : Math.round(value);
    setIsSubmitting(true);
    try {
      const ok = await onComplete(task.id, minutes);
      if (ok) {
        setShowFeedback(false);
        setActualInput("");
      } else {
        setSubmitError("Could not save. Try again or refresh the page.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const accuracy =
    isCompleted && task.actualMinutes
      ? Math.round(
          Math.max(0, 1 - Math.abs(task.actualMinutes - task.estimatedMinutes) / task.actualMinutes) *
            100
        )
      : null;

  return (
    <div
      className={`bg-card rounded-2xl border card-shadow transition-all ${
        isCompleted ? "border-success/30 opacity-90" : "border-border"
      }`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${
                  categoryColors[task.category] ?? categoryColors.other
                }`}
              >
                {task.category}
              </span>
              <span className="text-xs text-muted capitalize">{task.complexity} complexity</span>
              {isInProgress && (
                <span className="text-xs font-medium text-warning flex items-center gap-1">
                  <Play className="w-3 h-3" /> In progress
                </span>
              )}
              {isCompleted && (
                <span className="text-xs font-medium text-success flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Done
                </span>
              )}
            </div>
            <h3 className="font-semibold text-base mb-1 truncate">{task.title}</h3>
            {task.fileName && (
              <p className="text-xs text-muted mb-1">📎 {task.fileName}</p>
            )}
          </div>

          <div className="text-right shrink-0">
            <div className="flex items-center gap-1.5 text-primary font-bold text-xl">
              <Clock className="w-5 h-5" />
              {formatMinutes(task.estimatedMinutes)}
            </div>
            {task.rawEstimatedMinutes !== task.estimatedMinutes && (
              <p className="text-xs text-muted flex items-center gap-1 justify-end mt-0.5">
                <Sparkles className="w-3 h-3" />
                Personalized
              </p>
            )}
            {isCompleted && task.actualMinutes && (
              <p className="text-xs text-muted mt-1">
                Actual: {formatMinutes(task.actualMinutes)}
                {accuracy !== null && (
                  <span className="text-success ml-1">({accuracy}% accurate)</span>
                )}
              </p>
            )}
          </div>
        </div>

        {task.aiReasoning && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-xs text-muted hover:text-foreground flex items-center gap-1 transition-colors"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {expanded ? "Hide" : "Show"} reasoning
          </button>
        )}

        {expanded && (
          <div className="mt-3 p-3 bg-background rounded-xl text-sm text-muted leading-relaxed">
            <p>{task.aiReasoning}</p>
            {breakdown && breakdown.length > 0 && (
              <ul className="mt-2 space-y-1">
                {breakdown.map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary font-mono text-xs mt-0.5">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {!isCompleted && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            {!isInProgress && (
              <button
                type="button"
                onClick={() => onStart(task.id)}
                className="inline-flex items-center gap-1.5 text-sm bg-primary/10 text-primary px-4 py-2 rounded-full hover:bg-primary/20 transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                Start task
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setSubmitError(null);
                setShowFeedback(true);
              }}
              className="inline-flex items-center gap-1.5 text-sm bg-success/10 text-success px-4 py-2 rounded-full hover:bg-success/20 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mark complete
            </button>
            <button
              type="button"
              onClick={() => onDelete(task.id)}
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent px-3 py-2 rounded-full hover:bg-accent/5 transition-colors ml-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {showFeedback && (
          <form
            onSubmit={handleSubmitFeedback}
            className="mt-4 p-4 bg-background rounded-xl border border-border animate-fade-up"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium">How long did it actually take?</p>
              <button
                type="button"
                onClick={() => {
                  setShowFeedback(false);
                  setSubmitError(null);
                  setActualInput("");
                }}
                className="text-xs text-muted hover:text-foreground"
              >
                Cancel
              </button>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                step="any"
                value={actualInput}
                onChange={(e) => setActualInput(e.target.value)}
                placeholder={inputUnit === "hours" ? "1.5" : "45"}
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                autoFocus
                disabled={isSubmitting}
              />
              <select
                value={inputUnit}
                onChange={(e) => setInputUnit(e.target.value as "minutes" | "hours")}
                className="px-3 py-2 rounded-lg border border-border bg-card text-sm"
                disabled={isSubmitting}
              >
                <option value="minutes">minutes</option>
                <option value="hours">hours</option>
              </select>
              <button
                type="submit"
                disabled={isSubmitting || !actualInput || parseFloat(actualInput) <= 0}
                className="brand-gradient text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity min-w-[72px]"
              >
                {isSubmitting ? "Saving..." : "Submit"}
              </button>
            </div>
            {submitError && (
              <p className="text-xs text-error mt-2">{submitError}</p>
            )}
            <p className="text-xs text-muted mt-2">
              Press Enter or click Submit. This helps BTimely learn your pace.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
