import { z } from "zod";
import { slugSchema, sortOrderSchema } from "./shared";

export const categorySchema = z.object({
  slug: slugSchema,
  nameTh: z.string().min(1, "Thai name is required"),
  nameEn: z.string().min(1, "English name is required"),
  descriptionTh: z.string(),
  descriptionEn: z.string(),
  sortOrder: sortOrderSchema,
});
