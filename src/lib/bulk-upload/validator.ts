import { productSchema } from "@/lib/validations/product";
import { adminGetAllBrands, adminGetAllCategories } from "@/lib/db/admin";
import type {
  ParsedProductRow,
  ValidationResult,
  ImageMap,
} from "./types";

export async function validateProductRows(
  rows: ParsedProductRow[],
  imageMap: ImageMap
): Promise<ValidationResult[]> {
  // Fetch brands and categories once for all validations
  const [brands, categories] = await Promise.all([
    adminGetAllBrands(),
    adminGetAllCategories(),
  ]);

  const brandSlugs = new Set(brands.map((b) => b.slug));
  const categorySlugs = new Set(categories.map((c) => c.slug));
  const seenSlugs = new Set<string>();

  return rows.map((row) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Zod validation
    const validated = productSchema.safeParse(row.data);
    if (!validated.success) {
      errors.push(
        ...validated.error.issues.map(
          (e) => `${e.path.join(".")}: ${e.message}`
        )
      );
    }

    // Foreign key validation with auto-creation tracking
    if (row.data.brandSlug && !brandSlugs.has(row.data.brandSlug)) {
      warnings.push(
        `Brand '${row.data.brandSlug}' will be auto-created with minimal data`
      );
      brandSlugs.add(row.data.brandSlug); // Mark for creation
    }

    if (row.data.categorySlug && !categorySlugs.has(row.data.categorySlug)) {
      warnings.push(
        `Category '${row.data.categorySlug}' will be auto-created with minimal data`
      );
      categorySlugs.add(row.data.categorySlug); // Mark for creation
    }

    // Duplicate slug detection
    if (seenSlugs.has(row.data.slug)) {
      errors.push(`Duplicate slug '${row.data.slug}' in this batch`);
    }
    seenSlugs.add(row.data.slug);

    // Image warnings
    const images = imageMap[row.data.slug];
    if (!images?.main) {
      warnings.push("No main image provided");
    }

    return {
      row,
      status:
        errors.length > 0 ? "error" : warnings.length > 0 ? "warning" : "valid",
      errors,
      warnings,
      images,
    };
  });
}
