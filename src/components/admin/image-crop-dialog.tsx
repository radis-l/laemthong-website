"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Cropper from "react-easy-crop";
import { cropImage } from "@/lib/crop-image";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Loader2, Minimize2, Maximize2 } from "lucide-react";

type CroppedAreaPixels = {
  x: number;
  y: number;
  width: number;
  height: number;
};

interface ImageCropDialogProps {
  open: boolean;
  imageSrc: string;
  aspectRatio: number;
  onCrop: (blob: Blob) => void;
  onCancel: () => void;
}

export function ImageCropDialog({
  open,
  imageSrc,
  aspectRatio,
  onCrop,
  onCancel,
}: ImageCropDialogProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [fitZoom, setFitZoom] = useState(1);
  const [coverZoom, setCoverZoom] = useState(1);
  const [ready, setReady] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedAreaPixels | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [cropSize, setCropSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // Reset state when image changes (handles crop queue)
  useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setFitZoom(1);
    setCoverZoom(1);
    setReady(false);
    setCroppedAreaPixels(null);
    setCropSize(null);
  }, [imageSrc]);

  // Pre-load image and compute crop size, fit/cover zoom before rendering Cropper.
  // Uses rAF retry because Radix Dialog portal content may not have layout
  // dimensions on the first useEffect call.
  useEffect(() => {
    let cancelled = false;

    function tryMeasure() {
      if (cancelled) return;

      const el = containerRef.current;
      if (!el) {
        requestAnimationFrame(tryMeasure);
        return;
      }

      // Use offsetWidth/offsetHeight instead of getBoundingClientRect() —
      // the latter reflects CSS transforms, so during the dialog's zoom-in-95
      // entry animation it returns ~95% of the final size, making the crop box
      // permanently too small.
      const cW = el.offsetWidth;
      const cH = el.offsetHeight;

      if (cW === 0 || cH === 0) {
        requestAnimationFrame(tryMeasure);
        return;
      }

      // Crop area fills the container at the given aspect ratio.
      let cropW: number, cropH: number;
      if (cW / cH > aspectRatio) {
        cropH = cH;
        cropW = cH * aspectRatio;
      } else {
        cropW = cW;
        cropH = cW / aspectRatio;
      }

      const img = new Image();
      img.onload = () => {
        if (cancelled) return;

        // Compute displayed image size (objectFit: contain in container).
        // react-easy-crop scales the image to fit the CONTAINER at zoom=1
        // (via CSS max-width/max-height: 100%), not the crop area.
        const imageAspect = img.naturalWidth / img.naturalHeight;
        const containerAspect = cW / cH;
        let imgW: number, imgH: number;
        if (imageAspect > containerAspect) {
          imgW = cW;
          imgH = cW / imageAspect;
        } else {
          imgH = cH;
          imgW = cH * imageAspect;
        }

        // fit: zoom so entire image is inside the crop area
        // cover: zoom so image completely fills the crop area
        const fit = Math.min(cropW / imgW, cropH / imgH, 1);
        const cover = Math.max(cropW / imgW, cropH / imgH, 1);

        setCropSize({ width: cropW, height: cropH });
        setFitZoom(fit);
        setCoverZoom(cover);
        setZoom(cover);
        setCrop({ x: 0, y: 0 });
        setReady(true);
      };
      img.onerror = () => {
        if (cancelled) return;
        console.error("[ImageCropDialog] Failed to load image:", imageSrc);
      };
      img.src = imageSrc;
    }

    requestAnimationFrame(tryMeasure);

    return () => {
      cancelled = true;
    };
  }, [imageSrc, aspectRatio]);

  const onCropComplete = useCallback(
    (_croppedArea: unknown, pixels: CroppedAreaPixels) => {
      setCroppedAreaPixels(pixels);
    },
    []
  );

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setIsCropping(true);
    try {
      const blob = await cropImage(imageSrc, croppedAreaPixels);
      onCrop(blob);
    } catch {
      onCancel();
    } finally {
      setIsCropping(false);
    }
  };

  const isFilled = ready && zoom >= coverZoom - 0.01;
  const isFit = ready && zoom <= fitZoom + 0.01;
  const maxZoom = Math.max(3, Math.ceil(coverZoom * 10) / 10);
  const showPresets = ready;

  const handleFit = () => {
    setZoom(fitZoom);
    setCrop({ x: 0, y: 0 });
  };

  const handleFill = () => {
    setZoom(coverZoom);
    setCrop({ x: 0, y: 0 });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="sm:max-w-xl" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>

        <div
          ref={containerRef}
          className="relative h-80 w-full overflow-hidden rounded-md"
        >
          {ready && cropSize ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              cropSize={cropSize}
              objectFit="contain"
              restrictPosition={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              minZoom={fitZoom}
              maxZoom={maxZoom}
              style={{
                containerStyle: {
                  background: "#f0f0f0",
                },
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted/30">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            {showPresets ? (
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant={isFit ? "accent" : "outline"}
                  size="xs"
                  onClick={handleFit}
                >
                  <Minimize2 className="h-3 w-3" />
                  Fit
                </Button>
                <Button
                  type="button"
                  variant={isFilled ? "accent" : "outline"}
                  size="xs"
                  onClick={handleFill}
                >
                  <Maximize2 className="h-3 w-3" />
                  Fill
                </Button>
              </div>
            ) : (
              <span />
            )}
            <p className="text-xs text-muted-foreground">
              {!ready ? (
                <span className="text-muted-foreground/50">Loading...</span>
              ) : isFit && showPresets ? (
                "White padding will be added"
              ) : isFilled ? (
                <span className="inline-flex items-center gap-1 text-emerald-600">
                  <Check className="h-3 w-3" />
                  Frame filled
                </span>
              ) : (
                "Zoom in to fill the frame"
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Zoom</span>
            <Slider
              min={fitZoom}
              max={maxZoom}
              step={0.01}
              value={[zoom]}
              onValueChange={(v) => setZoom(v[0])}
              className="flex-1"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isCropping}>
            Cancel
          </Button>
          <Button variant="accent" onClick={handleConfirm} disabled={isCropping}>
            {isCropping ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cropping...
              </>
            ) : (
              "Crop & Upload"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
