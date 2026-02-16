import type { Metadata } from "next";
import Link from "next/link";
import { adminGetAllBrands } from "@/lib/db/admin";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BrandsTable } from "@/components/admin/brands-table";

export const metadata: Metadata = {
  title: "Brands",
};

export default async function AdminBrandsPage() {
  const brands = await adminGetAllBrands();
  const supabase = createSupabaseAdminClient();

  // Fetch product counts for each brand
  const brandsWithCounts = await Promise.all(
    brands.map(async (brand) => {
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("brand_slug", brand.slug);

      return { ...brand, productCount: count ?? 0 };
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Brands</h1>
          <p className="text-sm text-muted-foreground">
            Manage brand partners ({brands.length})
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/brands/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Brand
          </Link>
        </Button>
      </div>

      <BrandsTable brands={brandsWithCounts} />
    </div>
  );
}
