"use client";

import { useActionState, useEffect, useRef, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FormErrorAlert } from "./form-error-alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle2, AlertCircle, Circle, HelpCircle } from "lucide-react";
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
import { ProductSpecificationsSection } from "./product-specifications-section";
import { ProductFeaturesSection } from "./product-features-section";
import { ProductDocumentsSection } from "./product-documents-section";
import { QuickCreateCategoryDialog } from "./quick-create-category-dialog";
import { QuickCreateBrandDialog } from "./quick-create-brand-dialog";
import {
  createProductAction,
  updateProductAction,
  type ProductFormState,
} from "@/app/admin/actions/products";
import { FormSubmitButton } from "./form-submit-button";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";
import { getCategoryIcon } from "@/lib/category-icons";
import Image from "next/image";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { useUnsavedChangesContext } from "./unsaved-changes-provider";
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
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [currentSlug, setCurrentSlug] = useState(product?.slug ?? "");
  const [useCustomSlug, setUseCustomSlug] = useState(false);
  const [nameEn, setNameEn] = useState(product?.name.en ?? "");

  // Temporary slug for image uploads during creation (before final slug is known)
  const [tempSlug] = useState(`temp-${Date.now()}`);

  // On mount/edit: detect if slug is custom (differs from auto-generated)
  useEffect(() => {
    if (isEditing && product) {
      const autoSlug = slugify(product.name.en);
      const isCustom = product.slug !== autoSlug;
      setUseCustomSlug(isCustom);
    }
  }, [isEditing, product]);

  // Auto-generate slug when English name changes (only if not in custom mode)
  useEffect(() => {
    if (!useCustomSlug) {
      setCurrentSlug(slugify(nameEn));
    }
  }, [nameEn, useCustomSlug]);

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

  // Dynamic lists for quick-create
  const [categoriesList, setCategoriesList] = useState(categories);
  const [brandsList, setBrandsList] = useState(brands);

  const [imagesUploading, setImagesUploading] = useState(false);

  // Dirty state tracking for unsaved changes warning
  const initialState = useRef({
    slug: product?.slug ?? "",
    images: JSON.stringify(product?.images ?? []),
    specifications: JSON.stringify(product?.specifications ?? []),
    features: JSON.stringify(product?.features ?? []),
    documents: JSON.stringify(product?.documents ?? []),
    categorySlug: product?.category_slug ?? "",
    brandSlug: product?.brand_slug ?? "",
    featured: product?.featured ?? false,
  });

  const isDirty =
    currentSlug !== initialState.current.slug ||
    JSON.stringify(images) !== initialState.current.images ||
    JSON.stringify(specifications) !== initialState.current.specifications ||
    JSON.stringify(features) !== initialState.current.features ||
    JSON.stringify(documents) !== initialState.current.documents ||
    categorySlug !== initialState.current.categorySlug ||
    brandSlug !== initialState.current.brandSlug ||
    featured !== initialState.current.featured;

  useUnsavedChanges(isDirty);
  const { setIsDirty } = useUnsavedChangesContext();
  useEffect(() => { setIsDirty(isDirty); }, [isDirty, setIsDirty]);

  useEffect(() => {
    if (state.success) {
      toast.success(isEditing ? "Product updated" : "Product created");
    }
  }, [state.success, isEditing]);

  // Tab completion and error status
  type TabStatus = 'complete' | 'error' | 'incomplete';
  const tabStatus = useMemo<Record<string, TabStatus>>(() => {
    const errors = state.errors || {};

    // Check which tabs have errors
    const basicErrors = ['nameTh', 'nameEn', 'shortDescriptionTh', 'shortDescriptionEn', 'categorySlug', 'brandSlug'];
    const descriptionErrors = ['descriptionTh', 'descriptionEn'];

    const hasBasicError = basicErrors.some(field => errors[field]);
    const hasDescriptionError = descriptionErrors.some(field => errors[field]);

    // Check tab completion (for non-error states)
    // Basic tab: required fields filled
    const isBasicComplete = categorySlug && brandSlug;

    // Description tab: required fields filled (TH & EN descriptions)
    const isDescriptionComplete = true; // No easy way to check textarea content without refs

    return {
      basic: hasBasicError ? 'error' : isBasicComplete ? 'complete' : 'incomplete',
      description: hasDescriptionError ? 'error' : isDescriptionComplete ? 'complete' : 'incomplete',
      images: 'complete' as TabStatus, // Images are optional
      details: 'complete' as TabStatus, // All details are optional
    };
  }, [state.errors, categorySlug, brandSlug]);

  const getTabIcon = (status: 'complete' | 'error' | 'incomplete') => {
    if (status === 'complete') {
      return <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />;
    }
    if (status === 'error') {
      return <AlertCircle className="h-3.5 w-3.5 text-destructive" />;
    }
    return <Circle className="h-3.5 w-3.5 text-muted-foreground" />;
  };

  return (
    <form action={formAction} className="space-y-6">
      {isEditing && (
        <input type="hidden" name="originalSlug" value={product.slug} />
      )}
      <input type="hidden" name="slug" value={currentSlug} />
      <input type="hidden" name="images" value={JSON.stringify(images)} />
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

      <FormErrorAlert message={state.message} errors={state.errors} />

      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic" className="gap-2">
            {getTabIcon(tabStatus.basic)}
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="description" className="gap-2">
            {getTabIcon(tabStatus.description)}
            Description
          </TabsTrigger>
          <TabsTrigger value="images" className="gap-2">
            {getTabIcon(tabStatus.images)}
            Images
          </TabsTrigger>
          <TabsTrigger value="details" className="gap-2">
            {getTabIcon(tabStatus.details)}
            Details
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Basic Info */}
        <TabsContent value="basic" forceMount className="data-[state=inactive]:hidden space-y-6 pt-4">
          <BilingualInput
            label="Product Name"
            nameTh="nameTh"
            nameEn="nameEn"
            defaultValueTh={product?.name.th}
            defaultValueEn={product?.name.en}
            required
            errorTh={state.errors?.nameTh?.[0]}
            errorEn={state.errors?.nameEn?.[0]}
            onChangeEn={setNameEn}
            helperText="The display name of the product in both languages"
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
                      <p>The URL-friendly version of the name. Used in web addresses (e.g., &quot;hydraulic-pump&quot; → /products/hydraulic-pump). Auto-generated from the English name unless customized.</p>
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
                ⚠️ Changing the slug will migrate product images to the new URL path
              </p>
            )}

            {state.errors?.slug && (
              <p className="text-sm text-destructive">{state.errors.slug[0]}</p>
            )}
          </div>

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
            helperText="Brief summary shown in product cards (1-2 sentences)"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={categorySlug}
                onValueChange={setCategorySlug}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category">
                    {categorySlug && (() => {
                      const cat = categoriesList.find(c => c.slug === categorySlug);
                      if (!cat) return null;
                      const Icon = getCategoryIcon(cat.icon);
                      return (
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span>{cat.name.en}</span>
                        </div>
                      );
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categoriesList.map((cat) => {
                    const Icon = getCategoryIcon(cat.icon);
                    return (
                      <SelectItem key={cat.slug} value={cat.slug}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{cat.name.en}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {state.errors?.categorySlug && (
                <p className="text-xs text-destructive">
                  {state.errors.categorySlug[0]}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                The product category for organization and filtering
              </p>
              <QuickCreateCategoryDialog
                onSuccess={(newCat) => {
                  setCategoriesList([...categoriesList, newCat]);
                  setCategorySlug(newCat.slug);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Brand *</Label>
              <Select
                value={brandSlug}
                onValueChange={setBrandSlug}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select brand">
                    {brandSlug && (() => {
                      const brand = brandsList.find(b => b.slug === brandSlug);
                      if (!brand) return null;
                      return (
                        <div className="flex items-center gap-2">
                          {brand.logo ? (
                            <div className="relative h-4 w-4 rounded-sm overflow-hidden bg-muted">
                              <Image
                                src={brand.logo}
                                alt={brand.name}
                                fill
                                className="object-contain"
                                sizes="16px"
                              />
                            </div>
                          ) : (
                            <div className="h-4 w-4 rounded-sm bg-muted" />
                          )}
                          <span>{brand.name}</span>
                        </div>
                      );
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {brandsList.map((b) => (
                    <SelectItem key={b.slug} value={b.slug}>
                      <div className="flex items-center gap-2">
                        {b.logo ? (
                          <div className="relative h-5 w-5 rounded-sm overflow-hidden bg-muted">
                            <Image
                              src={b.logo}
                              alt={b.name}
                              fill
                              className="object-contain"
                              sizes="20px"
                            />
                          </div>
                        ) : (
                          <div className="h-5 w-5 rounded-sm bg-muted" />
                        )}
                        <span>{b.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.errors?.brandSlug && (
                <p className="text-xs text-destructive">
                  {state.errors.brandSlug[0]}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                The manufacturer or brand of this product
              </p>
              <QuickCreateBrandDialog
                onSuccess={(newBrand) => {
                  setBrandsList([...brandsList, newBrand]);
                  setBrandSlug(newBrand.slug);
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Switch
                id="featured"
                checked={featured}
                onCheckedChange={setFeatured}
              />
              <Label htmlFor="featured">Featured product</Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Featured products appear in the homepage hero section
            </p>
          </div>
        </TabsContent>

        {/* Tab 2: Description */}
        <TabsContent value="description" forceMount className="data-[state=inactive]:hidden space-y-6 pt-4">
          <BilingualTextarea
            label="Full Description"
            nameTh="descriptionTh"
            nameEn="descriptionEn"
            defaultValueTh={product?.description.th}
            defaultValueEn={product?.description.en}
            required
            rows={10}
            errorTh={state.errors?.descriptionTh?.[0]}
            errorEn={state.errors?.descriptionEn?.[0]}
            helperText="Detailed product information for the product detail page"
          />
        </TabsContent>

        {/* Tab 3: Images */}
        <TabsContent value="images" forceMount className="data-[state=inactive]:hidden space-y-6 pt-4">
          <div className="space-y-3">
            <div>
              <Label>Product Images (Optional)</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Upload product photos. First image is used as the thumbnail. Drag to reorder. Maximum 10 images.
              </p>
            </div>
            <ImageUpload
              label=""
              value={images}
              onChange={(urls) => setImages(urls as string[])}
              onUploadStateChange={setImagesUploading}
              folder="products"
              entitySlug={isEditing ? currentSlug : tempSlug}
              multiple
              maxFiles={10}
              aspectRatio={4 / 3}
              aspectRatioLabel="4:3 landscape"
              reorderable
              showPrimaryBadge
            />
          </div>
        </TabsContent>

        {/* Tab 4: Details */}
        <TabsContent value="details" forceMount className="data-[state=inactive]:hidden space-y-8 pt-4">
          <ProductSpecificationsSection
            specifications={specifications}
            onSpecificationsChange={setSpecifications}
          />
          <ProductFeaturesSection
            features={features}
            onFeaturesChange={setFeatures}
          />
          <ProductDocumentsSection
            documents={documents}
            onDocumentsChange={setDocuments}
          />
        </TabsContent>
      </Tabs>

      <div className="flex gap-3 border-t pt-6">
        <FormSubmitButton
          isPending={isPending}
          isUploading={imagesUploading}
          isEditing={isEditing}
          entityName="Product"
        />
      </div>
    </form>
  );
}
