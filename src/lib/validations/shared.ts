import { z } from "zod";

/** Regex for valid slugs: lowercase letters, numbers, and dashes only. */
export const SLUG_REGEX = /^[a-z0-9-]+$/;

/** Reusable Zod schema for slug fields. */
export const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .regex(SLUG_REGEX, "Slug must be lowercase letters, numbers, and dashes");

/** Reusable Zod schema for sort_order fields. */
export const sortOrderSchema = z.coerce.number().int().min(0).optional();
