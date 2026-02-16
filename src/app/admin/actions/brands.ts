"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { brandSchema } from "@/lib/validations/brand";
import {
  adminCreateBrand,
  adminUpdateBrand,
  adminDeleteBrand,
} from "@/lib/db/admin";
import { deleteImageFolder, moveImageFolder } from "@/lib/storage";
import { createSupabaseAdminClient } from "@/lib/supabase";
import type { DbBrand } from "@/data/types";

export type BrandFormState = {
  success?: boolean;
  brand?: DbBrand;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function createBrandAction(
  _prevState: BrandFormState,
  formData: FormData
): Promise<BrandFormState> {
  const validated = brandSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    logo: formData.get("logo") || undefined,
    descriptionTh: formData.get("descriptionTh"),
    descriptionEn: formData.get("descriptionEn"),
    website: formData.get("website") || "",
    country: formData.get("country"),
    sortOrder: formData.get("sortOrder"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const skipRedirect = formData.get("_skipRedirect") === "true";

  // Auto-calculate sort order with gap of 10 if not provided
  let sortOrder = validated.data.sortOrder ?? 0;
  if (validated.data.sortOrder === undefined) {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase
      .from("brands")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .single();
    sortOrder = (data?.sort_order ?? -10) + 10;
  }

  let newBrand: DbBrand;

  try {
    newBrand = await adminCreateBrand({
      slug: validated.data.slug,
      name: validated.data.name,
      logo: validated.data.logo || "",
      description: {
        th: validated.data.descriptionTh,
        en: validated.data.descriptionEn,
      },
      website: validated.data.website || null,
      country: validated.data.country,
      sort_order: sortOrder,
    });
  } catch (error) {
    // Check for unique constraint violation (slug already exists)
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return {
        message:
          "A brand with this slug already exists. Please choose a different name or slug.",
        errors: { slug: ["This slug is already in use"] },
      };
    }

    // Generic fallback for other database errors
    console.error("Failed to create brand:", error);
    return {
      message:
        "Failed to create brand. Please check your connection and try again.",
    };
  }

  revalidatePath("/admin/brands");
  revalidatePath("/", "layout");

  if (skipRedirect) {
    return { success: true, brand: newBrand };
  }

  redirect("/admin/brands");
}

export async function updateBrandAction(
  _prevState: BrandFormState,
  formData: FormData
): Promise<BrandFormState> {
  const originalSlug = formData.get("originalSlug") as string;

  const validated = brandSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    logo: formData.get("logo") || undefined,
    descriptionTh: formData.get("descriptionTh"),
    descriptionEn: formData.get("descriptionEn"),
    website: formData.get("website") || "",
    country: formData.get("country"),
    sortOrder: formData.get("sortOrder"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const slug = validated.data.slug;

  // Handle logo migration if slug changed
  let logo = validated.data.logo || "";
  if (slug !== originalSlug && logo) {
    try {
      const newUrls = await moveImageFolder("brands", originalSlug, slug);
      if (newUrls.length > 0) {
        logo = newUrls[0]; // Use migrated URL (single logo)
      }
    } catch (error) {
      console.error("Failed to migrate brand logo on slug change:", error);
      // Continue with old URL - logo still accessible under old slug
    }
  }

  // Build update object
  const updateData: Parameters<typeof adminUpdateBrand>[1] = {
    slug: slug,
    name: validated.data.name,
    logo: logo,
    description: {
      th: validated.data.descriptionTh,
      en: validated.data.descriptionEn,
    },
    website: validated.data.website || null,
    country: validated.data.country,
  };

  // Only update sort_order if provided
  if (validated.data.sortOrder !== undefined) {
    updateData.sort_order = validated.data.sortOrder;
  }

  try {
    await adminUpdateBrand(originalSlug, updateData);
  } catch (error) {
    // Check for unique constraint violation (slug already exists)
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return {
        message:
          "A brand with this slug already exists. Please choose a different slug.",
        errors: { slug: ["This slug is already in use"] },
      };
    }

    // Generic fallback for other database errors
    console.error("Failed to update brand:", error);
    return {
      message:
        "Failed to update brand. Please check your connection and try again.",
    };
  }

  revalidatePath("/admin/brands");
  revalidatePath("/", "layout");
  redirect("/admin/brands");
}

export async function deleteBrandAction(slug: string): Promise<BrandFormState> {
  try {
    await adminDeleteBrand(slug);
    deleteImageFolder("brands", slug).catch(() => {});
  } catch (error) {
    if (error instanceof Error && error.message.includes("foreign key")) {
      return {
        message:
          "Cannot delete this brand because it has associated products. Please reassign or delete those products first.",
      };
    }

    console.error("Failed to delete brand:", error);
    return {
      message: "Failed to delete brand. Please try again.",
    };
  }

  revalidatePath("/admin/brands");
  revalidatePath("/", "layout");
  return { success: true };
}
