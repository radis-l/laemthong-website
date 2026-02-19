"use client";

import { useActionState, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormErrorAlert } from "./form-error-alert";
import { BilingualTextarea } from "./bilingual-textarea";
import { ImageUpload } from "./image-upload";
import { SlugInput } from "./slug-input";
import {
  createBrandAction,
  updateBrandAction,
} from "@/app/admin/actions/brands";
import type { BrandActionState } from "@/app/admin/actions/types";
import { FormSubmitButton } from "./form-submit-button";
import { toast } from "sonner";
import { useFormSlug } from "@/hooks/use-form-slug";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { useUnsavedChangesContext } from "./unsaved-changes-provider";
import type { DbBrand } from "@/data/types";

interface BrandFormProps {
  brand?: DbBrand;
}

export function BrandForm({ brand }: BrandFormProps) {
  const isEditing = !!brand;
  const action = isEditing ? updateBrandAction : createBrandAction;

  const [state, formAction, isPending] = useActionState<BrandActionState, FormData>(
    action,
    {}
  );

  const [logo, setLogo] = useState<string>(brand?.logo ?? "");
  const [name, setName] = useState(brand?.name ?? "");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { slug: currentSlug, setSlug: setCurrentSlug, isCustomSlug, setIsCustomSlug, handleNameChange } = useFormSlug({
    initialSlug: brand?.slug ?? "",
    initialName: brand?.name ?? "",
    isEditing,
  });

  // Dirty state tracking for unsaved changes warning
  const [initialSlug] = useState(brand?.slug ?? "");
  const [initialLogo] = useState(brand?.logo ?? "");

  const isDirty =
    currentSlug !== initialSlug ||
    logo !== initialLogo;

  useUnsavedChanges(isDirty);
  const { setIsDirty } = useUnsavedChangesContext();
  useEffect(() => { setIsDirty(isDirty); }, [isDirty, setIsDirty]);

  useEffect(() => {
    if (state.success) {
      toast.success(isEditing ? "Brand updated" : "Brand created");
    }
  }, [state.success, isEditing]);

  return (
    <form action={formAction} className="space-y-6">
      {isEditing && <input type="hidden" name="originalSlug" value={brand.slug} />}
      <input type="hidden" name="slug" value={currentSlug} />
      <input type="hidden" name="logo" value={logo} />

      <FormErrorAlert message={state.message} errors={state.errors} />

      <div className="space-y-2">
        <Label htmlFor="name">Brand Name *</Label>
        <Input
          id="name"
          name="name"
          value={name}
          placeholder="Brand Name"
          required
          onChange={(e) => { setName(e.target.value); handleNameChange(e.target.value); }}
        />
        {state.errors?.name && (
          <p className="text-xs text-destructive">{state.errors.name[0]}</p>
        )}
      </div>

      <SlugInput
        isCustomSlug={isCustomSlug}
        onToggleCustom={setIsCustomSlug}
        slug={currentSlug}
        onSlugChange={setCurrentSlug}
        isEditing={isEditing}
        tooltipText='The URL-friendly version of the name. Used in web addresses (e.g., "parker-hannifin" → /brands/parker-hannifin). Auto-generated from the brand name unless customized.'
        editWarning="Changing the slug will migrate the brand logo to the new URL path"
        error={state.errors?.slug?.[0]}
      />

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
        onUploadStateChange={setIsUploadingImage}
        folder="brands"
        entitySlug={currentSlug}
        aspectRatio={1}
        aspectRatioLabel="1:1 square"
        recommendedPx="400 × 400 px"
      />

      <BilingualTextarea
        label="Description"
        nameTh="descriptionTh"
        nameEn="descriptionEn"
        defaultValueTh={brand?.description.th}
        defaultValueEn={brand?.description.en}
        errorTh={state.errors?.descriptionTh?.[0]}
        errorEn={state.errors?.descriptionEn?.[0]}
      />

      <div className="flex gap-3">
        <FormSubmitButton
          isPending={isPending}
          isUploading={isUploadingImage}
          isEditing={isEditing}
          entityName="Brand"
        />
      </div>
    </form>
  );
}
