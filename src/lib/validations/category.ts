import { z } from "zod";

export const categorySchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and dashes"),
  nameTh: z.string().min(1, "Thai name is required"),
  nameEn: z.string().min(1, "English name is required"),
  descriptionTh: z.string().min(1, "Thai description is required"),
  descriptionEn: z.string().min(1, "English description is required"),
  image: z.string().optional(),
  icon: z.string().min(1, "Icon name is required"),
  sortOrder: z.coerce.number().int().min(0),
});

export type CategoryInput = z.infer<typeof categorySchema>;
