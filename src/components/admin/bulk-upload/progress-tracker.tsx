"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type {
  ImportEvent,
  ImportStats,
  ValidationResult,
} from "@/lib/bulk-upload/types";

type ProgressTrackerProps = {
  onComplete: (stats: ImportStats) => void;
};

export function ProgressTracker({ onComplete: _onComplete }: ProgressTrackerProps) {
  const [current] = useState(0);
  const [total] = useState(0);
  const [currentSlug] = useState("");
  const [stats] = useState({
    created: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
  });

  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Importing Products...</h2>
        <p className="text-muted-foreground">
          {current} of {total} ({Math.round(progress)}%)
        </p>
      </div>

      <Progress value={progress} className="w-full" />

      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border p-4 text-center">
          <p className="text-sm text-muted-foreground">Created</p>
          <p className="text-2xl font-bold text-green-600">{stats.created}</p>
        </div>
        <div className="rounded-lg border p-4 text-center">
          <p className="text-sm text-muted-foreground">Updated</p>
          <p className="text-2xl font-bold text-blue-600">{stats.updated}</p>
        </div>
        <div className="rounded-lg border p-4 text-center">
          <p className="text-sm text-muted-foreground">Skipped</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.skipped}</p>
        </div>
        <div className="rounded-lg border p-4 text-center">
          <p className="text-sm text-muted-foreground">Failed</p>
          <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
        </div>
      </div>

      {currentSlug && (
        <div className="text-center text-sm text-muted-foreground">
          <p>Currently processing:</p>
          <p className="font-mono font-medium">{currentSlug}</p>
        </div>
      )}
    </div>
  );
}

export function useImportStream(
  validatedRows: ValidationResult[],
  options: { overwriteExisting: boolean; skipErrors: boolean },
  onComplete: (stats: ImportStats) => void,
  onProgress: (event: ImportEvent) => void
) {
  const [isImporting, setIsImporting] = useState(false);

  const startImport = async () => {
    setIsImporting(true);

    try {
      const response = await fetch("/api/admin/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ validatedRows, options }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          try {
            const event: ImportEvent = JSON.parse(line);
            onProgress(event);

            if (event.type === "complete") {
              onComplete(event.stats);
            }
          } catch (e) {
            console.error("Failed to parse event:", e);
          }
        }
      }
    } catch (error) {
      console.error("Import error:", error);
    } finally {
      setIsImporting(false);
    }
  };

  return { startImport, isImporting };
}
