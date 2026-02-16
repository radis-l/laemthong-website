import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { adminGetCategoryBySlug } from "@/lib/db/admin";
import { CategoryForm } from "@/components/admin/category-form";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";
import { UnsavedChangesProvider } from "@/components/admin/unsaved-changes-provider";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Edit ${slug}` };
}

export default async function EditCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await adminGetCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <UnsavedChangesProvider>
      <div className="space-y-6">
        <div>
          <AdminBreadcrumb
            items={[
              { label: "Categories", href: "/admin/categories" },
              { label: `Edit "${category.name.en}"` },
            ]}
          />
          <h1 className="mt-2 text-2xl font-bold text-foreground">
            Edit {category.name.en}
          </h1>
          <p className="text-sm text-muted-foreground">
            Update category details.
          </p>
        </div>

        <div className="max-w-3xl rounded-xl border bg-card p-6">
          <CategoryForm category={category} />
        </div>
      </div>
    </UnsavedChangesProvider>
  );
}
