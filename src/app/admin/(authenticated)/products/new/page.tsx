import type { Metadata } from "next";
import { adminGetAllBrands, adminGetAllCategories } from "@/lib/db/admin";
import { ProductForm } from "@/components/admin/product-form";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";
import { UnsavedChangesProvider } from "@/components/admin/unsaved-changes-provider";

export const metadata: Metadata = {
  title: "New Product",
};

export default async function NewProductPage() {
  const [brands, categories] = await Promise.all([
    adminGetAllBrands(),
    adminGetAllCategories(),
  ]);

  return (
    <UnsavedChangesProvider>
      <div className="space-y-6">
        <div>
          <AdminBreadcrumb
            items={[
              { label: "Products", href: "/admin/products" },
              { label: "New Product" },
            ]}
          />
          <h1 className="mt-2 text-2xl font-bold text-foreground">
            New Product
          </h1>
          <p className="text-sm text-muted-foreground">
            Add a new product to the catalog.
          </p>
        </div>

        <div className="max-w-4xl rounded-xl border bg-card p-6">
          <ProductForm brands={brands} categories={categories} />
        </div>
      </div>
    </UnsavedChangesProvider>
  );
}
