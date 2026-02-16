"use client";

import { useState, useActionState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BilingualInput } from "./bilingual-input";
import {
  createCategoryAction,
  type CategoryFormState,
} from "@/app/admin/actions/categories";
import { slugify } from "@/lib/utils";
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
  const [slug, setSlug] = useState("");
  const [state, formAction, isPending] = useActionState<CategoryFormState, FormData>(
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
          <input type="hidden" name="_skipRedirect" value="true" />

          <div className="space-y-2">
            <Label>Slug *</Label>
            <Input
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="category-name"
              required
            />
            {state.errors?.slug && (
              <p className="text-xs text-destructive">{state.errors.slug[0]}</p>
            )}
          </div>

          <BilingualInput
            label="Name"
            nameTh="nameTh"
            nameEn="nameEn"
            required
            errorTh={state.errors?.nameTh?.[0]}
            errorEn={state.errors?.nameEn?.[0]}
            onChangeEn={(val) => setSlug(slugify(val))}
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
