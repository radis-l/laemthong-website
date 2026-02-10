import type { Metadata } from "next";
import Link from "next/link";
import { adminGetAllBrands, adminGetAllCategories } from "@/lib/db/admin";
import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "New Product",
};

export default async function NewProductPage() {
  const [brands, categories] = await Promise.all([
    adminGetAllBrands(),
    adminGetAllCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Product</h1>
          <p className="text-sm text-muted-foreground">
            Add a new product to the catalog.
          </p>
        </div>
      </div>

      <div className="max-w-4xl rounded-xl border bg-card p-6">
        <ProductForm brands={brands} categories={categories} />
      </div>
    </div>
  );
}
