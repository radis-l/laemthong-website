"use client";

import { useState, useCallback } from "react";
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
import { Loader2 } from "lucide-react";

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
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedAreaPixels | null>(null);
  const [isCropping, setIsCropping] = useState(false);

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

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="sm:max-w-xl" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>

        <div className="relative h-[350px] w-full overflow-hidden rounded-md bg-muted">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Zoom</span>
          <Slider
            min={1}
            max={3}
            step={0.1}
            value={[zoom]}
            onValueChange={(v) => setZoom(v[0])}
            className="flex-1"
          />
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
