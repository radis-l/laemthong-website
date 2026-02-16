"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { FormErrorAlert } from "./form-error-alert";
import { BilingualTextarea } from "./bilingual-textarea";
import { ImageUpload } from "./image-upload";
import {
  createBrandAction,
  updateBrandAction,
  type BrandFormState,
} from "@/app/admin/actions/brands";
import { FormSubmitButton } from "./form-submit-button";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { useUnsavedChangesContext } from "./unsaved-changes-provider";
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
  const [useCustomSlug, setUseCustomSlug] = useState(false);
  const [name, setName] = useState(brand?.name ?? "");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // On mount/edit: detect if slug is custom (differs from auto-generated)
  useEffect(() => {
    if (isEditing && brand) {
      const autoSlug = slugify(brand.name);
      const isCustom = brand.slug !== autoSlug;
      setUseCustomSlug(isCustom);
    }
  }, [isEditing, brand]);

  // Auto-generate slug when name changes (only if not in custom mode)
  useEffect(() => {
    if (!useCustomSlug) {
      setCurrentSlug(slugify(name));
    }
  }, [name, useCustomSlug]);

  // Dirty state tracking for unsaved changes warning
  const initialState = useRef({
    slug: brand?.slug ?? "",
    logo: brand?.logo ?? "",
  });

  const isDirty =
    currentSlug !== initialState.current.slug ||
    logo !== initialState.current.logo;

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
          onChange={(e) => setName(e.target.value)}
        />
        {state.errors?.name && (
          <p className="text-xs text-destructive">{state.errors.name[0]}</p>
        )}
      </div>

      {/* Slug field with custom toggle */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="slug-display" className="flex items-center gap-2">
            Slug
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>The URL-friendly version of the name. Used in web addresses (e.g., &quot;parker-hannifin&quot; → /brands/parker-hannifin). Auto-generated from the brand name unless customized.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>

          <div className="flex items-center space-x-2">
            <Switch
              id="custom-slug"
              checked={useCustomSlug}
              onCheckedChange={setUseCustomSlug}
            />
            <Label htmlFor="custom-slug" className="text-sm text-muted-foreground cursor-pointer">
              Use custom slug
            </Label>
          </div>
        </div>

        <Input
          id="slug-display"
          value={currentSlug}
          onChange={(e) => setCurrentSlug(e.target.value)}
          disabled={!useCustomSlug}
          className={!useCustomSlug ? "bg-muted cursor-not-allowed" : ""}
          placeholder="auto-generated-from-name"
        />

        {state.errors?.slug && (
          <p className="text-sm text-destructive">{state.errors.slug[0]}</p>
        )}
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
        onUploadStateChange={setIsUploadingImage}
        folder="brands"
        entitySlug={currentSlug}
        aspectRatio={1}
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
        <p className="text-sm text-muted-foreground">
          Leave blank to auto-assign. Items are numbered 10, 20, 30... to allow manual insertion.
        </p>
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
