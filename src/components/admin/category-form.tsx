"use client";

import { useActionState, useEffect, useState } from "react";
import { FormErrorAlert } from "./form-error-alert";
import { BilingualInput } from "./bilingual-input";
import { BilingualTextarea } from "./bilingual-textarea";
import { SlugInput } from "./slug-input";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/app/admin/actions/categories";
import type { CategoryActionState } from "@/app/admin/actions/types";
import { FormSubmitButton } from "./form-submit-button";
import { toast } from "sonner";
import { useFormSlug } from "@/hooks/use-form-slug";
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
    CategoryActionState,
    FormData
  >(action, {});

  const { slug: currentSlug, setSlug: setCurrentSlug, isCustomSlug, setIsCustomSlug, handleNameChange } = useFormSlug({
    initialSlug: category?.slug ?? "",
    initialName: category?.name.en ?? "",
    isEditing,
  });

  // Dirty state tracking for unsaved changes warning
  const [initialSlug] = useState(category?.slug ?? "");

  const isDirty = currentSlug !== initialSlug;

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
        onChangeEn={handleNameChange}
      />

      <SlugInput
        isCustomSlug={isCustomSlug}
        onToggleCustom={setIsCustomSlug}
        slug={currentSlug}
        onSlugChange={setCurrentSlug}
        isEditing={isEditing}
        tooltipText='The URL-friendly version of the name. Used in web addresses (e.g., "hydraulic-systems" → /products?category=hydraulic-systems). Auto-generated from the English name unless customized.'
        error={state.errors?.slug?.[0]}
      />

      <BilingualTextarea
        label="Description"
        nameTh="descriptionTh"
        nameEn="descriptionEn"
        defaultValueTh={category?.description.th}
        defaultValueEn={category?.description.en}
        errorTh={state.errors?.descriptionTh?.[0]}
        errorEn={state.errors?.descriptionEn?.[0]}
      />

      <div className="flex gap-3">
        <FormSubmitButton
          isPending={isPending}
          isEditing={isEditing}
          entityName="Category"
        />
      </div>
    </form>
  );
}
