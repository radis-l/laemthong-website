"use client";

import { useActionState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BilingualInput } from "./bilingual-input";
import { SlugInput } from "./slug-input";
import { Separator } from "@/components/ui/separator";
import { DeleteDialog } from "./delete-dialog";
import {
  createCategoryAction,
  deleteCategoryAction,
} from "@/app/admin/actions/categories";
import type { CategoryActionState } from "@/app/admin/actions/types";
import { useFormSlug } from "@/hooks/use-form-slug";
import { toast } from "sonner";
import type { DbCategory } from "@/data/types";

interface ManageCategoriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: DbCategory[];
  selectedSlug: string;
  onCreated: (category: DbCategory) => void;
  onDeleted: (slug: string) => void;
}

export function ManageCategoriesDialog({
  open,
  onOpenChange,
  categories,
  selectedSlug,
  onCreated,
  onDeleted,
}: ManageCategoriesDialogProps) {
  const { slug, setSlug, isCustomSlug, setIsCustomSlug, handleNameChange } =
    useFormSlug({
      initialSlug: "",
      initialName: "",
      isEditing: false,
    });

  const [state, formAction, isPending] = useActionState<
    CategoryActionState,
    FormData
  >(createCategoryAction, {});

  useEffect(() => {
    if (state.success && state.category) {
      toast.success("Category created");
      onCreated(state.category);
      // Reset form
      setSlug("");
      setIsCustomSlug(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success, state.category]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>

        {/* Existing categories list */}
        {categories.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Existing categories
            </p>
            <div className="max-h-48 space-y-1 overflow-y-auto rounded-md border p-2">
              {categories.map((cat) => (
                <div
                  key={cat.slug}
                  className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-medium">{cat.name.en}</span>
                    <span className="ml-1.5 text-muted-foreground">
                      {cat.name.th}
                    </span>
                  </div>
                  {cat.slug === selectedSlug ? (
                    <span className="shrink-0 text-xs text-muted-foreground">
                      In use
                    </span>
                  ) : (
                    <div className="shrink-0">
                      <DeleteDialog
                        title={`Delete "${cat.name.en}"?`}
                        description="This action cannot be undone. Products in this category will need to be reassigned."
                        onDelete={async () => {
                          const result = await deleteCategoryAction(cat.slug);
                          if (result.success) {
                            onDeleted(cat.slug);
                          }
                          return result;
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Create new category form */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Add new category
          </p>
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="image" value="" />
            <input type="hidden" name="sortOrder" value="0" />
            <input type="hidden" name="slug" value={slug} />
            <input type="hidden" name="_skipRedirect" value="true" />

            <BilingualInput
              label="Name"
              nameTh="nameTh"
              nameEn="nameEn"
              required
              errorTh={state.errors?.nameTh?.[0]}
              errorEn={state.errors?.nameEn?.[0]}
              onChangeEn={handleNameChange}
            />

            <SlugInput
              isCustomSlug={isCustomSlug}
              onToggleCustom={setIsCustomSlug}
              slug={slug}
              onSlugChange={setSlug}
              error={state.errors?.slug?.[0]}
              compact
            />

            {state.message && (
              <p className="text-xs text-destructive">{state.message}</p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Done
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
