"use server";

import { parseProductCSV } from "@/lib/bulk-upload/csv-parser";
import { extractImagesFromZip } from "@/lib/bulk-upload/zip-handler";
import { validateProductRows, validateImageOnlyRows } from "@/lib/bulk-upload/validator";
import { adminGetAllProducts } from "@/lib/db/admin";
import type {
  ClientValidationResult,
  ImageOnlyValidationResult,
  UploadMode,
  ValidationStats,
} from "@/lib/bulk-upload/types";

export async function parseAndValidateAction(formData: FormData): Promise<{
  success: boolean;
  uploadMode?: UploadMode;
  rows?: ClientValidationResult[];
  imageOnlyRows?: ImageOnlyValidationResult[];
  stats?: ValidationStats;
  error?: string;
}> {
  try {
    const csvFile = formData.get("csv") as File | null;
    const zipFile = formData.get("zip") as File | null;

    if (!csvFile && !zipFile) {
      return { success: false, error: "At least one file (CSV or ZIP) is required" };
    }

    const uploadMode: UploadMode = csvFile && zipFile
      ? "csv-and-zip"
      : csvFile
        ? "csv-only"
        : "zip-only";

    // ZIP-only path: validate images against existing products
    if (uploadMode === "zip-only") {
      const imageMap = await extractImagesFromZip(zipFile!);

      if (Object.keys(imageMap).length === 0) {
        return { success: false, error: "No product image folders found in ZIP. Expected structure: products/[slug]/main.jpg" };
      }

      const imageOnlyRows = await validateImageOnlyRows(imageMap);

      const existingCount = imageOnlyRows.filter((r) => r.productExists).length;
      const newCount = imageOnlyRows.filter((r) => !r.productExists).length;

      const stats: ValidationStats = {
        total: imageOnlyRows.length,
        valid: existingCount,
        warnings: newCount,
        errors: 0,
      };

      return { success: true, uploadMode, imageOnlyRows, stats };
    }

    // CSV path (csv-only or csv-and-zip)
    const csvText = await csvFile!.text();
    const parsedRows = parseProductCSV(csvText);

    if (parsedRows.length === 0) {
      return { success: false, error: "CSV file is empty or invalid" };
    }

    const imageMap = zipFile ? await extractImagesFromZip(zipFile) : {};
    const validated = await validateProductRows(parsedRows, imageMap);

    const stats: ValidationStats = {
      total: validated.length,
      valid: validated.filter((v) => v.status === "valid").length,
      warnings: validated.filter((v) => v.status === "warning").length,
      errors: validated.filter((v) => v.status === "error").length,
    };

    const clientRows: ClientValidationResult[] = validated.map((v) => ({
      row: v.row,
      status: v.status,
      errors: v.errors,
      warnings: v.warnings,
      imageInfo: v.images
        ? { hasMain: !!v.images.main, galleryCount: v.images.gallery.length }
        : undefined,
    }));

    return { success: true, uploadMode, rows: clientRows, stats };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to parse and validate",
    };
  }
}

function csvEscapeRow(values: string[]): string {
  return values
    .map((v) => {
      if (v.includes(",") || v.includes('"') || v.includes("\n")) {
        return `"${v.replace(/"/g, '""')}"`;
      }
      return v;
    })
    .join(",");
}

export async function exportProductsAction(): Promise<{
  csv: string;
  isTemplate: boolean;
}> {
  const products = await adminGetAllProducts();

  const headers = [
    "slug",
    "category_slug",
    "brand_slug",
    "name_th",
    "name_en",
    "short_description_th",
    "short_description_en",
    "description_th",
    "description_en",
    "featured",
    "sort_order",
    "spec_labels_th",
    "spec_labels_en",
    "spec_values_th",
    "spec_values_en",
    "features_th",
    "features_en",
  ];

  if (products.length === 0) {
    // Fallback: template with example rows
    const row1 = csvEscapeRow([
      "example-product-1",
      "welding-machines",
      "lincoln-electric",
      "ชื่อผลิตภัณฑ์",
      "Product Name",
      "คำอธิบายสั้น",
      "Short description here",
      "คำอธิบายยาว",
      "Long description here",
      "false",
      "1",
      "น้ำหนัก|แรงดันไฟฟ้า|กำลังไฟ",
      "Weight|Voltage|Power",
      "50 กก.|220V|3000 วัตต์",
      "50 kg|220V|3000 W",
      "ประหยัดพลังงาน|ทนทาน",
      "Energy efficient|Durable",
    ]);

    const row2 = csvEscapeRow([
      "example-product-2",
      "cutting-equipment",
      "harris",
      "ชื่อสินค้า",
      "Another Product",
      "รายละเอียดย่อ",
      "Brief details",
      "รายละเอียดเต็ม",
      "Full details",
      "true",
      "2",
      "",
      "",
      "",
      "",
      "ใช้งานง่าย",
      "Easy to use",
    ]);

    return {
      csv: `${headers.join(",")}\n${row1}\n${row2}`,
      isTemplate: true,
    };
  }

  const rows = products.map((p) => {
    const specs = (p.specifications || []) as {
      label: { th: string; en: string };
      value: { th: string; en: string };
    }[];
    const feats = (p.features || []) as { th: string; en: string }[];

    return csvEscapeRow([
      p.slug,
      p.category_slug,
      p.brand_slug,
      (p.name as { th: string; en: string }).th,
      (p.name as { th: string; en: string }).en,
      (p.short_description as { th: string; en: string }).th,
      (p.short_description as { th: string; en: string }).en,
      (p.description as { th: string; en: string }).th,
      (p.description as { th: string; en: string }).en,
      String(p.featured),
      String(p.sort_order),
      specs.map((s) => s.label.th).join("|"),
      specs.map((s) => s.label.en).join("|"),
      specs.map((s) => s.value.th).join("|"),
      specs.map((s) => s.value.en).join("|"),
      feats.map((f) => f.th).join("|"),
      feats.map((f) => f.en).join("|"),
    ]);
  });

  return {
    csv: [headers.join(","), ...rows].join("\n"),
    isTemplate: false,
  };
}
