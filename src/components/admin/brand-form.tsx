"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BilingualTextarea } from "./bilingual-textarea";
import { ImageUpload } from "./image-upload";
import {
  createBrandAction,
  updateBrandAction,
  type BrandFormState,
} from "@/app/admin/actions/brands";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { DbBrand } from "@/data/types";

interface BrandFormProps {
  brand?: DbBrand;
}

export function BrandForm({ brand }: BrandFormProps) {
  const isEditing = !!brand;
  const action = isEditing ? updateBrandAction : createBrandAction;

  const [state, formAction, isPending] = useActionState<BrandFormState, FormData>(
    action,
    {}
  );

  const [logo, setLogo] = useState<string>(brand?.logo ?? "");
  const [currentSlug, setCurrentSlug] = useState(brand?.slug ?? "");

  useEffect(() => {
    if (state.success) {
      toast.success(isEditing ? "Brand updated" : "Brand created");
    }
  }, [state.success, isEditing]);

  return (
    <form action={formAction} className="space-y-6">
      {isEditing && <input type="hidden" name="originalSlug" value={brand.slug} />}
      <input type="hidden" name="logo" value={logo} />

      {state.message && (
        <Alert variant="destructive">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
      {state.errors && Object.keys(state.errors).length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            Please fix the highlighted errors and try again.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={brand?.slug}
            placeholder="brand-name"
            required
            onChange={(e) => setCurrentSlug(e.target.value)}
          />
          {state.errors?.slug && (
            <p className="text-xs text-destructive">{state.errors.slug[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Brand Name *</Label>
          <Input
            id="name"
            name="name"
            defaultValue={brand?.name}
            placeholder="Brand Name"
            required
          />
          {state.errors?.name && (
            <p className="text-xs text-destructive">{state.errors.name[0]}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Input
            id="country"
            name="country"
            defaultValue={brand?.country}
            placeholder="e.g. USA"
            required
          />
          {state.errors?.country && (
            <p className="text-xs text-destructive">{state.errors.country[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            type="url"
            defaultValue={brand?.website ?? ""}
            placeholder="https://example.com"
          />
          {state.errors?.website && (
            <p className="text-xs text-destructive">{state.errors.website[0]}</p>
          )}
        </div>
      </div>

      <ImageUpload
        label="Logo"
        value={logo}
        onChange={(url) => setLogo(url as string)}
        folder="brands"
        entitySlug={currentSlug}
      />

      <div className="space-y-2">
        <Label htmlFor="sortOrder">Sort Order</Label>
        <Input
          id="sortOrder"
          name="sortOrder"
          type="number"
          defaultValue={brand?.sort_order ?? 0}
          min={0}
        />
      </div>

      <BilingualTextarea
        label="Description"
        nameTh="descriptionTh"
        nameEn="descriptionEn"
        defaultValueTh={brand?.description.th}
        defaultValueEn={brand?.description.en}
        required
        errorTh={state.errors?.descriptionTh?.[0]}
        errorEn={state.errors?.descriptionEn?.[0]}
      />

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : isEditing ? (
            "Update Brand"
          ) : (
            "Create Brand"
          )}
        </Button>
      </div>
    </form>
  );
}
