import { z } from "zod";
import { slugSchema, sortOrderSchema } from "./shared";

export const productSchema = z.object({
  slug: slugSchema,
  nameTh: z.string().min(1, "Thai name is required"),
  nameEn: z.string().min(1, "English name is required"),
  shortDescriptionTh: z.string().min(1, "Thai short description is required"),
  shortDescriptionEn: z.string().min(1, "English short description is required"),
  descriptionTh: z.string().min(1, "Thai description is required"),
  descriptionEn: z.string().min(1, "English description is required"),
  categorySlug: z.string().min(1, "Category is required"),
  brandSlug: z.string().min(1, "Brand is required"),
  images: z.string().optional(),
  specifications: z.string().optional(),
  features: z.string().optional(),
  documents: z.string().optional(),
  featured: z.string().optional(),
  sortOrder: sortOrderSchema,
});

export type ProductInput = z.infer<typeof productSchema>;
