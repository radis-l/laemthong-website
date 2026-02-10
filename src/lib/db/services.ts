import { createSupabaseClient } from "@/lib/supabase";
import type { Service, DbService } from "@/data/types";

function toService(row: DbService): Service {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    icon: row.icon,
    features: row.features,
    sortOrder: row.sort_order,
  };
}

export async function getAllServices(): Promise<Service[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order");
  if (error) return [];
  return (data as DbService[]).map(toService);
}
