"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { getCategoryIcon } from "@/lib/category-icons";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  productName: string;
  categorySlug: string;
};

export function ProductImageGallery({
  images,
  productName,
  categorySlug,
}: Props) {
  const allImages = images.filter((u) => u.startsWith("http"));

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goTo = useCallback(
    (dir: -1 | 1) => {
      setSelectedIndex((prev) => {
        const next = prev + dir;
        if (next < 0) return allImages.length - 1;
        if (next >= allImages.length) return 0;
        return next;
      });
    },
    [allImages.length],
  );

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goTo(-1);
      if (e.key === "ArrowRight") goTo(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, goTo]);

  if (allImages.length === 0) {
    return (
      <div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted">
          <PlaceholderImage
            icon={getCategoryIcon(categorySlug)}
            variant="product"
            aspect="aspect-[4/3]"
            className="h-full"
          />
        </div>
      </div>
    );
  }

  const displayImage = allImages[selectedIndex] ?? allImages[0];

  return (
    <div>
      {/* Main image */}
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="relative block w-full cursor-zoom-in overflow-hidden rounded-lg border bg-muted"
      >
        <div className="relative aspect-[4/3]">
          <Image
            src={displayImage}
            alt={productName}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          {allImages.length > 1 && (
            <div className="absolute bottom-3 right-3 rounded-full bg-foreground/70 px-2.5 py-1 text-xs font-medium text-background backdrop-blur-sm">
              {selectedIndex + 1} / {allImages.length}
            </div>
          )}
        </div>
      </button>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {allImages.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border bg-muted transition-all",
                i === selectedIndex
                  ? "ring-2 ring-primary ring-offset-1"
                  : "opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={url}
                alt={`${productName} - ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 25vw, 12vw"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          className="max-w-[90vw] max-h-[90vh] p-0 border-0 bg-black/95 sm:max-w-5xl"
          showCloseButton={true}
        >
          <DialogTitle className="sr-only">{productName}</DialogTitle>
          <div className="relative flex items-center justify-center">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={allImages[selectedIndex]}
                alt={`${productName} - ${selectedIndex + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>

            {/* Navigation */}
            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => goTo(-1)}
                  className="absolute left-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(1)}
                  className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white/80">
                  {selectedIndex + 1} / {allImages.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
