"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { categorySchema } from "@/lib/validations/category";
import {
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} from "@/lib/db/admin";
import { deleteImageFolder, moveImageFolder } from "@/lib/storage";
import { createSupabaseAdminClient } from "@/lib/supabase";
import type { DbCategory } from "@/data/types";

export type CategoryFormState = {
  success?: boolean;
  category?: DbCategory;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function createCategoryAction(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const validated = categorySchema.safeParse({
    slug: formData.get("slug"),
    nameTh: formData.get("nameTh"),
    nameEn: formData.get("nameEn"),
    descriptionTh: formData.get("descriptionTh"),
    descriptionEn: formData.get("descriptionEn"),
    image: formData.get("image") || undefined,
    icon: formData.get("icon"),
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
      .from("categories")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .single();
    sortOrder = (data?.sort_order ?? -10) + 10;
  }

  let newCategory: DbCategory;

  try {
    newCategory = await adminCreateCategory({
      slug: validated.data.slug,
      name: { th: validated.data.nameTh, en: validated.data.nameEn },
      description: {
        th: validated.data.descriptionTh,
        en: validated.data.descriptionEn,
      },
      image: validated.data.image || "",
      icon: validated.data.icon,
      sort_order: sortOrder,
    });
  } catch (error) {
    // Check for unique constraint violation (slug already exists)
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return {
        message:
          "A category with this slug already exists. Please choose a different name or slug.",
        errors: { slug: ["This slug is already in use"] },
      };
    }

    // Generic fallback for other database errors
    console.error("Failed to create category:", error);
    return {
      message:
        "Failed to create category. Please check your connection and try again.",
    };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");

  if (skipRedirect) {
    return { success: true, category: newCategory };
  }

  redirect("/admin/categories");
}

export async function updateCategoryAction(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const originalSlug = formData.get("originalSlug") as string;

  const validated = categorySchema.safeParse({
    slug: formData.get("slug"),
    nameTh: formData.get("nameTh"),
    nameEn: formData.get("nameEn"),
    descriptionTh: formData.get("descriptionTh"),
    descriptionEn: formData.get("descriptionEn"),
    image: formData.get("image") || undefined,
    icon: formData.get("icon"),
    sortOrder: formData.get("sortOrder"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const slug = validated.data.slug;

  // Handle image migration if slug changed
  let image = validated.data.image || "";
  if (slug !== originalSlug && image) {
    try {
      const newUrls = await moveImageFolder("categories", originalSlug, slug);
      if (newUrls.length > 0) {
        image = newUrls[0]; // Use migrated URL (single image)
      }
    } catch (error) {
      console.error("Failed to migrate category image on slug change:", error);
      // Continue with old URL - image still accessible under old slug
    }
  }

  // Build update object
  const updateData: Parameters<typeof adminUpdateCategory>[1] = {
    slug: slug,
    name: { th: validated.data.nameTh, en: validated.data.nameEn },
    description: {
      th: validated.data.descriptionTh,
      en: validated.data.descriptionEn,
    },
    image: image,
    icon: validated.data.icon,
  };

  // Only update sort_order if provided
  if (validated.data.sortOrder !== undefined) {
    updateData.sort_order = validated.data.sortOrder;
  }

  try {
    await adminUpdateCategory(originalSlug, updateData);
  } catch (error) {
    // Check for unique constraint violation (slug already exists)
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return {
        message:
          "A category with this slug already exists. Please choose a different slug.",
        errors: { slug: ["This slug is already in use"] },
      };
    }

    // Generic fallback for other database errors
    console.error("Failed to update category:", error);
    return {
      message:
        "Failed to update category. Please check your connection and try again.",
    };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
  redirect("/admin/categories");
}

export async function deleteCategoryAction(
  slug: string
): Promise<CategoryFormState> {
  try {
    await adminDeleteCategory(slug);
    deleteImageFolder("categories", slug).catch(() => {});
  } catch (error) {
    if (error instanceof Error && error.message.includes("foreign key")) {
      return {
        message:
          "Cannot delete this category because it has associated products. Please reassign or delete those products first.",
      };
    }

    console.error("Failed to delete category:", error);
    return {
      message: "Failed to delete category. Please try again.",
    };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
  return { success: true };
}
