"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { FormErrorAlert } from "./form-error-alert";
import { BilingualInput } from "./bilingual-input";
import { BilingualTextarea } from "./bilingual-textarea";
import { ImageUpload } from "./image-upload";
import {
  createCategoryAction,
  updateCategoryAction,
  type CategoryFormState,
} from "@/app/admin/actions/categories";
import { FormSubmitButton } from "./form-submit-button";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { useUnsavedChangesContext } from "./unsaved-changes-provider";
import type { DbCategory } from "@/data/types";

interface CategoryFormProps {
  category?: DbCategory;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const isEditing = !!category;
  const action = isEditing ? updateCategoryAction : createCategoryAction;

  const [state, formAction, isPending] = useActionState<
    CategoryFormState,
    FormData
  >(action, {});

  const [image, setImage] = useState<string>(category?.image ?? "");
  const [currentSlug, setCurrentSlug] = useState(category?.slug ?? "");
  const [useCustomSlug, setUseCustomSlug] = useState(false);
  const [nameEn, setNameEn] = useState(category?.name.en ?? "");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // On mount/edit: detect if slug is custom (differs from auto-generated)
  useEffect(() => {
    if (isEditing && category) {
      const autoSlug = slugify(category.name.en);
      const isCustom = category.slug !== autoSlug;
      setUseCustomSlug(isCustom);
    }
  }, [isEditing, category]);

  // Auto-generate slug when English name changes (only if not in custom mode)
  useEffect(() => {
    if (!useCustomSlug) {
      setCurrentSlug(slugify(nameEn));
    }
  }, [nameEn, useCustomSlug]);

  // Dirty state tracking for unsaved changes warning
  const initialState = useRef({
    slug: category?.slug ?? "",
    image: category?.image ?? "",
  });

  const isDirty =
    currentSlug !== initialState.current.slug ||
    image !== initialState.current.image;

  useUnsavedChanges(isDirty);
  const { setIsDirty } = useUnsavedChangesContext();
  useEffect(() => { setIsDirty(isDirty); }, [isDirty, setIsDirty]);

  useEffect(() => {
    if (state.success) {
      toast.success(isEditing ? "Category updated" : "Category created");
    }
  }, [state.success, isEditing]);

  return (
    <form action={formAction} className="space-y-6">
      {isEditing && (
        <input type="hidden" name="originalSlug" value={category.slug} />
      )}
      <input type="hidden" name="slug" value={currentSlug} />
      <input type="hidden" name="image" value={image} />

      <FormErrorAlert message={state.message} errors={state.errors} />

      <BilingualInput
        label="Name"
        nameTh="nameTh"
        nameEn="nameEn"
        defaultValueTh={category?.name.th}
        defaultValueEn={category?.name.en}
        required
        errorTh={state.errors?.nameTh?.[0]}
        errorEn={state.errors?.nameEn?.[0]}
        onChangeEn={setNameEn}
      />

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
                  <p>The URL-friendly version of the name. Used in web addresses (e.g., &quot;hydraulic-systems&quot; → /categories/hydraulic-systems). Auto-generated from the English name unless customized.</p>
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

        {isEditing && useCustomSlug && (
          <p className="text-xs text-amber-600">
            ⚠️ Changing the slug will migrate category images to the new URL path
          </p>
        )}

        {state.errors?.slug && (
          <p className="text-sm text-destructive">{state.errors.slug[0]}</p>
        )}
      </div>

      <BilingualTextarea
        label="Description"
        nameTh="descriptionTh"
        nameEn="descriptionEn"
        defaultValueTh={category?.description.th}
        defaultValueEn={category?.description.en}
        errorTh={state.errors?.descriptionTh?.[0]}
        errorEn={state.errors?.descriptionEn?.[0]}
      />

      <ImageUpload
        label="Category Image"
        value={image}
        onChange={(url) => setImage(url as string)}
        onUploadStateChange={setIsUploadingImage}
        folder="categories"
        entitySlug={currentSlug}
        aspectRatio={4 / 3}
        aspectRatioLabel="4:3 landscape"
      />

      <div className="flex gap-3">
        <FormSubmitButton
          isPending={isPending}
          isUploading={isUploadingImage}
          isEditing={isEditing}
          entityName="Category"
        />
      </div>
    </form>
  );
}
