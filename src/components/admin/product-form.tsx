"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BilingualInput } from "./bilingual-input";
import { BilingualTextarea } from "./bilingual-textarea";
import { ImageUpload } from "./image-upload";
import {
  createProductAction,
  updateProductAction,
  type ProductFormState,
} from "@/app/admin/actions/products";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { DbProduct, DbBrand, DbCategory, LocalizedString } from "@/data/types";

interface ProductFormProps {
  product?: DbProduct;
  brands: DbBrand[];
  categories: DbCategory[];
}

export function ProductForm({ product, brands, categories }: ProductFormProps) {
  const isEditing = !!product;
  const action = isEditing ? updateProductAction : createProductAction;

  const [state, formAction, isPending] = useActionState<
    ProductFormState,
    FormData
  >(action, {});

  // Complex state for JSON fields
  const [gallery, setGallery] = useState<string[]>(product?.gallery ?? []);
  const [mainImage, setMainImage] = useState<string>(product?.image ?? "");
  const [currentSlug, setCurrentSlug] = useState(product?.slug ?? "");
  const [specifications, setSpecifications] = useState<
    { label: LocalizedString; value: LocalizedString }[]
  >(product?.specifications ?? []);
  const [features, setFeatures] = useState<LocalizedString[]>(
    product?.features ?? []
  );
  const [documents, setDocuments] = useState<{ name: string; url: string }[]>(
    product?.documents ?? []
  );
  const [featured, setFeatured] = useState(product?.featured ?? false);

  const [categorySlug, setCategorySlug] = useState(product?.category_slug ?? "");
  const [brandSlug, setBrandSlug] = useState(product?.brand_slug ?? "");

  useEffect(() => {
    if (state.success) {
      toast.success(isEditing ? "Product updated" : "Product created");
    }
  }, [state.success, isEditing]);

  return (
    <form action={formAction} className="space-y-6">
      {isEditing && (
        <input type="hidden" name="originalSlug" value={product.slug} />
      )}
      <input type="hidden" name="image" value={mainImage} />
      <input type="hidden" name="gallery" value={JSON.stringify(gallery)} />
      <input
        type="hidden"
        name="specifications"
        value={JSON.stringify(specifications)}
      />
      <input type="hidden" name="features" value={JSON.stringify(features)} />
      <input type="hidden" name="documents" value={JSON.stringify(documents)} />
      {featured && <input type="hidden" name="featured" value="on" />}
      <input type="hidden" name="categorySlug" value={categorySlug} />
      <input type="hidden" name="brandSlug" value={brandSlug} />

      {state.message && (
        <Alert variant="destructive">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
      {state.errors && Object.keys(state.errors).length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            <p className="font-medium">Please fix the following errors:</p>
            <ul className="mt-1 list-disc pl-4 text-sm">
              {Object.entries(state.errors).map(([field, msgs]) => (
                <li key={field}>
                  <strong>{field}</strong>: {msgs.join(", ")}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        {/* Tab 1: Basic Info */}
        <TabsContent value="basic" className="space-y-6 pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={product?.slug}
                placeholder="product-name"
                required
                onChange={(e) => setCurrentSlug(e.target.value)}
              />
              {state.errors?.slug && (
                <p className="text-xs text-destructive">
                  {state.errors.slug[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input
                id="sortOrder"
                name="sortOrder"
                type="number"
                defaultValue={product?.sort_order ?? 0}
                min={0}
              />
            </div>
          </div>

          <BilingualInput
            label="Name"
            nameTh="nameTh"
            nameEn="nameEn"
            defaultValueTh={product?.name.th}
            defaultValueEn={product?.name.en}
            required
            errorTh={state.errors?.nameTh?.[0]}
            errorEn={state.errors?.nameEn?.[0]}
          />

          <BilingualTextarea
            label="Short Description"
            nameTh="shortDescriptionTh"
            nameEn="shortDescriptionEn"
            defaultValueTh={product?.short_description.th}
            defaultValueEn={product?.short_description.en}
            required
            rows={2}
            errorTh={state.errors?.shortDescriptionTh?.[0]}
            errorEn={state.errors?.shortDescriptionEn?.[0]}
          />

          <BilingualTextarea
            label="Full Description"
            nameTh="descriptionTh"
            nameEn="descriptionEn"
            defaultValueTh={product?.description.th}
            defaultValueEn={product?.description.en}
            required
            rows={5}
            errorTh={state.errors?.descriptionTh?.[0]}
            errorEn={state.errors?.descriptionEn?.[0]}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={categorySlug}
                onValueChange={setCategorySlug}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.slug} value={cat.slug}>
                      {cat.name.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.errors?.categorySlug && (
                <p className="text-xs text-destructive">
                  {state.errors.categorySlug[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Brand *</Label>
              <Select
                value={brandSlug}
                onValueChange={setBrandSlug}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((b) => (
                    <SelectItem key={b.slug} value={b.slug}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.errors?.brandSlug && (
                <p className="text-xs text-destructive">
                  {state.errors.brandSlug[0]}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="featured"
              checked={featured}
              onCheckedChange={setFeatured}
            />
            <Label htmlFor="featured">Featured product</Label>
          </div>
        </TabsContent>

        {/* Tab 2: Images */}
        <TabsContent value="images" className="space-y-6 pt-4">
          <ImageUpload
            label="Main Image"
            value={mainImage}
            onChange={(url) => setMainImage(url as string)}
            folder="products"
            entitySlug={currentSlug}
          />

          <ImageUpload
            label="Gallery Images"
            value={gallery}
            onChange={(urls) => setGallery(urls as string[])}
            folder="products"
            entitySlug={currentSlug}
            multiple
            maxFiles={10}
          />
        </TabsContent>

        {/* Tab 3: Details */}
        <TabsContent value="details" className="space-y-8 pt-4">
          {/* Specifications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Specifications</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setSpecifications([
                    ...specifications,
                    {
                      label: { th: "", en: "" },
                      value: { th: "", en: "" },
                    },
                  ])
                }
              >
                Add Spec
              </Button>
            </div>
            {specifications.map((spec, i) => (
              <div key={i} className="rounded-lg border p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted-foreground">
                    Spec #{i + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setSpecifications(specifications.filter((_, j) => j !== i))
                    }
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input
                    placeholder="Label (TH)"
                    value={spec.label.th}
                    onChange={(e) => {
                      const updated = [...specifications];
                      updated[i] = {
                        ...updated[i],
                        label: { ...updated[i].label, th: e.target.value },
                      };
                      setSpecifications(updated);
                    }}
                  />
                  <Input
                    placeholder="Label (EN)"
                    value={spec.label.en}
                    onChange={(e) => {
                      const updated = [...specifications];
                      updated[i] = {
                        ...updated[i],
                        label: { ...updated[i].label, en: e.target.value },
                      };
                      setSpecifications(updated);
                    }}
                  />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input
                    placeholder="Value (TH)"
                    value={spec.value.th}
                    onChange={(e) => {
                      const updated = [...specifications];
                      updated[i] = {
                        ...updated[i],
                        value: { ...updated[i].value, th: e.target.value },
                      };
                      setSpecifications(updated);
                    }}
                  />
                  <Input
                    placeholder="Value (EN)"
                    value={spec.value.en}
                    onChange={(e) => {
                      const updated = [...specifications];
                      updated[i] = {
                        ...updated[i],
                        value: { ...updated[i].value, en: e.target.value },
                      };
                      setSpecifications(updated);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Features</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setFeatures([...features, { th: "", en: "" }])
                }
              >
                Add Feature
              </Button>
            </div>
            {features.map((feature, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  placeholder="Feature (TH)"
                  value={feature.th}
                  onChange={(e) => {
                    const updated = [...features];
                    updated[i] = { ...updated[i], th: e.target.value };
                    setFeatures(updated);
                  }}
                />
                <Input
                  placeholder="Feature (EN)"
                  value={feature.en}
                  onChange={(e) => {
                    const updated = [...features];
                    updated[i] = { ...updated[i], en: e.target.value };
                    setFeatures(updated);
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setFeatures(features.filter((_, j) => j !== i))
                  }
                >
                  <span className="sr-only">Remove</span>
                  &times;
                </Button>
              </div>
            ))}
          </div>

          {/* Documents */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Documents</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setDocuments([...documents, { name: "", url: "" }])
                }
              >
                Add Document
              </Button>
            </div>
            {documents.map((doc, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  placeholder="Document name"
                  value={doc.name}
                  onChange={(e) => {
                    const updated = [...documents];
                    updated[i] = { ...updated[i], name: e.target.value };
                    setDocuments(updated);
                  }}
                />
                <Input
                  placeholder="URL"
                  value={doc.url}
                  onChange={(e) => {
                    const updated = [...documents];
                    updated[i] = { ...updated[i], url: e.target.value };
                    setDocuments(updated);
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setDocuments(documents.filter((_, j) => j !== i))
                  }
                >
                  <span className="sr-only">Remove</span>
                  &times;
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-3 border-t pt-6">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : isEditing ? (
            "Update Product"
          ) : (
            "Create Product"
          )}
        </Button>
      </div>
    </form>
  );
}
