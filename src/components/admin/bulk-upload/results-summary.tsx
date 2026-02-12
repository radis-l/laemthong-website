"use client";

import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { ImportStats } from "@/lib/bulk-upload/types";

type ResultsSummaryProps = {
  stats: ImportStats;
  onUploadMore: () => void;
};

export function ResultsSummary({ stats, onUploadMore }: ResultsSummaryProps) {
  const successCount = stats.created + stats.updated;
  const hasFailures = stats.failures.length > 0;

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <div className="text-center">
        <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Import Complete</h2>
        <p className="text-muted-foreground">
          Successfully imported {successCount} of {stats.total} products
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

      {/* Failures List */}
      {hasFailures && (
        <div className="rounded-lg border">
          <div className="bg-red-50 dark:bg-red-950 px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold text-red-900 dark:text-red-100">
                Failed Imports ({stats.failures.length})
              </h3>
            </div>
          </div>
          <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
            {stats.failures.map((failure, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded bg-muted"
              >
                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm font-medium">
                    {failure.slug}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {failure.error}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" onClick={onUploadMore}>
          Upload More
        </Button>
        <Button asChild>
          <Link href="/admin/products">
            View Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
