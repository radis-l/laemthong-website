"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { TableSearchBar } from "./table-search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Star, Trash2, Loader2, X } from "lucide-react";
import { TableThumbnail } from "@/components/admin/table-thumbnail";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import {
  deleteProductAction,
  bulkDeleteProductsAction,
} from "@/app/admin/actions/products";
import { matchesSearch } from "@/lib/search";
import { toast } from "sonner";
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
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const allFilteredSelected =
    filtered.length > 0 &&
    filtered.every((p) => selectedSlugs.has(p.slug));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      const newSet = new Set(selectedSlugs);
      for (const p of filtered) newSet.delete(p.slug);
      setSelectedSlugs(newSet);
    } else {
      const newSet = new Set(selectedSlugs);
      for (const p of filtered) newSet.add(p.slug);
      setSelectedSlugs(newSet);
    }
  };

  const toggleSelect = (slug: string) => {
    const newSet = new Set(selectedSlugs);
    if (newSet.has(slug)) {
      newSet.delete(slug);
    } else {
      newSet.add(slug);
    }
    setSelectedSlugs(newSet);
  };

  const handleBulkDelete = async () => {
    setIsDeleting(true);
    const slugs = Array.from(selectedSlugs);
    const result = await bulkDeleteProductsAction(slugs);
    setIsDeleting(false);
    setShowDeleteDialog(false);

    if (result.message) {
      toast.error(result.message);
    } else {
      toast.success(`Deleted ${result.deleted} product(s)`);
      setSelectedSlugs(new Set());
    }
  };

  return (
    <>
      {/* Search + Bulk Actions Bar */}
      <div className="flex items-center gap-4">
        <TableSearchBar
          query={query}
          onQueryChange={setQuery}
          placeholder="Search products..."
        />

        {selectedSlugs.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedSlugs.size} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedSlugs(new Set())}
            >
              <X className="mr-1 h-3 w-3" />
              Deselect
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-1 h-3 w-3" />
              Delete {selectedSlugs.size}
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={allFilteredSelected && filtered.length > 0}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
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
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No products yet.
                </TableCell>
              </TableRow>
            ) : !hasResults ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No products match your search.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((product) => (
                <TableRow
                  key={product.slug}
                  className={
                    selectedSlugs.has(product.slug) ? "bg-muted/50" : ""
                  }
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedSlugs.has(product.slug)}
                      onCheckedChange={() => toggleSelect(product.slug)}
                      aria-label={`Select ${product.name.en}`}
                    />
                  </TableCell>
                  <TableCell>
                    <TableThumbnail
                      src={product.images[0]}
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

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {selectedSlugs.size} products?</DialogTitle>
            <DialogDescription>
              This will permanently delete {selectedSlugs.size} product(s) and
              all their images. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete {selectedSlugs.size} Products
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
