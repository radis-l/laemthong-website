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

  const imageTemp: Record<
    string,
    { file: File; order: number }[]
  > = {};

  for (const [path, file] of Object.entries(loaded.files)) {
    if (file.dir) continue;
    if (!isValidImageExtension(path)) continue;

    // New format: products/{slug}/{N}.ext or products/{slug}/image-{N}.ext
    const numberedMatch = path.match(
      /^products\/([^/]+)\/(?:image-)?(\d+)\.(jpg|jpeg|png|webp|avif|svg)$/i
    );
    // Legacy: main.ext or image.ext (treated as first image)
    const mainMatch = path.match(
      /^products\/([^/]+)\/(main|image)\.(jpg|jpeg|png|webp|avif|svg)$/i
    );
    // Legacy: gallery-N.ext (treated as subsequent images)
    const galleryMatch = path.match(
      /^products\/([^/]+)\/gallery-(\d+)\.(jpg|jpeg|png|webp|avif|svg)$/i
    );

    let slug: string | null = null;
    let order: number | null = null;

    if (numberedMatch) {
      slug = numberedMatch[1];
      order = parseInt(numberedMatch[2], 10);
    } else if (mainMatch) {
      slug = mainMatch[1];
      order = 0; // main always first
    } else if (galleryMatch) {
      slug = galleryMatch[1];
      // Offset gallery numbers to sort after main (order 0)
      order = parseInt(galleryMatch[2], 10) + 1000;
    }

    if (!slug || order === null) continue;

    const blob = await file.async("blob");
    const imageFile = new File([blob], path, { type: getImageMimeType(path) });

    if (!imageTemp[slug]) imageTemp[slug] = [];
    imageTemp[slug].push({ file: imageFile, order });
  }

  // Sort by order and build imageMap
  const imageMap: ImageMap = {};
  for (const [slug, items] of Object.entries(imageTemp)) {
    items.sort((a, b) => a.order - b.order);
    imageMap[slug] = { images: items.map((i) => i.file) };
  }

  return imageMap;
}
