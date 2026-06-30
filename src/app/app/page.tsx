"use client";

import { useEffect, useState, useCallback } from "react";
import { Clock, Settings, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useUser, useUserHeaders } from "@/lib/user-context";
import { TaskForm } from "@/components/TaskForm";
import { TaskCard, type TaskData } from "@/components/TaskCard";
import { StatsPanel } from "@/components/StatsPanel";

export default function AppPage() {
  const { userId, displayName, isLoading: userLoading, setDisplayName } = useUser();
  const headers = useUserHeaders();
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [breakdowns, setBreakdowns] = useState<Record<string, string[]>>({});
  const [stats, setStats] = useState<Parameters<typeof StatsPanel>[0]["stats"]>(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [showSettings, setShowSettings] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchTasks = useCallback(async () => {
    if (!userId) return;
    const res = await fetch("/api/tasks", { headers });
    if (res.ok) {
      const data = await res.json();
      setTasks(data.tasks);
    }
  }, [userId, headers]);

  const fetchStats = useCallback(async () => {
    if (!userId) return;
    const res = await fetch("/api/stats", { headers });
    if (res.ok) {
      setStats(await res.json());
    }
  }, [userId, headers]);

  useEffect(() => {
    if (userId) {
      fetchTasks();
      fetchStats();
    }
  }, [userId, fetchTasks, fetchStats]);

  async function handleEstimate(formData: FormData) {
    setIsEstimating(true);
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers,
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || "Failed to estimate");
        return;
      }
      const data = await res.json();
      setTasks((prev) => [data.task, ...prev]);
      if (data.breakdown) {
        setBreakdowns((prev) => ({ ...prev, [data.task.id]: data.breakdown }));
      }
      if (data.personalized) {
        showToast("Estimate personalized based on your history!");
      }
      fetchStats();
    } finally {
      setIsEstimating(false);
    }
  }

  async function handleStart(id: string) {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ status: "in_progress" }),
    });
    fetchTasks();
  }

  async function handleComplete(id: string, actualMinutes: number): Promise<boolean> {
    if (!userId) {
      showToast("Session error — please refresh the page.");
      return false;
    }

    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ actualMinutes }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      showToast(err.error || "Failed to save your time. Please try again.");
      return false;
    }

    const data = await res.json();
    setTasks((prev) => prev.map((t) => (t.id === id ? data.task : t)));
    showToast(
      data.calibrationUpdated
        ? "Task completed! BTimely learned from your feedback."
        : "Task completed!"
    );
    fetchStats();
    return true;
  }

  async function handleDelete(id: string) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE", headers });
    setTasks((prev) => prev.filter((t) => t.id !== id));
    fetchStats();
  }

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return t.status !== "completed";
    if (filter === "completed") return t.status === "completed";
    return true;
  });

  if (userLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Logo size="lg" showText={false} className="animate-pulse-soft" />
        <div className="flex items-center gap-2 text-muted text-sm">
          <Clock className="w-4 h-4 text-primary" />
          Loading BTimely...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Logo size="sm" href="/" />
          <div className="flex items-center gap-3">
            {displayName && (
              <span className="text-sm text-muted hidden sm:inline">
                Hi, {displayName}
              </span>
            )}
            <button
              onClick={() => {
                setNameInput(displayName || "");
                setShowSettings(true);
              }}
              className="p-2 rounded-lg hover:bg-white/50 transition-colors text-muted"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        <StatsPanel stats={stats} />
        <TaskForm onEstimate={handleEstimate} isLoading={isEstimating} />

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Your tasks</h2>
            <div className="flex gap-1 bg-card rounded-lg p-0.5 border border-border">
              {(["all", "active", "completed"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs px-3 py-1.5 rounded-md capitalize transition-colors ${
                    filter === f
                      ? "brand-gradient text-white"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-16 text-muted">
              <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">
                {filter === "all"
                  ? "No tasks yet. Describe something above to get started!"
                  : `No ${filter} tasks.`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  breakdown={breakdowns[task.id]}
                  onStart={handleStart}
                  onComplete={handleComplete}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-card rounded-2xl p-6 w-full max-w-sm card-shadow border border-border animate-fade-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Settings</h3>
              <button onClick={() => setShowSettings(false)} className="text-muted hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <label className="text-sm text-muted block mb-2">Display name (optional)</label>
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 mb-4"
            />
            <button
              onClick={async () => {
                await setDisplayName(nameInput);
                setShowSettings(false);
              }}
              className="w-full brand-gradient text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background px-5 py-3 rounded-full text-sm font-medium shadow-lg animate-fade-up">
          {toast}
        </div>
      )}
    </div>
  );
}
