"use client";

import { useCallback, useState } from "react";
import { Upload, FileText, FolderArchive, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateTemplateAction } from "@/app/admin/(authenticated)/bulk-upload/actions";

type UploadZoneProps = {
  onFilesSelected: (csvFile: File, zipFile: File | null) => void;
};

export function UploadZone({ onFilesSelected }: UploadZoneProps) {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const csv = files.find((f) => f.name.endsWith(".csv"));
    const zip = files.find((f) => f.name.endsWith(".zip"));

    if (csv) setCsvFile(csv);
    if (zip) setZipFile(zip);
  }, []);

  const handleCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setZipFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (csvFile) {
      onFilesSelected(csvFile, zipFile);
    }
  };

  const handleDownloadTemplate = async () => {
    const template = await generateTemplateAction();
    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6">
      {/* CSV Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Product Data (CSV) *
        </label>
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleCsvChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          {csvFile ? (
            <div>
              <p className="font-medium">{csvFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(csvFile.size)}
              </p>
            </div>
          ) : (
            <div>
              <p className="font-medium">Drop CSV file here or click to browse</p>
              <p className="text-sm text-muted-foreground mt-1">
                CSV format with product data
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ZIP Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Product Images (ZIP) - Optional
        </label>
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".zip"
            onChange={handleZipChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <FolderArchive className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          {zipFile ? (
            <div>
              <p className="font-medium">{zipFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(zipFile.size)}
              </p>
            </div>
          ) : (
            <div>
              <p className="font-medium">Drop ZIP file here or click to browse</p>
              <p className="text-sm text-muted-foreground mt-1">
                ZIP containing images in products/[slug]/ folders
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={handleDownloadTemplate}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Download Template
        </Button>

        <Button onClick={handleSubmit} disabled={!csvFile} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload & Preview
        </Button>
      </div>

      {/* Instructions */}
      <div className="text-sm text-muted-foreground space-y-2 border-t pt-4">
        <p className="font-medium">CSV Format:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Headers: slug, category_slug, brand_slug, name_th, name_en, etc.</li>
          <li>One product per row</li>
          <li>Slugs must be lowercase with hyphens (e.g., &quot;product-name&quot;)</li>
        </ul>
        <p className="font-medium mt-4">ZIP Structure:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>products/[slug]/main.jpg - Main product image</li>
          <li>products/[slug]/gallery-1.jpg, gallery-2.jpg - Gallery images</li>
          <li>Supported formats: JPG, PNG, WebP, AVIF, SVG</li>
        </ul>
      </div>
    </div>
  );
}
