import { z } from "zod";

export const brandSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and dashes"),
  name: z.string().min(1, "Name is required"),
  logo: z.string().optional(),
  descriptionTh: z.string().min(1, "Thai description is required"),
  descriptionEn: z.string().min(1, "English description is required"),
  website: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  country: z.string().min(1, "Country is required"),
  sortOrder: z.coerce.number().int().min(0).optional(),
});

export type BrandInput = z.infer<typeof brandSchema>;
