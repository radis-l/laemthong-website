import type { Metadata } from "next";
import Link from "next/link";
import {
  adminGetAllProducts,
  adminGetAllBrands,
  adminGetAllCategories,
} from "@/lib/db/admin";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { ProductsTable } from "@/components/admin/products-table";

export const metadata: Metadata = {
  title: "Products",
};

export default async function AdminProductsPage() {
  const [products, brands, categories] = await Promise.all([
    adminGetAllProducts(),
    adminGetAllBrands(),
    adminGetAllCategories(),
  ]);

  const brandEntries: [string, string][] = brands.map((b) => [b.slug, b.name]);
  const categoryEntries: [string, string][] = categories.map((c) => [
    c.slug,
    c.name.en,
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage product catalog ({products.length})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/bulk-upload">
              <Upload className="mr-2 h-4 w-4" />
              Bulk Upload
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      <ProductsTable
        products={products}
        brandEntries={brandEntries}
        categoryEntries={categoryEntries}
      />
    </div>
  );
}
