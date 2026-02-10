import { z } from "zod";

export const productSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and dashes"),
  nameTh: z.string().min(1, "Thai name is required"),
  nameEn: z.string().min(1, "English name is required"),
  shortDescriptionTh: z.string().min(1, "Thai short description is required"),
  shortDescriptionEn: z.string().min(1, "English short description is required"),
  descriptionTh: z.string().min(1, "Thai description is required"),
  descriptionEn: z.string().min(1, "English description is required"),
  categorySlug: z.string().min(1, "Category is required"),
  brandSlug: z.string().min(1, "Brand is required"),
  image: z.string().optional(),
  gallery: z.string().optional(), // JSON string of string[]
  specifications: z.string().optional(), // JSON string of spec array
  features: z.string().optional(), // JSON string of LocalizedString[]
  documents: z.string().optional(), // JSON string of doc array
  featured: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0),
});

export type ProductInput = z.infer<typeof productSchema>;
