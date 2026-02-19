import { z } from "zod";
import { slugSchema, sortOrderSchema } from "./shared";

export const brandSchema = z.object({
  slug: slugSchema,
  name: z.string().min(1, "Name is required"),
  logo: z.string().optional(),
  descriptionTh: z.string(),
  descriptionEn: z.string(),
  website: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  country: z.string().min(1, "Country is required"),
  sortOrder: sortOrderSchema,
});

