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
import { createCategoryAction } from "@/app/admin/actions/categories";
import type { CategoryActionState } from "@/app/admin/actions/types";
import { useFormSlug } from "@/hooks/use-form-slug";
import { toast } from "sonner";
import type { DbCategory } from "@/data/types";

interface QuickCreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (category: DbCategory) => void;
}

export function QuickCreateCategoryDialog({
  open,
  onOpenChange,
  onSuccess,
}: QuickCreateCategoryDialogProps) {
  const { slug, setSlug, isCustomSlug, setIsCustomSlug, handleNameChange } = useFormSlug({
    initialSlug: "",
    initialName: "",
    isEditing: false,
  });

  const [state, formAction, isPending] = useActionState<CategoryActionState, FormData>(
    createCategoryAction,
    {}
  );

  useEffect(() => {
    if (state.success && state.category) {
      toast.success("Category created");
      onSuccess(state.category);
      onOpenChange(false);
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
          <DialogTitle>Quick Add Category</DialogTitle>
        </DialogHeader>
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

          {/* Minimal description - required by schema */}
          <input type="hidden" name="descriptionTh" value="Created via quick-add" />
          <input type="hidden" name="descriptionEn" value="Created via quick-add" />

          {state.message && (
            <p className="text-xs text-destructive">{state.message}</p>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
