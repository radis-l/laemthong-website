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

export type BrandFormState = {
  success?: boolean;
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

  try {
    await adminCreateBrand({
      slug: validated.data.slug,
      name: validated.data.name,
      logo: validated.data.logo || "",
      description: {
        th: validated.data.descriptionTh,
        en: validated.data.descriptionEn,
      },
      website: validated.data.website || null,
      country: validated.data.country,
      sort_order: validated.data.sortOrder,
    });
  } catch {
    return { message: "Failed to create brand. The slug might already exist." };
  }

  revalidatePath("/admin/brands");
  revalidatePath("/brands", "layout");
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

  try {
    await adminUpdateBrand(originalSlug, {
      slug: validated.data.slug,
      name: validated.data.name,
      logo: validated.data.logo || "",
      description: {
        th: validated.data.descriptionTh,
        en: validated.data.descriptionEn,
      },
      website: validated.data.website || null,
      country: validated.data.country,
      sort_order: validated.data.sortOrder,
    });
  } catch {
    return { message: "Failed to update brand." };
  }

  revalidatePath("/admin/brands");
  revalidatePath("/brands", "layout");
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
  revalidatePath("/brands", "layout");
  return { success: true };
}
