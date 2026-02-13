"use client";

import { useCallback, useState } from "react";
import { Upload, FileText, FolderArchive, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportProductsAction } from "@/app/admin/(authenticated)/bulk-upload/actions";

type UploadZoneProps = {
  onFilesSelected: (csvFile: File | null, zipFile: File | null) => void;
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
    if (csvFile || zipFile) {
      onFilesSelected(csvFile, zipFile);
    }
  };

  const handleDownloadProducts = async () => {
    const { csv, isTemplate } = await exportProductsAction();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = isTemplate ? "products-template.csv" : "products-export.csv";
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
          Product Data (CSV)
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
          Product Images (ZIP)
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
          onClick={handleDownloadProducts}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Download Product List
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={!csvFile && !zipFile}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload & Preview
        </Button>
      </div>

      {/* Instructions */}
      <div className="text-sm text-muted-foreground space-y-2 border-t pt-4">
        <p className="font-medium">Upload Options:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Upload <strong>CSV only</strong> to add/update products without images</li>
          <li>Upload <strong>ZIP only</strong> to add images to existing products (or create new ones with placeholder data)</li>
          <li>Upload <strong>both</strong> to add/update products with images</li>
        </ul>
        <p className="font-medium mt-4">CSV Format:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Headers: slug, category_slug, brand_slug, name_th, name_en, etc.</li>
          <li>One product per row</li>
          <li>Slugs must be lowercase with hyphens (e.g., &quot;product-name&quot;)</li>
        </ul>
        <p className="font-medium mt-4">Specifications &amp; Features (optional):</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>spec_labels_th, spec_labels_en &mdash; Pipe-separated specification labels</li>
          <li>spec_values_th, spec_values_en &mdash; Pipe-separated specification values</li>
          <li>features_th, features_en &mdash; Pipe-separated feature descriptions</li>
          <li>Use | (pipe) to separate items, e.g. &quot;Weight|Voltage|Power&quot;</li>
          <li>All spec columns must have the same number of items</li>
        </ul>
        <p className="font-medium mt-4">ZIP Structure:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>products/[slug]/main.jpg - Main product image</li>
          <li>products/[slug]/gallery-1.jpg, gallery-2.jpg - Gallery images</li>
          <li>Supported formats: JPG, PNG, WebP, AVIF, SVG</li>
          <li>Slug folders match products by slug (e.g., products/my-product/)</li>
        </ul>
      </div>
    </div>
  );
}
