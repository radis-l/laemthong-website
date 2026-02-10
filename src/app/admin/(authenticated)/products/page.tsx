import type { Metadata } from "next";
import Link from "next/link";
import { adminGetAllProducts, adminGetAllBrands, adminGetAllCategories } from "@/lib/db/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Star } from "lucide-react";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { deleteProductAction } from "@/app/admin/actions/products";

export const metadata: Metadata = {
  title: "Products",
};

export default async function AdminProductsPage() {
  const [products, brands, categories] = await Promise.all([
    adminGetAllProducts(),
    adminGetAllBrands(),
    adminGetAllCategories(),
  ]);

  const brandMap = new Map(brands.map((b) => [b.slug, b.name]));
  const categoryMap = new Map(categories.map((c) => [c.slug, c.name.en]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage product catalog ({products.length})
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name (EN)</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead className="w-16 text-center">Order</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No products yet.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.slug}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {product.name.en}
                      </span>
                      {product.featured && (
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {product.slug}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {categoryMap.get(product.category_slug) ??
                        product.category_slug}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {brandMap.get(product.brand_slug) ?? product.brand_slug}
                  </TableCell>
                  <TableCell className="text-center">
                    {product.sort_order}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/products/${product.slug}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteDialog
                        title={`Delete "${product.name.en}"?`}
                        description="This action cannot be undone."
                        onDelete={deleteProductAction.bind(null, product.slug)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
