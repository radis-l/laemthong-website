"use client";

import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import type { MediaSize } from "react-easy-crop";
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
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [coverZoom, setCoverZoom] = useState(1);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedAreaPixels | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  // Reset state when image changes (handles crop queue)
  useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCoverZoom(1);
    setMediaLoaded(false);
    setCroppedAreaPixels(null);
  }, [imageSrc]);

  const onMediaLoaded = useCallback(
    (mediaSize: MediaSize) => {
      const imageRatio = mediaSize.naturalWidth / mediaSize.naturalHeight;
      const computed = Math.max(
        imageRatio / aspectRatio,
        aspectRatio / imageRatio
      );
      setCoverZoom(computed);
      setMediaLoaded(true);
    },
    [aspectRatio]
  );

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

  const isFilled = mediaLoaded && zoom >= coverZoom - 0.01;
  const isFit = mediaLoaded && zoom <= 1.01;
  const maxZoom = Math.max(3, Math.ceil(coverZoom * 10) / 10);
  const showPresets = mediaLoaded && coverZoom > 1.01;

  const handleFit = () => {
    setZoom(1);
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

        <div className="relative h-[350px] w-full overflow-hidden rounded-md">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            objectFit="contain"
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            onMediaLoaded={onMediaLoaded}
            minZoom={1}
            maxZoom={maxZoom}
            style={{
              containerStyle: {
                background: "#f0f0f0",
              },
            }}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            {showPresets ? (
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant={isFit ? "default" : "outline"}
                  size="xs"
                  onClick={handleFit}
                >
                  <Minimize2 className="h-3 w-3" />
                  Fit
                </Button>
                <Button
                  type="button"
                  variant={isFilled ? "default" : "outline"}
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
              {!mediaLoaded ? (
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
              min={1}
              max={maxZoom}
              step={0.1}
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
          <Button onClick={handleConfirm} disabled={isCropping}>
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
