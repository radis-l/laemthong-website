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

    // products/{slug}/{N}.ext or products/{slug}/image-{N}.ext
    const numberedMatch = path.match(
      /^products\/([^/]+)\/(?:image-)?(\d+)\.(jpg|jpeg|png|webp|avif|svg)$/i
    );

    if (!numberedMatch) continue;

    const slug = numberedMatch[1];
    const order = parseInt(numberedMatch[2], 10);

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
