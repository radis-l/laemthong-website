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
import { Switch } from "@/components/ui/switch";
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
  const [useCustomSlug, setUseCustomSlug] = useState(false);
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
      setUseCustomSlug(false);
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
            onChangeEn={(val) => {
              if (!useCustomSlug) setSlug(slugify(val));
            }}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Slug</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="quick-cat-custom-slug"
                  checked={useCustomSlug}
                  onCheckedChange={setUseCustomSlug}
                />
                <Label
                  htmlFor="quick-cat-custom-slug"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Custom
                </Label>
              </div>
            </div>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              disabled={!useCustomSlug}
              className={!useCustomSlug ? "bg-muted cursor-not-allowed" : ""}
              placeholder="auto-generated-from-name"
            />
            {!useCustomSlug && (
              <p className="text-xs text-muted-foreground">Auto-generated from English name</p>
            )}
            {state.errors?.slug && (
              <p className="text-xs text-destructive">{state.errors.slug[0]}</p>
            )}
          </div>

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
