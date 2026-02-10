import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  adminGetProductBySlug,
  adminGetAllBrands,
  adminGetAllCategories,
} from "@/lib/db/admin";
import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Edit {product.name.en}
          </h1>
          <p className="text-sm text-muted-foreground">
            Update product details.
          </p>
        </div>
      </div>

      <div className="max-w-4xl rounded-xl border bg-card p-6">
        <ProductForm
          product={product}
          brands={brands}
          categories={categories}
        />
      </div>
    </div>
  );
}
