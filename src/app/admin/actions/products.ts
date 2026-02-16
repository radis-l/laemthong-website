"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { productSchema } from "@/lib/validations/product";
import {
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} from "@/lib/db/admin";
import { deleteImageFolder, moveImageFolder } from "@/lib/storage";
import { slugify } from "@/lib/utils";
import { createSupabaseAdminClient } from "@/lib/supabase";
import type { LocalizedString } from "@/data/types";

export type ProductFormState = {
  success?: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

function parseJsonOrDefault<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const validated = productSchema.safeParse({
    slug: formData.get("slug") || undefined,
    nameTh: formData.get("nameTh"),
    nameEn: formData.get("nameEn"),
    shortDescriptionTh: formData.get("shortDescriptionTh"),
    shortDescriptionEn: formData.get("shortDescriptionEn"),
    descriptionTh: formData.get("descriptionTh"),
    descriptionEn: formData.get("descriptionEn"),
    categorySlug: formData.get("categorySlug"),
    brandSlug: formData.get("brandSlug"),
    images: formData.get("images") || undefined,
    specifications: formData.get("specifications") || undefined,
    features: formData.get("features") || undefined,
    documents: formData.get("documents") || undefined,
    featured: formData.get("featured") || undefined,
    sortOrder: formData.get("sortOrder") || undefined,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  // Auto-generate slug from English name if not provided
  const slug = validated.data.slug || slugify(validated.data.nameEn);

  // Auto-calculate sort order with gap of 10 if not provided
  let sortOrder = validated.data.sortOrder ?? 0;
  if (validated.data.sortOrder === undefined) {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase
      .from("products")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .single();
    sortOrder = (data?.sort_order ?? -10) + 10;
  }

  // Handle image migration from temporary slug to final slug
  let images = parseJsonOrDefault<string[]>(validated.data.images, []);
  if (images.length > 0 && images[0].includes('/products/temp-')) {
    // Extract temp slug from first image URL
    const tempSlugMatch = images[0].match(/\/products\/(temp-\d+)\//);
    if (tempSlugMatch) {
      const tempSlug = tempSlugMatch[1];
      // Move images from temp folder to final slug folder
      try {
        const newUrls = await moveImageFolder("products", tempSlug, slug);
        if (newUrls.length > 0) {
          images = newUrls;
        }
      } catch (error) {
        // If move fails, keep temp URLs (images are still accessible)
        console.error("Failed to move images from temp folder:", error);
      }
    }
  }

  try {
    await adminCreateProduct({
      slug,
      category_slug: validated.data.categorySlug,
      brand_slug: validated.data.brandSlug,
      name: { th: validated.data.nameTh, en: validated.data.nameEn },
      short_description: {
        th: validated.data.shortDescriptionTh,
        en: validated.data.shortDescriptionEn,
      },
      description: {
        th: validated.data.descriptionTh,
        en: validated.data.descriptionEn,
      },
      images,
      specifications: parseJsonOrDefault<
        { label: LocalizedString; value: LocalizedString }[]
      >(validated.data.specifications, []),
      features: parseJsonOrDefault<LocalizedString[]>(
        validated.data.features,
        []
      ),
      documents: parseJsonOrDefault<{ name: string; url: string }[]>(
        validated.data.documents,
        []
      ),
      featured: validated.data.featured === "on",
      sort_order: sortOrder,
    });
  } catch {
    return {
      message: "Failed to create product. The slug might already exist.",
    };
  }

  revalidatePath("/admin/products");
  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function updateProductAction(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const originalSlug = formData.get("originalSlug") as string;

  const validated = productSchema.safeParse({
    slug: formData.get("slug") || undefined,
    nameTh: formData.get("nameTh"),
    nameEn: formData.get("nameEn"),
    shortDescriptionTh: formData.get("shortDescriptionTh"),
    shortDescriptionEn: formData.get("shortDescriptionEn"),
    descriptionTh: formData.get("descriptionTh"),
    descriptionEn: formData.get("descriptionEn"),
    categorySlug: formData.get("categorySlug"),
    brandSlug: formData.get("brandSlug"),
    images: formData.get("images") || undefined,
    specifications: formData.get("specifications") || undefined,
    features: formData.get("features") || undefined,
    documents: formData.get("documents") || undefined,
    featured: formData.get("featured") || undefined,
    sortOrder: formData.get("sortOrder") || undefined,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  // Use original slug if not provided (fallback)
  const slug = validated.data.slug || originalSlug;

  // Handle image migration if slug changed
  let images = parseJsonOrDefault<string[]>(validated.data.images, []);
  if (slug !== originalSlug && images.length > 0) {
    try {
      const newUrls = await moveImageFolder("products", originalSlug, slug);
      if (newUrls.length > 0) {
        images = newUrls; // Use migrated URLs
      }
    } catch (error) {
      console.error("Failed to migrate product images on slug change:", error);
      // Continue with old URLs - images still accessible under old slug
    }
  }

  // Build update object, only including sortOrder if provided
  const updateData: Parameters<typeof adminUpdateProduct>[1] = {
    slug,
    category_slug: validated.data.categorySlug,
    brand_slug: validated.data.brandSlug,
    name: { th: validated.data.nameTh, en: validated.data.nameEn },
    short_description: {
      th: validated.data.shortDescriptionTh,
      en: validated.data.shortDescriptionEn,
    },
    description: {
      th: validated.data.descriptionTh,
      en: validated.data.descriptionEn,
    },
    images,
    specifications: parseJsonOrDefault<
      { label: LocalizedString; value: LocalizedString }[]
    >(validated.data.specifications, []),
    features: parseJsonOrDefault<LocalizedString[]>(
      validated.data.features,
      []
    ),
    documents: parseJsonOrDefault<{ name: string; url: string }[]>(
      validated.data.documents,
      []
    ),
    featured: validated.data.featured === "on",
  };

  // Only update sort_order if provided
  if (validated.data.sortOrder !== undefined) {
    updateData.sort_order = validated.data.sortOrder;
  }

  try {
    await adminUpdateProduct(originalSlug, updateData);
  } catch {
    return { message: "Failed to update product." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function deleteProductAction(
  slug: string
): Promise<ProductFormState> {
  try {
    await adminDeleteProduct(slug);
    deleteImageFolder("products", slug).catch(() => {});
  } catch {
    return { message: "Failed to delete product." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function bulkDeleteProductsAction(
  slugs: string[]
): Promise<{ success: boolean; deleted: number; message?: string }> {
  let deleted = 0;

  for (const slug of slugs) {
    try {
      await adminDeleteProduct(slug);
      deleteImageFolder("products", slug).catch(() => {});
      deleted++;
    } catch {
      // Continue deleting others even if one fails
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/", "layout");

  if (deleted === 0) {
    return { success: false, deleted: 0, message: "Failed to delete any products." };
  }

  return { success: true, deleted };
}
