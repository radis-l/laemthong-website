import type { DbBrand, DbCategory } from "@/data/types";

/** Base action state returned by all admin server actions. */
export type ActionState = {
  success?: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

/** Brand action state (quick-create returns the created entity). */
export type BrandActionState = ActionState & {
  brand?: DbBrand;
};

/** Category action state (quick-create returns the created entity). */
export type CategoryActionState = ActionState & {
  category?: DbCategory;
};

/** Product action state. */
export type ProductActionState = ActionState;
