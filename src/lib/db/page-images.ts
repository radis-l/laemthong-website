import { createSupabaseClient } from "@/lib/supabase";
import type { DbPageImage } from "@/data/types";

export async function getPageImages(): Promise<Map<string, string>> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("page_images").select("*");

  if (error || !data) return new Map();

  const map = new Map<string, string>();
  for (const row of data as DbPageImage[]) {
    map.set(row.key, row.image_url);
  }
  return map;
}

export async function getPageImage(key: string): Promise<string | null> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("page_images")
    .select("image_url")
    .eq("key", key)
    .single();

  if (error || !data) return null;
  return (data as DbPageImage).image_url;
}
