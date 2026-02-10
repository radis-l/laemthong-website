import { createSupabaseClient } from "@/lib/supabase";
import type { CompanyInfo, DbCompanyInfo } from "@/data/types";

function toCompanyInfo(row: DbCompanyInfo): CompanyInfo {
  return {
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    yearEstablished: row.year_established,
    address: row.address,
    phone: row.phone,
    email: row.email,
    lineId: row.line_id ?? undefined,
    mapUrl: row.map_url,
    coordinates: row.coordinates,
  };
}

export async function getCompanyInfo(): Promise<CompanyInfo | null> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("company_info")
    .select("*")
    .single();
  if (error) return null;
  return toCompanyInfo(data as DbCompanyInfo);
}
