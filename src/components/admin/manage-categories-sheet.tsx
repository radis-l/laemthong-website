"use client";

import { useState, useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BilingualInput } from "./bilingual-input";
import { SlugInput } from "./slug-input";
import { DeleteDialog } from "./delete-dialog";
import { useSortableTable } from "@/hooks/use-sortable-table";
import { useFormSlug } from "@/hooks/use-form-slug";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/app/admin/actions/categories";
import { reorderCategories } from "@/app/admin/actions/reorder";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Tags, GripVertical, Pencil, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { DbCategory } from "@/data/types";
import type { CategoryActionState } from "@/app/admin/actions/types";

interface CategoryWithCount extends DbCategory {
  productCount: number;
}

interface ManageCategoriesSheetProps {
  categories: CategoryWithCount[];
}

export function ManageCategoriesSheet({
  categories,
}: ManageCategoriesSheetProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(categories);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const isFormOpen = isCreating || editingSlug !== null;

  useEffect(() => {
    setItems(categories);
  }, [categories]);

  const { sensors, handleDragEnd, isPending: isReordering } = useSortableTable({
    items,
    setItems,
    reorderAction: reorderCategories,
    getId: (item) => item.slug,
    successMessage: "Categories reordered",
    errorMessage: "Failed to reorder",
    disabled: isFormOpen,
  });

  function handleStartCreate() {
    setEditingSlug(null);
    setIsCreating(true);
    setFormKey((k) => k + 1);
  }

  function handleStartEdit(slug: string) {
    setIsCreating(false);
    setEditingSlug(slug);
    setFormKey((k) => k + 1);
  }

  function handleFormClose() {
    setEditingSlug(null);
    setIsCreating(false);
  }

  function handleOpenChange(newOpen: boolean) {
    setOpen(newOpen);
    if (!newOpen) handleFormClose();
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Tags className="mr-2 h-4 w-4" />
          Categories
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-lg w-full flex flex-col">
        <SheetHeader>
          <div className="flex items-center justify-between pr-8">
            <div>
              <SheetTitle>Categories</SheetTitle>
              <SheetDescription>
                {items.length} {items.length === 1 ? "category" : "categories"}
              </SheetDescription>
            </div>
            <Button
              size="sm"
              onClick={handleStartCreate}
              disabled={isCreating}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              New
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {isCreating && (
            <div className="mb-3 rounded-lg border border-primary/20 bg-muted/30 p-3">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                New Category
              </p>
              <CategoryInlineForm
                key={`create-${formKey}`}
                mode="create"
                onCancel={handleFormClose}
                onSuccess={handleFormClose}
              />
            </div>
          )}

          {items.length === 0 && !isCreating ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-lg border border-dashed p-4">
                <Tags className="mx-auto h-8 w-8 text-muted-foreground/40" />
              </div>
              <p className="mt-4 text-sm font-medium">No categories yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Create your first category to organize products
              </p>
              <Button size="sm" className="mt-4" onClick={handleStartCreate}>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add Category
              </Button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items.map((c) => c.slug)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-0.5">
                  {items.map((cat) => (
                    <SortableCategoryItem
                      key={cat.slug}
                      id={cat.slug}
                      disabled={isFormOpen || isReordering}
                    >
                      {editingSlug === cat.slug ? (
                        <div className="flex-1 rounded-lg border border-primary/20 bg-muted/30 p-3">
                          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Editing
                          </p>
                          <CategoryInlineForm
                            key={`edit-${cat.slug}-${formKey}`}
                            mode="edit"
                            category={cat}
                            onCancel={handleFormClose}
                            onSuccess={handleFormClose}
                          />
                        </div>
                      ) : (
                        <CategoryRowContent
                          category={cat}
                          onEdit={() => handleStartEdit(cat.slug)}
                          disabled={isFormOpen || isReordering}
                        />
                      )}
                    </SortableCategoryItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// Sortable wrapper
// ---------------------------------------------------------------------------

function SortableCategoryItem({
  id,
  disabled,
  children,
}: {
  id: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-start gap-0.5 rounded-lg",
        isDragging && "relative z-50"
      )}
    >
      <button
        type="button"
        className={cn(
          "mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors",
          disabled
            ? "cursor-not-allowed opacity-30"
            : "cursor-grab hover:bg-muted active:cursor-grabbing"
        )}
        {...attributes}
        {...listeners}
        disabled={disabled}
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Display row
// ---------------------------------------------------------------------------

function CategoryRowContent({
  category,
  onEdit,
  disabled,
}: {
  category: CategoryWithCount;
  onEdit: () => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-1 items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/50">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium">
            {category.name.en}
          </span>
          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground">
            {category.productCount}
          </span>
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {category.name.th}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onEdit}
          disabled={disabled}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <DeleteDialog
          title={`Delete "${category.name.en}"?`}
          description="Products in this category will need to be reassigned."
          onDelete={deleteCategoryAction.bind(null, category.slug)}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline form (create / edit)
// ---------------------------------------------------------------------------

function CategoryInlineForm({
  mode,
  category,
  onCancel,
  onSuccess,
}: {
  mode: "create" | "edit";
  category?: CategoryWithCount;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const router = useRouter();
  const action = mode === "create" ? createCategoryAction : updateCategoryAction;
  const [state, formAction, isPending] = useActionState<
    CategoryActionState,
    FormData
  >(action, {});

  const { slug, setSlug, isCustomSlug, setIsCustomSlug, handleNameChange } =
    useFormSlug({
      initialSlug: category?.slug ?? "",
      initialName: category?.name.en ?? "",
      isEditing: mode === "edit",
    });

  useEffect(() => {
    if (state.success) {
      toast.success(
        mode === "create" ? "Category created" : "Category updated"
      );
      router.refresh();
      onSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="_skipRedirect" value="true" />
      <input type="hidden" name="slug" value={slug} />
      {mode === "edit" && (
        <input type="hidden" name="originalSlug" value={category!.slug} />
      )}

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
        slug={slug}
        onSlugChange={setSlug}
        error={state.errors?.slug?.[0]}
        isEditing={mode === "edit"}
        compact
      />

      {state.message && (
        <p className="text-xs text-destructive">{state.message}</p>
      )}

      <div className="flex justify-end gap-2 pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              {mode === "create" ? "Creating..." : "Saving..."}
            </>
          ) : mode === "create" ? (
            "Create"
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </form>
  );
}
