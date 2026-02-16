import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  adminGetProductBySlug,
  adminGetAllBrands,
  adminGetAllCategories,
} from "@/lib/db/admin";
import { ProductForm } from "@/components/admin/product-form";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";
import { UnsavedChangesProvider } from "@/components/admin/unsaved-changes-provider";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Edit ${slug}` };
}

export default async function EditProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, brands, categories] = await Promise.all([
    adminGetProductBySlug(slug),
    adminGetAllBrands(),
    adminGetAllCategories(),
  ]);

  if (!product) notFound();

  return (
    <UnsavedChangesProvider>
      <div className="space-y-6">
        <div>
          <AdminBreadcrumb
            items={[
              { label: "Products", href: "/admin/products" },
              { label: `Edit "${product.name.en}"` },
            ]}
          />
          <h1 className="mt-2 text-2xl font-bold text-foreground">
            Edit {product.name.en}
          </h1>
          <p className="text-sm text-muted-foreground">
            Update product details.
          </p>
        </div>

        <div className="max-w-4xl rounded-xl border bg-card p-6">
          <ProductForm
            product={product}
            brands={brands}
            categories={categories}
          />
        </div>
      </div>
    </UnsavedChangesProvider>
  );
}
