type PixelCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const MAX_DIMENSION = 1600;

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
  pixelCrop: PixelCrop
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  let outW = pixelCrop.width;
  let outH = pixelCrop.height;

  // Resize if larger than max dimension
  if (outW > MAX_DIMENSION || outH > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / Math.max(outW, outH);
    outW = Math.round(outW * scale);
    outH = Math.round(outH * scale);
  }

  canvas.width = outW;
  canvas.height = outH;

  // Fill with white to handle areas outside the source image.
  // react-easy-crop can return negative x/y when objectFit="contain"
  // and the crop area extends beyond the image bounds.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, outW, outH);

  const natW = image.naturalWidth;
  const natH = image.naturalHeight;

  // Clamp source rectangle to actual image bounds
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

  // Scale destination to match output canvas size
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
