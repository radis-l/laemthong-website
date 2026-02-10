import { createSupabaseAdminClient } from "@/lib/supabase";

const BUCKET = "images";

export type ImageFolder = "products" | "brands" | "categories";

/**
 * Upload a single image file to Supabase Storage.
 * Returns the public URL of the uploaded file.
 */
export async function uploadImage(
  folder: ImageFolder,
  entitySlug: string,
  file: File
): Promise<string> {
  const supabase = createSupabaseAdminClient();

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const path = `${folder}/${entitySlug}/${safeName}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type,
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return publicUrl;
}

/**
 * Delete a single image from storage by its public URL.
 */
export async function deleteImage(publicUrl: string): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const path = extractPathFromUrl(publicUrl);
  if (!path) return;

  const { error } = await supabase.storage.from(BUCKET).remove([path]);

  if (error) {
    console.error(`Failed to delete image: ${error.message}`);
  }
}

/**
 * Delete all images in a folder (e.g., when deleting a product).
 */
export async function deleteImageFolder(
  folder: ImageFolder,
  entitySlug: string
): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const prefix = `${folder}/${entitySlug}`;

  const { data: files, error: listError } = await supabase.storage
    .from(BUCKET)
    .list(prefix);

  if (listError || !files || files.length === 0) return;

  const paths = files.map((f) => `${prefix}/${f.name}`);
  const { error } = await supabase.storage.from(BUCKET).remove(paths);

  if (error) {
    console.error(`Failed to delete folder: ${error.message}`);
  }
}

function extractPathFromUrl(publicUrl: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
}
