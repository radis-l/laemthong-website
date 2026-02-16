import type { Metadata } from "next";
import { adminGetAllBrands, adminGetAllCategories } from "@/lib/db/admin";
import { ProductForm } from "@/components/admin/product-form";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";
import { AdminPageTitle } from "@/components/admin/admin-page-title";
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
          <div className="mt-2">
            <AdminPageTitle
              title="New Product"
              description="Add a new product to the catalog."
            />
          </div>
        </div>

        <div className="max-w-4xl rounded-xl border bg-card p-6">
          <ProductForm brands={brands} categories={categories} />
        </div>
      </div>
    </UnsavedChangesProvider>
  );
}
