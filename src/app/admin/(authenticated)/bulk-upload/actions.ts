"use server";

import { parseProductCSV } from "@/lib/bulk-upload/csv-parser";
import { extractImagesFromZip } from "@/lib/bulk-upload/zip-handler";
import { validateProductRows } from "@/lib/bulk-upload/validator";
import type {
  ClientValidationResult,
  ValidationStats,
} from "@/lib/bulk-upload/types";

export async function parseAndValidateAction(formData: FormData): Promise<{
  success: boolean;
  rows?: ClientValidationResult[];
  stats?: ValidationStats;
  error?: string;
}> {
  try {
    const csvFile = formData.get("csv") as File;
    const zipFile = formData.get("zip") as File | null;

    if (!csvFile) {
      return { success: false, error: "CSV file is required" };
    }

    // Parse CSV
    const csvText = await csvFile.text();
    const parsedRows = parseProductCSV(csvText);

    if (parsedRows.length === 0) {
      return { success: false, error: "CSV file is empty or invalid" };
    }

    // Extract images from ZIP
    const imageMap = zipFile ? await extractImagesFromZip(zipFile) : {};

    // Validate rows
    const validated = await validateProductRows(parsedRows, imageMap);

    // Calculate stats
    const stats: ValidationStats = {
      total: validated.length,
      valid: validated.filter((v) => v.status === "valid").length,
      warnings: validated.filter((v) => v.status === "warning").length,
      errors: validated.filter((v) => v.status === "error").length,
    };

    // Convert to client-safe format: strip File objects, add serializable metadata
    const clientRows: ClientValidationResult[] = validated.map((v) => ({
      row: v.row,
      status: v.status,
      errors: v.errors,
      warnings: v.warnings,
      imageInfo: v.images
        ? { hasMain: !!v.images.main, galleryCount: v.images.gallery.length }
        : undefined,
    }));

    return { success: true, rows: clientRows, stats };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to parse and validate",
    };
  }
}

export async function generateTemplateAction(): Promise<string> {
  const template = `slug,category_slug,brand_slug,name_th,name_en,short_description_th,short_description_en,description_th,description_en,featured,sort_order
example-product-1,welding-machines,lincoln-electric,ชื่อผลิตภัณฑ์,Product Name,คำอธิบายสั้น,Short description here,คำอธิบายยาว,Long description here,false,1
example-product-2,cutting-equipment,harris,ชื่อสินค้า,Another Product,รายละเอียดย่อ,Brief details,รายละเอียดเต็ม,Full details,true,2`;

  return template;
}
