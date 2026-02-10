"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { productSchema } from "@/lib/validations/product";
import {
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} from "@/lib/db/admin";
import { deleteImageFolder } from "@/lib/storage";
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
    slug: formData.get("slug"),
    nameTh: formData.get("nameTh"),
    nameEn: formData.get("nameEn"),
    shortDescriptionTh: formData.get("shortDescriptionTh"),
    shortDescriptionEn: formData.get("shortDescriptionEn"),
    descriptionTh: formData.get("descriptionTh"),
    descriptionEn: formData.get("descriptionEn"),
    categorySlug: formData.get("categorySlug"),
    brandSlug: formData.get("brandSlug"),
    image: formData.get("image") || undefined,
    gallery: formData.get("gallery") || undefined,
    specifications: formData.get("specifications") || undefined,
    features: formData.get("features") || undefined,
    documents: formData.get("documents") || undefined,
    featured: formData.get("featured") || undefined,
    sortOrder: formData.get("sortOrder"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  try {
    await adminCreateProduct({
      slug: validated.data.slug,
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
      image: validated.data.image || "",
      gallery: parseJsonOrDefault<string[]>(validated.data.gallery, []),
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
      sort_order: validated.data.sortOrder,
    });
  } catch {
    return {
      message: "Failed to create product. The slug might already exist.",
    };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products", "layout");
  redirect("/admin/products");
}

export async function updateProductAction(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const originalSlug = formData.get("originalSlug") as string;

  const validated = productSchema.safeParse({
    slug: formData.get("slug"),
    nameTh: formData.get("nameTh"),
    nameEn: formData.get("nameEn"),
    shortDescriptionTh: formData.get("shortDescriptionTh"),
    shortDescriptionEn: formData.get("shortDescriptionEn"),
    descriptionTh: formData.get("descriptionTh"),
    descriptionEn: formData.get("descriptionEn"),
    categorySlug: formData.get("categorySlug"),
    brandSlug: formData.get("brandSlug"),
    image: formData.get("image") || undefined,
    gallery: formData.get("gallery") || undefined,
    specifications: formData.get("specifications") || undefined,
    features: formData.get("features") || undefined,
    documents: formData.get("documents") || undefined,
    featured: formData.get("featured") || undefined,
    sortOrder: formData.get("sortOrder"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  try {
    await adminUpdateProduct(originalSlug, {
      slug: validated.data.slug,
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
      image: validated.data.image || "",
      gallery: parseJsonOrDefault<string[]>(validated.data.gallery, []),
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
      sort_order: validated.data.sortOrder,
    });
  } catch {
    return { message: "Failed to update product." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products", "layout");
  redirect("/admin/products");
}

export async function deleteProductAction(
  slug: string
): Promise<ProductFormState> {
  try {
    await adminDeleteProduct(slug);
    deleteImageFolder("products", slug).catch(console.error);
  } catch {
    return { message: "Failed to delete product." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products", "layout");
  return { success: true };
}
