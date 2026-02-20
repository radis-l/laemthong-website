import type { Metadata } from "next";
import Link from "next/link";
import {
  adminGetProducts,
  adminGetAllBrands,
  adminGetAllCategories,
  type AdminProductsQuery,
} from "@/lib/db/admin";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { ProductsTable } from "@/components/admin/products-table";
import { ManageCategoriesSheet } from "@/components/admin/manage-categories-sheet";

export const metadata: Metadata = {
  title: "Products",
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminProductsPage({ searchParams }: Props) {
  const params = await searchParams;

  const query: AdminProductsQuery = {
    page: params.page ? Number(params.page) : 1,
    pageSize: 20,
    search: typeof params.search === "string" ? params.search : undefined,
    category: typeof params.category === "string" ? params.category : undefined,
    brand: typeof params.brand === "string" ? params.brand : undefined,
  };

  const [result, brands, categories] = await Promise.all([
    adminGetProducts(query),
    adminGetAllBrands(),
    adminGetAllCategories(),
  ]);

  // Compute product counts per category for the sheet
  const supabase = createSupabaseAdminClient();
  const categoriesWithCounts = await Promise.all(
    categories.map(async (cat) => {
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("category_slug", cat.slug);
      return { ...cat, productCount: count ?? 0 };
    })
  );

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
            Manage product catalog ({result.total.toLocaleString()})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ManageCategoriesSheet categories={categoriesWithCounts} />
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
        products={result.products}
        brandEntries={brandEntries}
        categoryEntries={categoryEntries}
        total={result.total}
        page={result.page}
        pageSize={result.pageSize}
        totalPages={result.totalPages}
      />
    </div>
  );
}
