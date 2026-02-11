"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BilingualInput } from "./bilingual-input";
import { BilingualTextarea } from "./bilingual-textarea";
import { ImageUpload } from "./image-upload";
import {
  createCategoryAction,
  updateCategoryAction,
  type CategoryFormState,
} from "@/app/admin/actions/categories";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
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
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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
      <input type="hidden" name="image" value={image} />

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
            defaultValue={category?.slug}
            placeholder="category-name"
            required
            onChange={(e) => setCurrentSlug(e.target.value)}
          />
          {state.errors?.slug && (
            <p className="text-xs text-destructive">{state.errors.slug[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="icon">Icon (Lucide name) *</Label>
          <Input
            id="icon"
            name="icon"
            defaultValue={category?.icon}
            placeholder="e.g. Zap, Shield, Wrench"
            required
          />
          {state.errors?.icon && (
            <p className="text-xs text-destructive">{state.errors.icon[0]}</p>
          )}
        </div>
      </div>

      <BilingualInput
        label="Name"
        nameTh="nameTh"
        nameEn="nameEn"
        defaultValueTh={category?.name.th}
        defaultValueEn={category?.name.en}
        required
        errorTh={state.errors?.nameTh?.[0]}
        errorEn={state.errors?.nameEn?.[0]}
      />

      <BilingualTextarea
        label="Description"
        nameTh="descriptionTh"
        nameEn="descriptionEn"
        defaultValueTh={category?.description.th}
        defaultValueEn={category?.description.en}
        required
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
      />

      <div className="space-y-2">
        <Label htmlFor="sortOrder">Sort Order</Label>
        <Input
          id="sortOrder"
          name="sortOrder"
          type="number"
          defaultValue={category?.sort_order ?? 0}
          min={0}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending || isUploadingImage}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : isUploadingImage ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading image...
            </>
          ) : isEditing ? (
            "Update Category"
          ) : (
            "Create Category"
          )}
        </Button>
      </div>
    </form>
  );
}
