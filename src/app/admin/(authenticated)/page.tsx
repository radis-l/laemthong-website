import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Building2, Tags } from "lucide-react";
import { createSupabaseClient } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Dashboard",
};

async function getCounts() {
  const supabase = createSupabaseClient();
  const [products, brands, categories] = await Promise.all([
    supabase.from("products").select("slug", { count: "exact", head: true }),
    supabase.from("brands").select("slug", { count: "exact", head: true }),
    supabase.from("categories").select("slug", { count: "exact", head: true }),
  ]);
  return {
    products: products.count ?? 0,
    brands: brands.count ?? 0,
    categories: categories.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const counts = await getCounts();

  const cards = [
    {
      title: "Products",
      count: counts.products,
      icon: Package,
      href: "/admin/products",
    },
    {
      title: "Brands",
      count: counts.brands,
      icon: Building2,
      href: "/admin/brands",
    },
    {
      title: "Categories",
      count: counts.categories,
      icon: Tags,
      href: "/admin/categories",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Manage your product catalog.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.count}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
