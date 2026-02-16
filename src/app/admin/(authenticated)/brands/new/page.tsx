import type { Metadata } from "next";
import { BrandForm } from "@/components/admin/brand-form";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";
import { UnsavedChangesProvider } from "@/components/admin/unsaved-changes-provider";

export const metadata: Metadata = {
  title: "New Brand",
};

export default function NewBrandPage() {
  return (
    <UnsavedChangesProvider>
      <div className="space-y-6">
        <div>
          <AdminBreadcrumb
          items={[
            { label: "Brands", href: "/admin/brands" },
            { label: "New Brand" },
          ]}
        />
        <h1 className="mt-2 text-2xl font-bold text-foreground">New Brand</h1>
        <p className="text-sm text-muted-foreground">
          Add a new brand partner.
        </p>
      </div>

        <div className="max-w-3xl rounded-xl border bg-card p-6">
          <BrandForm />
        </div>
      </div>
    </UnsavedChangesProvider>
  );
}
