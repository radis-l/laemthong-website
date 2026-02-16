import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { adminGetBrandBySlug } from "@/lib/db/admin";
import { BrandForm } from "@/components/admin/brand-form";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";
import { UnsavedChangesProvider } from "@/components/admin/unsaved-changes-provider";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Edit ${slug}` };
}

export default async function EditBrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = await adminGetBrandBySlug(slug);
  if (!brand) notFound();

  return (
    <UnsavedChangesProvider>
      <div className="space-y-6">
        <div>
          <AdminBreadcrumb
            items={[
              { label: "Brands", href: "/admin/brands" },
              { label: `Edit "${brand.name}"` },
            ]}
          />
          <h1 className="mt-2 text-2xl font-bold text-foreground">
            Edit {brand.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Update brand details.
          </p>
        </div>

        <div className="max-w-3xl rounded-xl border bg-card p-6">
          <BrandForm brand={brand} />
        </div>
      </div>
    </UnsavedChangesProvider>
  );
}
