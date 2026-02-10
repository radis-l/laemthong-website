import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { adminGetBrandBySlug } from "@/lib/db/admin";
import { BrandForm } from "@/components/admin/brand-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/brands">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Edit {brand.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Update brand details.
          </p>
        </div>
      </div>

      <div className="max-w-3xl rounded-xl border bg-card p-6">
        <BrandForm brand={brand} />
      </div>
    </div>
  );
}
