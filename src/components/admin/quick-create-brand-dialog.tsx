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
import { ImageUpload } from "./image-upload";
import { SlugInput } from "./slug-input";
import { createBrandAction } from "@/app/admin/actions/brands";
import type { BrandActionState } from "@/app/admin/actions/types";
import { useFormSlug } from "@/hooks/use-form-slug";
import { toast } from "sonner";
import type { DbBrand } from "@/data/types";

interface QuickCreateBrandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (brand: DbBrand) => void;
}

export function QuickCreateBrandDialog({
  open,
  onOpenChange,
  onSuccess,
}: QuickCreateBrandDialogProps) {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const { slug, setSlug, isCustomSlug, setIsCustomSlug, handleNameChange } =
    useFormSlug({ initialSlug: "", initialName: "", isEditing: false });
  const [state, formAction, isPending] = useActionState<BrandActionState, FormData>(
    createBrandAction,
    {}
  );

  useEffect(() => {
    if (state.success && state.brand) {
      toast.success("Brand created");
      onSuccess(state.brand);
      onOpenChange(false);
      // Reset form
      setName("");
      setLogo("");
      setSlug("");
      setIsCustomSlug(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success, state.brand]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Add Brand</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="logo" value={logo} />
          <input type="hidden" name="sortOrder" value="0" />
          <input type="hidden" name="website" value="" />
          <input type="hidden" name="_skipRedirect" value="true" />

          <div className="space-y-2">
            <Label>Name *</Label>
            <Input
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                handleNameChange(e.target.value);
              }}
              placeholder="Brand Name"
              required
            />
            {state.errors?.name && (
              <p className="text-xs text-destructive">{state.errors.name[0]}</p>
            )}
          </div>

          <SlugInput
            compact
            isCustomSlug={isCustomSlug}
            onToggleCustom={setIsCustomSlug}
            slug={slug}
            onSlugChange={setSlug}
            error={state.errors?.slug?.[0]}
          />

          <div className="space-y-2">
            <Label>Country *</Label>
            <Input name="country" placeholder="e.g. USA" required />
            {state.errors?.country && (
              <p className="text-xs text-destructive">{state.errors.country[0]}</p>
            )}
          </div>

          <ImageUpload
            label="Logo (Optional)"
            value={logo}
            onChange={(url) => setLogo(url as string)}
            folder="brands"
            entitySlug={slug || `temp-${Date.now()}`}
            aspectRatio={1}
            aspectRatioLabel="1:1 square"
            recommendedPx="400 × 400 px"
          />

          {/* Minimal descriptions - required by schema */}
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
