import type { Metadata } from "next";
import { CategoryForm } from "@/components/admin/category-form";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";
import { UnsavedChangesProvider } from "@/components/admin/unsaved-changes-provider";

export const metadata: Metadata = {
  title: "New Category",
};

export default function NewCategoryPage() {
  return (
    <UnsavedChangesProvider>
      <div className="space-y-6">
        <div>
          <AdminBreadcrumb
          items={[
            { label: "Categories", href: "/admin/categories" },
            { label: "New Category" },
          ]}
        />
        <h1 className="mt-2 text-2xl font-bold text-foreground">
          New Category
        </h1>
        <p className="text-sm text-muted-foreground">
          Add a new product category.
        </p>
      </div>

        <div className="max-w-3xl rounded-xl border bg-card p-6">
          <CategoryForm />
        </div>
      </div>
    </UnsavedChangesProvider>
  );
}
