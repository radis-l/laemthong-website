import type { ActionState } from "@/app/admin/actions/types";

/**
 * Generic error handler for admin CRUD operations.
 * Checks for known Postgres error types and returns a user-friendly ActionState.
 */
export function handleActionError(
  error: unknown,
  entityName: string,
  context: "create" | "update" | "delete"
): ActionState {
  if (error instanceof Error) {
    // Unique constraint violation (duplicate slug)
    if (error.message.includes("duplicate key")) {
      return {
        message: `A ${entityName} with this slug already exists. Please choose a different ${context === "create" ? "name or " : ""}slug.`,
        errors: { slug: ["This slug is already in use"] },
      };
    }

    // Foreign key constraint violation (has dependent records)
    if (context === "delete" && error.message.includes("foreign key")) {
      return {
        message: `Cannot delete this ${entityName} because it has associated products. Please reassign or delete those products first.`,
      };
    }
  }

  // Generic fallback
  console.error(`Failed to ${context} ${entityName}:`, error);
  return {
    message: `Failed to ${context} ${entityName}. Please try again.`,
  };
}
