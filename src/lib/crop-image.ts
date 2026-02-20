type PixelCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const DEFAULT_MAX_DIMENSION = 1600;

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (e) => reject(e));
    image.src = url;
  });
}

export async function cropImage(
  imageSrc: string,
  pixelCrop: PixelCrop,
  options?: { stretchToFill?: boolean; maxDimension?: number }
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  let outW = pixelCrop.width;
  let outH = pixelCrop.height;

  // Resize if larger than max dimension
  const maxDim = options?.maxDimension ?? DEFAULT_MAX_DIMENSION;
  if (outW > maxDim || outH > maxDim) {
    const scale = maxDim / Math.max(outW, outH);
    outW = Math.round(outW * scale);
    outH = Math.round(outH * scale);
  }

  canvas.width = outW;
  canvas.height = outH;

  const natW = image.naturalWidth;
  const natH = image.naturalHeight;

  if (options?.stretchToFill) {
    // Fill mode: clamp source to image bounds, stretch to fill entire canvas.
    // The stretch is imperceptible (~1-2px over 1600px) and eliminates white gaps
    // caused by float→int rounding in react-easy-crop coordinates.
    const sx = Math.max(0, pixelCrop.x);
    const sy = Math.max(0, pixelCrop.y);
    const sw = Math.min(pixelCrop.width, natW - sx);
    const sh = Math.min(pixelCrop.height, natH - sy);

    if (sw > 0 && sh > 0) {
      ctx.drawImage(image, sx, sy, sw, sh, 0, 0, outW, outH);
    }
  } else {
    // Fit mode: white-fill background with proportional clamping.
    // react-easy-crop can return negative x/y when objectFit="contain"
    // and the crop area extends beyond the image bounds.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outW, outH);

    let sx = pixelCrop.x;
    let sy = pixelCrop.y;
    let sw = pixelCrop.width;
    let sh = pixelCrop.height;
    let dx = 0;
    let dy = 0;
    let dw = pixelCrop.width;
    let dh = pixelCrop.height;

    if (sx < 0) {
      const clip = -sx;
      dx += clip;
      dw -= clip;
      sw -= clip;
      sx = 0;
    }
    if (sy < 0) {
      const clip = -sy;
      dy += clip;
      dh -= clip;
      sh -= clip;
      sy = 0;
    }
    if (sx + sw > natW) {
      const excess = sx + sw - natW;
      sw -= excess;
      dw -= excess;
    }
    if (sy + sh > natH) {
      const excess = sy + sh - natH;
      sh -= excess;
      dh -= excess;
    }

    const outputScale = outW / pixelCrop.width;

    if (sw > 0 && sh > 0) {
      ctx.drawImage(
        image,
        sx,
        sy,
        sw,
        sh,
        dx * outputScale,
        dy * outputScale,
        dw * outputScale,
        dh * outputScale
      );
    }
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      "image/webp",
      0.85
    );
  });
}
