import {
  adminGetBrandBySlug,
  adminGetCategoryBySlug,
  adminGetProductBySlug,
  adminCreateBrand,
  adminCreateCategory,
  adminCreateProduct,
  adminUpdateProduct,
} from "@/lib/db/admin";
import { uploadImage } from "@/lib/storage";
import type { ValidationResult, ImportOptions, ImportEvent } from "./types";

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function* importProducts(
  validatedRows: ValidationResult[],
  options: ImportOptions
): AsyncGenerator<ImportEvent> {
  const stats = { created: 0, updated: 0, skipped: 0, failed: 0 };
  const failures: { slug: string; error: string }[] = [];

  for (let i = 0; i < validatedRows.length; i++) {
    const result = validatedRows[i];

    // Skip rows with errors (if option enabled)
    if (result.status === "error" && options.skipErrors) {
      stats.skipped++;
      yield {
        type: "skipped",
        slug: result.row.data.slug,
        reason: result.errors.join("; "),
      };
      continue;
    }

    // Skip rows with errors (if skipErrors is false, they shouldn't be in the list)
    if (result.status === "error" && !options.skipErrors) {
      stats.skipped++;
      yield {
        type: "skipped",
        slug: result.row.data.slug,
        reason: "Has validation errors",
      };
      continue;
    }

    try {
      // Auto-create brand if needed
      if (
        result.row.data.brandSlug &&
        !(await adminGetBrandBySlug(result.row.data.brandSlug))
      ) {
        await adminCreateBrand({
          slug: result.row.data.brandSlug,
          name: slugToTitle(result.row.data.brandSlug),
          description: { th: "", en: "" },
          logo: "",
          website: null,
          country: "",
          sort_order: 999,
        });
      }

      // Auto-create category if needed
      if (
        result.row.data.categorySlug &&
        !(await adminGetCategoryBySlug(result.row.data.categorySlug))
      ) {
        await adminCreateCategory({
          slug: result.row.data.categorySlug,
          name: {
            th: slugToTitle(result.row.data.categorySlug),
            en: slugToTitle(result.row.data.categorySlug),
          },
          description: { th: "", en: "" },
          image: "",
          icon: "Package",
          sort_order: 999,
        });
      }

      // Upload images if available
      let mainImageUrl = "";
      const galleryUrls: string[] = [];

      const images = result.images;
      if (images?.main) {
        mainImageUrl = await uploadImage(
          "products",
          result.row.data.slug,
          images.main
        );
      }
      if (images?.gallery && images.gallery.length > 0) {
        for (const galleryImg of images.gallery) {
          const url = await uploadImage(
            "products",
            result.row.data.slug,
            galleryImg
          );
          galleryUrls.push(url);
        }
      }

      // Create/update product
      const productData = {
        slug: result.row.data.slug,
        category_slug: result.row.data.categorySlug,
        brand_slug: result.row.data.brandSlug,
        name: {
          th: result.row.data.nameTh,
          en: result.row.data.nameEn,
        },
        short_description: {
          th: result.row.data.shortDescriptionTh,
          en: result.row.data.shortDescriptionEn,
        },
        description: {
          th: result.row.data.descriptionTh,
          en: result.row.data.descriptionEn,
        },
        image: mainImageUrl || "",
        gallery: galleryUrls,
        specifications: [],
        features: [],
        documents: [],
        featured:
          result.row.data.featured === "true" ||
          result.row.data.featured === "1",
        sort_order: result.row.data.sortOrder,
      };

      // Check if exists (for update vs create)
      const existing = await adminGetProductBySlug(result.row.data.slug);

      if (existing) {
        if (options.overwriteExisting) {
          await adminUpdateProduct(result.row.data.slug, productData);
          stats.updated++;
          yield {
            type: "success",
            slug: result.row.data.slug,
            action: "updated",
          };
        } else {
          stats.skipped++;
          yield {
            type: "skipped",
            slug: result.row.data.slug,
            reason: "Already exists (overwrite disabled)",
          };
        }
      } else {
        await adminCreateProduct(productData);
        stats.created++;
        yield {
          type: "success",
          slug: result.row.data.slug,
          action: "created",
        };
      }

      // Progress update
      yield {
        type: "progress",
        current: i + 1,
        total: validatedRows.length,
        slug: result.row.data.slug,
      };
    } catch (error) {
      stats.failed++;
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      failures.push({ slug: result.row.data.slug, error: errorMsg });
      yield { type: "error", slug: result.row.data.slug, error: errorMsg };
    }
  }

  yield { type: "complete", stats: { ...stats, total: validatedRows.length, failures } };
}
