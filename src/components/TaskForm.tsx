"use client";

import { useState, useRef } from "react";
import { Upload, Sparkles, Loader2, FileText, X } from "lucide-react";

interface TaskFormProps {
  onEstimate: (formData: FormData) => Promise<void>;
  isLoading: boolean;
}

export function TaskForm({ onEstimate, isLoading }: TaskFormProps) {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim() && !file) return;

    const formData = new FormData();
    if (description.trim()) formData.append("description", description.trim());
    if (file) formData.append("file", file);

    await onEstimate(formData);
    setDescription("");
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 card-shadow border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="font-semibold text-lg">What do you need to do?</h2>
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="e.g. Write a 5-page essay on the causes of WWI, read chapters 4-6 of my biology textbook, prepare a 20-minute presentation for Monday..."
        className="w-full h-32 px-4 py-3 rounded-xl border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm leading-relaxed"
        disabled={isLoading}
      />

      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.md,.csv,.json,.html,.xml"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={isLoading}
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground border border-border rounded-lg px-3 py-2 hover:bg-background transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload file
          </button>
          {file && (
            <div className="inline-flex items-center gap-2 text-sm bg-primary/5 text-primary px-3 py-1.5 rounded-lg">
              <FileText className="w-4 h-4" />
              <span className="max-w-[150px] truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="hover:text-accent"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || (!description.trim() && !file)}
          className="inline-flex items-center gap-2 brand-gradient text-white px-6 py-2.5 rounded-full font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/15"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Estimating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Get estimate
            </>
          )}
        </button>
      </div>
    </form>
  );
}
