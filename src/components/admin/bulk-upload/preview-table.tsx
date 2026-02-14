"use client";

import { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type {
  ClientValidationResult,
  ImageOnlyValidationResult,
  UploadMode,
  ValidationStats,
} from "@/lib/bulk-upload/types";

type PreviewTableProps = {
  uploadMode: UploadMode;
  rows: ClientValidationResult[];
  imageOnlyRows?: ImageOnlyValidationResult[];
  stats: ValidationStats;
  onImport: (options: { overwriteExisting: boolean; skipErrors: boolean }) => void;
  onBack: () => void;
};

const ROWS_PER_PAGE = 50;

export function PreviewTable({
  uploadMode,
  rows,
  imageOnlyRows,
  stats,
  onImport,
  onBack,
}: PreviewTableProps) {
  const [filter, setFilter] = useState<
    "all" | "valid" | "warnings" | "errors"
  >("all");
  const [overwriteExisting, setOverwriteExisting] = useState(false);
  const [skipErrors, setSkipErrors] = useState(true);
  const [page, setPage] = useState(1);

  // ZIP-only mode
  if (uploadMode === "zip-only" && imageOnlyRows) {
    return (
      <ImageOnlyPreview
        rows={imageOnlyRows}
        stats={stats}
        onImport={() => onImport({ overwriteExisting: true, skipErrors: true })}
        onBack={onBack}
      />
    );
  }

  // CSV mode (csv-only or csv-and-zip)
  const filteredRows = rows.filter((row) => {
    if (filter === "all") return true;
    if (filter === "valid") return row.status === "valid";
    if (filter === "warnings") return row.status === "warning";
    if (filter === "errors") return row.status === "error";
    return true;
  });

  const totalPages = Math.ceil(filteredRows.length / ROWS_PER_PAGE);
  const startIndex = (page - 1) * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;
  const paginatedRows = filteredRows.slice(startIndex, endIndex);

  const canImport = stats.errors === 0 || skipErrors;
  const importCount =
    skipErrors ? stats.valid + stats.warnings : stats.total;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Valid</p>
          <p className="text-2xl font-bold text-green-600">{stats.valid}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Warnings</p>
          <p className="text-2xl font-bold text-yellow-600">
            {stats.warnings}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Errors</p>
          <p className="text-2xl font-bold text-red-600">{stats.errors}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "accent" : "outline"}
          size="sm"
          onClick={() => {
            setFilter("all");
            setPage(1);
          }}
        >
          All ({stats.total})
        </Button>
        <Button
          variant={filter === "valid" ? "accent" : "outline"}
          size="sm"
          onClick={() => {
            setFilter("valid");
            setPage(1);
          }}
        >
          Valid ({stats.valid})
        </Button>
        <Button
          variant={filter === "warnings" ? "accent" : "outline"}
          size="sm"
          onClick={() => {
            setFilter("warnings");
            setPage(1);
          }}
        >
          Warnings ({stats.warnings})
        </Button>
        <Button
          variant={filter === "errors" ? "accent" : "outline"}
          size="sm"
          onClick={() => {
            setFilter("errors");
            setPage(1);
          }}
        >
          Errors ({stats.errors})
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Row
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Slug
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Brand
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Images
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Data
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Issues
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((row) => (
                <tr key={row.row.index} className="border-t">
                  <td className="px-4 py-3 text-sm">{row.row.index}</td>
                  <td className="px-4 py-3">
                    {row.status === "valid" && (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                    {row.status === "warning" && (
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    )}
                    {row.status === "error" && (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono">
                    {row.row.data.slug}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {row.row.data.nameEn || row.row.data.nameTh}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                    {row.row.data.categorySlug}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                    {row.row.data.brandSlug}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {row.imageInfo?.hasMain && "M"}
                    {row.imageInfo && row.imageInfo.galleryCount > 0
                      ? ` + ${row.imageInfo.galleryCount}G`
                      : ""}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {(() => {
                      const specCount =
                        row.row.data.parsedSpecifications?.length || 0;
                      const featCount =
                        row.row.data.parsedFeatures?.length || 0;
                      const parts: string[] = [];
                      if (specCount > 0) parts.push(`${specCount} specs`);
                      if (featCount > 0) parts.push(`${featCount} feat.`);
                      return parts.length > 0 ? parts.join(", ") : "\u2014";
                    })()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {row.errors.length > 0 && (
                      <div className="space-y-1">
                        {row.errors.slice(0, 2).map((error, i) => (
                          <p key={i} className="text-red-600 text-xs">
                            {error}
                          </p>
                        ))}
                        {row.errors.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{row.errors.length - 2} more
                          </p>
                        )}
                      </div>
                    )}
                    {row.warnings.length > 0 && (
                      <div className="space-y-1">
                        {row.warnings.slice(0, 2).map((warning, i) => (
                          <p key={i} className="text-yellow-600 text-xs">
                            {warning}
                          </p>
                        ))}
                        {row.warnings.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{row.warnings.length - 2} more
                          </p>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredRows.length)} of {filteredRows.length}{" "}
            results
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Options */}
      <div className="space-y-4 border-t pt-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="overwrite"
            checked={overwriteExisting}
            onCheckedChange={(checked) =>
              setOverwriteExisting(checked as boolean)
            }
          />
          <Label htmlFor="overwrite" className="cursor-pointer">
            Overwrite existing products with same slug
          </Label>
        </div>
        {stats.errors > 0 && (
          <div className="flex items-center gap-2">
            <Checkbox
              id="skipErrors"
              checked={skipErrors}
              onCheckedChange={(checked) => setSkipErrors(checked as boolean)}
            />
            <Label htmlFor="skipErrors" className="cursor-pointer">
              Skip rows with errors ({stats.errors} rows)
            </Label>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="accent"
          onClick={() => onImport({ overwriteExisting, skipErrors })}
          disabled={!canImport}
        >
          Import {importCount} Products
        </Button>
      </div>
    </div>
  );
}

// --- Image-only preview for ZIP-only mode ---

function ImageOnlyPreview({
  rows,
  stats,
  onImport,
  onBack,
}: {
  rows: ImageOnlyValidationResult[];
  stats: ValidationStats;
  onImport: () => void;
  onBack: () => void;
}) {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "existing" | "new">("all");

  const filteredRows = rows.filter((row) => {
    if (filter === "all") return true;
    if (filter === "existing") return row.productExists;
    if (filter === "new") return !row.productExists;
    return true;
  });

  const totalPages = Math.ceil(filteredRows.length / ROWS_PER_PAGE);
  const startIndex = (page - 1) * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;
  const paginatedRows = filteredRows.slice(startIndex, endIndex);

  const existingCount = rows.filter((r) => r.productExists).length;
  const newCount = rows.filter((r) => !r.productExists).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total Slugs</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Existing Products</p>
          <p className="text-2xl font-bold text-green-600">{existingCount}</p>
          <p className="text-xs text-muted-foreground">Images will be updated</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">New Products</p>
          <p className="text-2xl font-bold text-yellow-600">{newCount}</p>
          <p className="text-xs text-muted-foreground">
            Will be created with placeholder data
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "accent" : "outline"}
          size="sm"
          onClick={() => {
            setFilter("all");
            setPage(1);
          }}
        >
          All ({stats.total})
        </Button>
        <Button
          variant={filter === "existing" ? "accent" : "outline"}
          size="sm"
          onClick={() => {
            setFilter("existing");
            setPage(1);
          }}
        >
          Existing ({existingCount})
        </Button>
        <Button
          variant={filter === "new" ? "accent" : "outline"}
          size="sm"
          onClick={() => {
            setFilter("new");
            setPage(1);
          }}
        >
          New ({newCount})
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Slug
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Product Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Main Image
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Gallery
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((row) => (
                <tr key={row.slug} className="border-t">
                  <td className="px-4 py-3">
                    {row.productExists ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">
                        <ImageIcon className="h-3 w-3" />
                        Update
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-1 rounded-full">
                        <Plus className="h-3 w-3" />
                        New
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono">{row.slug}</td>
                  <td className="px-4 py-3 text-sm">
                    {row.productName || (
                      <span className="text-muted-foreground italic">
                        Will be created
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {row.images.hasMain ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <span className="text-muted-foreground">&mdash;</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {row.images.galleryCount > 0
                      ? `${row.images.galleryCount} images`
                      : "\u2014"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredRows.length)} of {filteredRows.length}{" "}
            results
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Info */}
      {newCount > 0 && (
        <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 p-4">
          <p className="text-sm text-yellow-900 dark:text-yellow-100">
            <strong>{newCount} new product(s)</strong> will be created with
            placeholder data (name from slug, uncategorized, unbranded). You can
            edit their details later or upload a CSV to update them.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button variant="accent" onClick={onImport}>
          Upload Images for {stats.total} Products
        </Button>
      </div>
    </div>
  );
}
