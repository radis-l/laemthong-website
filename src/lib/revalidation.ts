import { revalidatePath } from "next/cache";

/**
 * Revalidate both the admin path and all locale-prefixed public routes.
 */
export function revalidateEntity(adminPath: string): void {
  revalidatePath(adminPath);
  revalidatePath("/", "layout");
}
