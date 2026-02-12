"use client";

import { useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UploadZone } from "@/components/admin/bulk-upload/upload-zone";
import { PreviewTable } from "@/components/admin/bulk-upload/preview-table";
import { ResultsSummary } from "@/components/admin/bulk-upload/results-summary";
import { parseAndValidateAction, bulkImportProductsAction } from "./actions";
import type {
  ValidationResult,
  ValidationStats,
  ImportStats,
  ImportEvent,
} from "@/lib/bulk-upload/types";

type Step = "upload" | "preview" | "importing" | "results";

export default function BulkUploadPage() {
  const [step, setStep] = useState<Step>("upload");
  const [validatedRows, setValidatedRows] = useState<ValidationResult[]>([]);
  const [stats, setStats] = useState<ValidationStats>({
    total: 0,
    valid: 0,
    warnings: 0,
    errors: 0,
  });
  const [importStats, setImportStats] = useState<ImportStats>({
    total: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    failures: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Progress tracking
  const [importProgress, setImportProgress] = useState({
    current: 0,
    total: 0,
    currentSlug: "",
    stats: { created: 0, updated: 0, skipped: 0, failed: 0 },
  });

  const handleFilesSelected = async (csvFile: File, zipFile: File | null) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("csv", csvFile);
      if (zipFile) {
        formData.append("zip", zipFile);
      }

      const result = await parseAndValidateAction(formData);

      if (!result.success || !result.rows || !result.stats) {
        setError(result.error || "Failed to parse and validate");
        return;
      }

      setValidatedRows(result.rows);
      setStats(result.stats);
      setStep("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async (options: {
    overwriteExisting: boolean;
    skipErrors: boolean;
  }) => {
    setStep("importing");
    setIsLoading(true);

    try {
      const response = await bulkImportProductsAction(validatedRows, options);

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          try {
            const event: ImportEvent = JSON.parse(line);

            if (event.type === "progress") {
              setImportProgress((prev) => ({
                ...prev,
                current: event.current,
                total: event.total,
                currentSlug: event.slug,
              }));
            } else if (event.type === "success") {
              setImportProgress((prev) => ({
                ...prev,
                stats: {
                  ...prev.stats,
                  [event.action === "created" ? "created" : "updated"]:
                    prev.stats[event.action === "created" ? "created" : "updated"] + 1,
                },
              }));
            } else if (event.type === "skipped") {
              setImportProgress((prev) => ({
                ...prev,
                stats: { ...prev.stats, skipped: prev.stats.skipped + 1 },
              }));
            } else if (event.type === "error") {
              setImportProgress((prev) => ({
                ...prev,
                stats: { ...prev.stats, failed: prev.stats.failed + 1 },
              }));
            } else if (event.type === "complete") {
              setImportStats(event.stats);
              setStep("results");
            }
          } catch (e) {
            console.error("Failed to parse event:", e);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
      setStep("preview");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep("upload");
    setValidatedRows([]);
    setStats({ total: 0, valid: 0, warnings: 0, errors: 0 });
    setError(null);
  };

  const handleUploadMore = () => {
    setStep("upload");
    setValidatedRows([]);
    setStats({ total: 0, valid: 0, warnings: 0, errors: 0 });
    setImportStats({
      total: 0,
      created: 0,
      updated: 0,
      skipped: 0,
      failed: 0,
      failures: [],
    });
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Upload className="h-6 w-6" />
            Bulk Upload Products
          </h1>
          <p className="text-sm text-muted-foreground">
            Import multiple products from CSV file with images
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl rounded-xl border bg-card p-6">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-900 dark:text-red-100">{error}</p>
          </div>
        )}

        {step === "upload" && (
          <UploadZone onFilesSelected={handleFilesSelected} />
        )}

        {step === "preview" && (
          <PreviewTable
            rows={validatedRows}
            stats={stats}
            onImport={handleImport}
            onBack={handleBack}
          />
        )}

        {step === "importing" && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <h2 className="text-2xl font-bold mb-2">Importing Products...</h2>
              <p className="text-muted-foreground">
                {importProgress.current} of {importProgress.total} (
                {importProgress.total > 0
                  ? Math.round((importProgress.current / importProgress.total) * 100)
                  : 0}
                %)
              </p>
            </div>

            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{
                  width: `${
                    importProgress.total > 0
                      ? (importProgress.current / importProgress.total) * 100
                      : 0
                  }%`,
                }}
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="rounded-lg border p-4 text-center">
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-2xl font-bold text-green-600">
                  {importProgress.stats.created}
                </p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-sm text-muted-foreground">Updated</p>
                <p className="text-2xl font-bold text-blue-600">
                  {importProgress.stats.updated}
                </p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-sm text-muted-foreground">Skipped</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {importProgress.stats.skipped}
                </p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-600">
                  {importProgress.stats.failed}
                </p>
              </div>
            </div>

            {importProgress.currentSlug && (
              <div className="text-center text-sm text-muted-foreground">
                <p>Currently processing:</p>
                <p className="font-mono font-medium">{importProgress.currentSlug}</p>
              </div>
            )}
          </div>
        )}

        {step === "results" && (
          <ResultsSummary stats={importStats} onUploadMore={handleUploadMore} />
        )}

        {isLoading && step === "upload" && (
          <div className="flex items-center justify-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
}
