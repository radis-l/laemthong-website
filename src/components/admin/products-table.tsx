"use client";

import { useState, useMemo, useCallback, useTransition } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
import { Pencil, Star, Trash2, Loader2, X, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { TableThumbnail } from "@/components/admin/table-thumbnail";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { ProductsTableToolbar } from "@/components/admin/products-table-toolbar";
import { PaginationControls } from "@/components/admin/pagination-controls";
import {
  deleteProductAction,
  bulkDeleteProductsAction,
} from "@/app/admin/actions/products";
import { reorderProducts } from "@/app/admin/actions/reorder";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTableRow } from "./sortable-table-row";
import { toast } from "sonner";
import type { DbProduct } from "@/data/types";

interface ProductsTableProps {
  products: DbProduct[];
  brandEntries: [string, string][];
  categoryEntries: [string, string][];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

type SortColumn = "name" | "sort_order" | "updated_at";

export function ProductsTable({
  products,
  brandEntries,
  categoryEntries,
  total,
  page,
  pageSize,
  totalPages,
}: ProductsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [items, setItems] = useState(products);

  // Update local items when products prop changes
  useMemo(() => setItems(products), [products]);

  const brandMap = useMemo(() => new Map(brandEntries), [brandEntries]);
  const categoryMap = useMemo(
    () => new Map(categoryEntries),
    [categoryEntries]
  );

  const currentSort = (searchParams.get("sort") as SortColumn) || "sort_order";
  const currentDir = searchParams.get("dir") || "asc";
  const canReorder = currentSort === "sort_order" && currentDir === "asc";

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !canReorder) return;

    const oldIndex = items.findIndex((item) => item.slug === active.id);
    const newIndex = items.findIndex((item) => item.slug === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(items, oldIndex, newIndex);

    // Update UI optimistically
    setItems(reordered);

    // Persist to server
    startTransition(async () => {
      try {
        await reorderProducts(reordered.map((p) => p.slug));
        toast.success("Products reordered successfully");
      } catch (error) {
        toast.error("Failed to reorder products");
        setItems(items); // Revert on error
      }
    });
  };

  const handleSort = useCallback(
    (column: SortColumn) => {
      const params = new URLSearchParams(searchParams.toString());
      if (currentSort === column) {
        // Toggle direction
        params.set("dir", currentDir === "asc" ? "desc" : "asc");
      } else {
        params.set("sort", column);
        params.set("dir", "asc");
      }
      params.delete("page");
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams, currentSort, currentDir]
  );

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (currentSort !== column) return <ArrowUpDown className="ml-1 h-3 w-3" />;
    return currentDir === "asc" ? (
      <ArrowUp className="ml-1 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3" />
    );
  };

  const allPageSelected =
    products.length > 0 &&
    products.every((p) => selectedSlugs.has(p.slug));

  const toggleSelectAll = () => {
    if (allPageSelected) {
      const newSet = new Set(selectedSlugs);
      for (const p of products) newSet.delete(p.slug);
      setSelectedSlugs(newSet);
    } else {
      const newSet = new Set(selectedSlugs);
      for (const p of products) newSet.add(p.slug);
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
    <div className="space-y-4">
      {/* Toolbar: Search + Filters */}
      <div className="flex items-center gap-4">
        <ProductsTableToolbar
          brandEntries={brandEntries}
          categoryEntries={categoryEntries}
        />
      </div>

      {/* Bulk Actions Bar */}
      {selectedSlugs.size > 0 && (
        <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-4 py-2">
          <span className="text-sm font-medium">
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

      <div className="rounded-xl border">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={allPageSelected && items.length > 0}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                {canReorder && <TableHead className="w-10"></TableHead>}
                <TableHead className="w-12"></TableHead>
                <TableHead>
                  <button
                    type="button"
                    onClick={() => handleSort("name")}
                    disabled={isPending}
                    className="inline-flex items-center font-medium hover:text-foreground"
                  >
                    Name (EN)
                    <SortIcon column="name" />
                  </button>
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead className="w-16">
                  <button
                    type="button"
                    onClick={() => handleSort("sort_order")}
                    disabled={isPending}
                    className="inline-flex items-center font-medium hover:text-foreground"
                  >
                    Order
                    <SortIcon column="sort_order" />
                  </button>
                </TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={canReorder ? 8 : 7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {total === 0 ? "No products yet." : "No products match your filters."}
                  </TableCell>
                </TableRow>
              ) : canReorder ? (
                <SortableContext
                  items={items.map((p) => p.slug)}
                  strategy={verticalListSortingStrategy}
                >
                  {items.map((product) => (
                    <SortableTableRow
                      key={product.slug}
                      id={product.slug}
                      disabled={isPending}
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
                          {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          ) : (
                            <>
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
                            </>
                          )}
                        </div>
                      </TableCell>
                    </SortableTableRow>
                  ))}
                </SortableContext>
              ) : (
                items.map((product) => (
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
        </DndContext>
      </div>

      {!canReorder && items.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Drag to reorder is only available when sorted by Order (ascending). Click "Order" column to enable drag and drop.
        </p>
      )}

      {/* Pagination */}
      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
      />

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
    </div>
  );
}
