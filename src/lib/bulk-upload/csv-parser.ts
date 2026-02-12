import Papa from "papaparse";
import type { ParsedProductRow } from "./types";

export function parseProductCSV(csvText: string): ParsedProductRow[] {
  const result = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  if (result.errors.length > 0) {
    throw new Error(
      `CSV parsing error: ${result.errors.map((e) => e.message).join(", ")}`
    );
  }

  return result.data.map((row, index) => ({
    index: index + 1,
    data: {
      slug: row.slug?.trim() || "",
      nameTh: row.name_th?.trim() || "",
      nameEn: row.name_en?.trim() || "",
      shortDescriptionTh: row.short_description_th?.trim() || "",
      shortDescriptionEn: row.short_description_en?.trim() || "",
      descriptionTh: row.description_th?.trim() || "",
      descriptionEn: row.description_en?.trim() || "",
      categorySlug: row.category_slug?.trim() || "",
      brandSlug: row.brand_slug?.trim() || "",
      featured: row.featured?.trim() || undefined,
      sortOrder: row.sort_order ? parseInt(row.sort_order, 10) : 0,
      // Complex fields omitted for CSV format
      gallery: undefined,
      specifications: undefined,
      features: undefined,
      documents: undefined,
      image: undefined,
    },
  }));
}
