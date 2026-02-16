"use client";

import { useState, useActionState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { BilingualInput } from "./bilingual-input";
import { AVAILABLE_ICONS, ICON_MAP } from "@/lib/category-icons";
import {
  createCategoryAction,
  type CategoryFormState,
} from "@/app/admin/actions/categories";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";
import type { DbCategory } from "@/data/types";

interface QuickCreateCategoryDialogProps {
  onSuccess: (category: DbCategory) => void;
}

export function QuickCreateCategoryDialog({
  onSuccess,
}: QuickCreateCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Wrench");
  const [state, formAction, isPending] = useActionState<CategoryFormState, FormData>(
    createCategoryAction,
    {}
  );

  useEffect(() => {
    if (state.success && state.category) {
      toast.success("Category created");
      onSuccess(state.category);
      setOpen(false);
      // Reset form
      setSlug("");
      setSelectedIcon("Wrench");
    }
  }, [state.success, state.category, onSuccess]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full mt-2">
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add New Category
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Add Category</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="icon" value={selectedIcon} />
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

          <div className="space-y-2">
            <Label>Icon *</Label>
            <div className="grid grid-cols-5 gap-1.5 max-h-40 overflow-y-auto rounded-lg border p-2">
              {AVAILABLE_ICONS.map((name) => {
                const Icon = ICON_MAP[name];
                const isActive = selectedIcon === name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelectedIcon(name)}
                    title={name}
                    className={`flex items-center justify-center rounded-md border p-2 transition-colors ${
                      isActive
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
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
              onClick={() => setOpen(false)}
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
