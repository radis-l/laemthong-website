"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Star, Search } from "lucide-react";
import { TableThumbnail } from "@/components/admin/table-thumbnail";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { deleteProductAction } from "@/app/admin/actions/products";
import { matchesSearch } from "@/lib/search";
import type { DbProduct } from "@/data/types";

interface ProductsTableProps {
  products: DbProduct[];
  brandEntries: [string, string][];
  categoryEntries: [string, string][];
}

export function ProductsTable({
  products,
  brandEntries,
  categoryEntries,
}: ProductsTableProps) {
  const [query, setQuery] = useState("");

  const brandMap = useMemo(() => new Map(brandEntries), [brandEntries]);
  const categoryMap = useMemo(
    () => new Map(categoryEntries),
    [categoryEntries]
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const brandName = brandMap.get(p.brand_slug) ?? p.brand_slug;
      const categoryName = categoryMap.get(p.category_slug) ?? p.category_slug;
      return matchesSearch(
        query,
        p.name.en,
        p.name.th,
        p.slug,
        brandName,
        categoryName
      );
    });
  }, [products, query, brandMap, categoryMap]);

  const hasItems = products.length > 0;
  const hasResults = filtered.length > 0;
  const isFiltering = query.trim().length > 0;

  return (
    <>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Name (EN)</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead className="w-16 text-center">Order</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!hasItems ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No products yet.
                </TableCell>
              </TableRow>
            ) : !hasResults ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No products match your search.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((product) => (
                <TableRow key={product.slug}>
                  <TableCell>
                    <TableThumbnail
                      src={product.image}
                      alt={product.name.en}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{product.name.en}</span>
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

      {hasItems && isFiltering && (
        <p className="text-sm text-muted-foreground">
          Showing {filtered.length} of {products.length} products
        </p>
      )}
    </>
  );
}
