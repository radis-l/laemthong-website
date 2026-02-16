"use client";

import { useState } from "react";
import Image from "next/image";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  productName: string;
};

export function ProductImageGallery({
  images,
  productName,
}: Props) {
  const allImages = images.filter((u) => u.startsWith("http"));

  const [selectedIndex, setSelectedIndex] = useState(0);

  if (allImages.length === 0) {
    return (
      <div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted">
          <PlaceholderImage
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
      <div className="relative overflow-hidden rounded-lg border bg-muted">
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
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {allImages.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              aria-label={`View image ${i + 1} of ${allImages.length}`}
              aria-current={i === selectedIndex ? "true" : undefined}
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

    </div>
  );
}
