import JSZip from "jszip";
import type { ImageMap } from "./types";

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif", "svg"];

function getImageMimeType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "avif":
      return "image/avif";
    case "svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

function isValidImageExtension(filename: string): boolean {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext ? ALLOWED_EXTENSIONS.includes(ext) : false;
}

export async function extractImagesFromZip(
  zipFile: File | Blob
): Promise<ImageMap> {
  const zip = new JSZip();
  const loaded = await zip.loadAsync(await zipFile.arrayBuffer());

  const imageMap: ImageMap = {};
  const galleryTemp: Record<
    string,
    { file: File; num: number; name: string }[]
  > = {};

  for (const [path, file] of Object.entries(loaded.files)) {
    if (file.dir) continue;

    // Parse: products/{slug}/main.jpg, products/{slug}/image.jpg, or products/{slug}/gallery-1.jpg
    const mainMatch = path.match(
      /^products\/([^/]+)\/(main|image)\.(jpg|jpeg|png|webp|avif|svg)$/i
    );
    const galleryMatch = path.match(
      /^products\/([^/]+)\/gallery-(\d+)\.(jpg|jpeg|png|webp|avif|svg)$/i
    );

    if (!mainMatch && !galleryMatch) continue;
    if (!isValidImageExtension(path)) continue;

    const blob = await file.async("blob");
    const imageFile = new File([blob], path, { type: getImageMimeType(path) });

    if (mainMatch) {
      // Main image
      const slug = mainMatch[1];
      if (!imageMap[slug]) {
        imageMap[slug] = { gallery: [] };
      }
      imageMap[slug].main = imageFile;
    } else if (galleryMatch) {
      // Gallery image
      const slug = galleryMatch[1];
      const galleryNum = parseInt(galleryMatch[2], 10);

      if (!galleryTemp[slug]) {
        galleryTemp[slug] = [];
      }
      galleryTemp[slug].push({ file: imageFile, num: galleryNum, name: path });
    }
  }

  // Sort gallery images numerically and add to imageMap
  for (const [slug, images] of Object.entries(galleryTemp)) {
    if (!imageMap[slug]) {
      imageMap[slug] = { gallery: [] };
    }
    // Sort numerically by gallery number
    images.sort((a, b) => a.num - b.num);
    imageMap[slug].gallery = images.map((g) => g.file);
  }

  return imageMap;
}
