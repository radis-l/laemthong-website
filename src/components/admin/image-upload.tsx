"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import {
  uploadImageAction,
  deleteImageAction,
} from "@/app/admin/actions/upload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ImageFolder } from "@/lib/storage";

interface ImageUploadProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  folder: ImageFolder;
  entitySlug: string;
  multiple?: boolean;
  label?: string;
  maxFiles?: number;
}

export function ImageUpload({
  value,
  onChange,
  folder,
  entitySlug,
  multiple = false,
  label,
  maxFiles = 10,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const urls: string[] = Array.isArray(value)
    ? value.filter(Boolean)
    : value
      ? [value]
      : [];

  const canUpload = !!entitySlug;
  const atLimit = multiple && urls.length >= maxFiles;

  const handleFiles = useCallback(
    async (files: FileList) => {
      if (!canUpload) {
        toast.error("Please enter a slug first.");
        return;
      }

      const currentUrls: string[] = Array.isArray(value)
        ? value.filter(Boolean)
        : value
          ? [value]
          : [];

      const fileArray = Array.from(files);
      if (multiple && currentUrls.length + fileArray.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} images allowed.`);
        return;
      }

      setIsUploading(true);

      try {
        const uploadPromises = fileArray.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", folder);
          formData.append("entitySlug", entitySlug);

          const result = await uploadImageAction(formData);
          if (!result.success) {
            toast.error(result.error ?? "Upload failed");
            return null;
          }
          return result.url!;
        });

        const newUrls = (await Promise.all(uploadPromises)).filter(
          Boolean
        ) as string[];

        if (multiple) {
          onChange([...currentUrls, ...newUrls]);
        } else if (newUrls.length > 0) {
          // Single mode: replace existing
          if (currentUrls[0]) {
            deleteImageAction(currentUrls[0]).catch(() => {});
          }
          onChange(newUrls[0]);
        }
      } catch {
        toast.error("Upload failed. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [canUpload, folder, entitySlug, multiple, value, onChange, maxFiles]
  );

  const handleRemove = useCallback(
    async (urlToRemove: string) => {
      deleteImageAction(urlToRemove).catch(() => {});
      if (multiple) {
        const currentUrls: string[] = Array.isArray(value)
          ? value.filter(Boolean)
          : value
            ? [value]
            : [];
        onChange(currentUrls.filter((u) => u !== urlToRemove));
      } else {
        onChange("");
      }
    },
    [multiple, value, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const showDropzone = multiple ? !atLimit : urls.length === 0;

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      {/* Preview grid */}
      {urls.length > 0 && (
        <div
          className={cn(
            "grid gap-3",
            multiple ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : ""
          )}
        >
          {urls.map((url) => (
            <div
              key={url}
              className={cn(
                "group relative overflow-hidden rounded-lg border bg-muted",
                multiple ? "aspect-square" : "aspect-[4/3] max-w-xs"
              )}
            >
              <Image
                src={url}
                alt=""
                fill
                className="object-cover"
                sizes={multiple ? "200px" : "320px"}
              />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute right-1.5 top-1.5 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
                <span className="sr-only">Remove</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropzone */}
      {showDropzone && (
        <div
          onClick={() => canUpload && !isUploading && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50",
            !canUpload && "cursor-not-allowed opacity-50",
            isUploading && "pointer-events-none"
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="mb-2 h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              {multiple ? (
                <ImagePlus className="mb-2 h-8 w-8 text-muted-foreground/50" />
              ) : (
                <Upload className="mb-2 h-8 w-8 text-muted-foreground/50" />
              )}
              <p className="text-sm text-muted-foreground">
                {canUpload
                  ? "Click or drag to upload"
                  : "Enter a slug first to enable upload"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                JPEG, PNG, WebP, AVIF, SVG &middot; Max 5MB
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
            e.target.value = "";
          }
        }}
      />

      {/* Replace button for single mode when image exists */}
      {!multiple && urls.length > 0 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canUpload || isUploading}
          onClick={() => inputRef.current?.click()}
        >
          Replace image
        </Button>
      )}
    </div>
  );
}
