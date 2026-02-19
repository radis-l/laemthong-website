"use server";

import { redirect } from "next/navigation";
import { categorySchema } from "@/lib/validations/category";
import {
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} from "@/lib/db/admin";
import { deleteImageFolder } from "@/lib/storage";
import { handleActionError } from "@/lib/db/errors";
import { getNextSortOrder } from "@/lib/db/sort-order";
import { revalidateEntity } from "@/lib/revalidation";
import type { CategoryActionState } from "./types";


export async function createCategoryAction(
  _prevState: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  const validated = categorySchema.safeParse({
    slug: formData.get("slug"),
    nameTh: formData.get("nameTh"),
    nameEn: formData.get("nameEn"),
    descriptionTh: formData.get("descriptionTh"),
    descriptionEn: formData.get("descriptionEn"),
    sortOrder: formData.get("sortOrder"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const skipRedirect = formData.get("_skipRedirect") === "true";

  const sortOrder = validated.data.sortOrder ?? await getNextSortOrder("categories");

  let newCategory: import("@/data/types").DbCategory;

  try {
    newCategory = await adminCreateCategory({
      slug: validated.data.slug,
      name: { th: validated.data.nameTh, en: validated.data.nameEn },
      description: {
        th: validated.data.descriptionTh,
        en: validated.data.descriptionEn,
      },
      sort_order: sortOrder,
    });
  } catch (error) {
    return handleActionError(error, "category", "create");
  }

  revalidateEntity("/admin/categories");

  if (skipRedirect) {
    return { success: true, category: newCategory };
  }

  redirect("/admin/categories");
}

export async function updateCategoryAction(
  _prevState: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  const originalSlug = formData.get("originalSlug") as string;

  const validated = categorySchema.safeParse({
    slug: formData.get("slug"),
    nameTh: formData.get("nameTh"),
    nameEn: formData.get("nameEn"),
    descriptionTh: formData.get("descriptionTh"),
    descriptionEn: formData.get("descriptionEn"),
    sortOrder: formData.get("sortOrder"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const slug = validated.data.slug;

  // Build update object
  const updateData: Parameters<typeof adminUpdateCategory>[1] = {
    slug: slug,
    name: { th: validated.data.nameTh, en: validated.data.nameEn },
    description: {
      th: validated.data.descriptionTh,
      en: validated.data.descriptionEn,
    },
  };

  if (validated.data.sortOrder !== undefined) {
    updateData.sort_order = validated.data.sortOrder;
  }

  try {
    await adminUpdateCategory(originalSlug, updateData);
  } catch (error) {
    return handleActionError(error, "category", "update");
  }

  revalidateEntity("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategoryAction(
  slug: string
): Promise<CategoryActionState> {
  try {
    await adminDeleteCategory(slug);
    deleteImageFolder("categories", slug).catch(() => {});
  } catch (error) {
    return handleActionError(error, "category", "delete");
  }

  revalidateEntity("/admin/categories");
  return { success: true };
}
