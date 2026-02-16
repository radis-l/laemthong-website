import type { Metadata } from "next";
import { BrandForm } from "@/components/admin/brand-form";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";
import { AdminPageTitle } from "@/components/admin/admin-page-title";
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
          <div className="mt-2">
            <AdminPageTitle
              title="New Brand"
              description="Add a new brand partner."
            />
          </div>
        </div>

        <div className="max-w-3xl rounded-xl border bg-card p-6">
          <BrandForm />
        </div>
      </div>
    </UnsavedChangesProvider>
  );
}
