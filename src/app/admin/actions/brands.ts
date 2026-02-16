"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { brandSchema } from "@/lib/validations/brand";
import {
  adminCreateBrand,
  adminUpdateBrand,
  adminDeleteBrand,
} from "@/lib/db/admin";
import { deleteImageFolder } from "@/lib/storage";
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
  } catch {
    return { message: "Failed to create brand. The slug might already exist." };
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

  // Build update object
  const updateData: Parameters<typeof adminUpdateBrand>[1] = {
    slug: validated.data.slug,
    name: validated.data.name,
    logo: validated.data.logo || "",
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
  } catch {
    return { message: "Failed to update brand." };
  }

  revalidatePath("/admin/brands");
  revalidatePath("/", "layout");
  redirect("/admin/brands");
}

export async function deleteBrandAction(slug: string): Promise<BrandFormState> {
  try {
    await adminDeleteBrand(slug);
    deleteImageFolder("brands", slug).catch(() => {});
  } catch {
    return { message: "Failed to delete brand. It may have associated products." };
  }

  revalidatePath("/admin/brands");
  revalidatePath("/", "layout");
  return { success: true };
}
