"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { TableSearchBar } from "./table-search-bar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Loader2 } from "lucide-react";
import { TableThumbnail } from "@/components/admin/table-thumbnail";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { EmptyTableState } from "@/components/admin/empty-table-state";
import { deleteCategoryAction } from "@/app/admin/actions/categories";
import { reorderCategories } from "@/app/admin/actions/reorder";
import { matchesSearch } from "@/lib/search";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTableRow } from "./sortable-table-row";
import { useSortableTable } from "@/hooks/use-sortable-table";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils";
import type { DbCategory } from "@/data/types";

interface CategoryWithCount extends DbCategory {
  productCount: number;
}

interface CategoriesTableProps {
  categories: CategoryWithCount[];
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState(categories);
  const isScrolled = useScrolled();

  // Update local items when categories prop changes
  useMemo(() => setItems(categories), [categories]);

  const filtered = useMemo(
    () =>
      items.filter((c) =>
        matchesSearch(query, c.name.en, c.name.th, c.slug)
      ),
    [items, query]
  );

  const hasItems = items.length > 0;
  const hasResults = filtered.length > 0;
  const isFiltering = query.trim().length > 0;

  const { sensors, handleDragEnd, isPending } = useSortableTable({
    items,
    setItems,
    reorderAction: (slugs) => reorderCategories(slugs),
    getId: (item) => item.slug,
    successMessage: "Categories reordered successfully",
    errorMessage: "Failed to reorder categories",
    disabled: isFiltering,
  });

  return (
    <>
      <TableSearchBar
        query={query}
        onQueryChange={setQuery}
        placeholder="Search categories..."
      />

      <div className="rounded-xl border">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHeader
              className={cn(
                "sticky top-0 z-10 bg-background",
                isScrolled && "border-b-2 border-primary"
              )}
            >
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead className="w-12"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!hasItems ? (
                <EmptyTableState
                  title="No categories yet"
                  description="Add your first category to get started"
                  action={{ label: "Add Category", href: "/admin/categories/new" }}
                />
              ) : !hasResults ? (
                <EmptyTableState
                  title="No categories match your search"
                  description="Try adjusting your search term"
                />
              ) : (
                <SortableContext
                  items={filtered.map((c) => c.slug)}
                  strategy={verticalListSortingStrategy}
                >
                  {filtered.map((cat) => (
                    <SortableTableRow
                      key={cat.slug}
                      id={cat.slug}
                      disabled={isFiltering || isPending}
                    >
                      <TableCell>
                        <TableThumbnail src={cat.image} alt={cat.name.en} />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{cat.name.en}</div>
                          <div className="text-xs text-muted-foreground tabular-nums">
                            {cat.name.th} • {cat.productCount} products • #{cat.sort_order}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          ) : (
                            <>
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/admin/categories/${cat.slug}/edit`}>
                                  <Pencil className="h-4 w-4" />
                                </Link>
                              </Button>
                              <DeleteDialog
                                title={`Delete "${cat.name.en}"?`}
                                description="This action cannot be undone. Products in this category will need to be reassigned."
                                onDelete={deleteCategoryAction.bind(null, cat.slug)}
                              />
                            </>
                          )}
                        </div>
                      </TableCell>
                    </SortableTableRow>
                  ))}
                </SortableContext>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>

      {isFiltering && hasResults && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Drag to reorder is disabled while searching.</span>
          <Button
            variant="link"
            size="sm"
            onClick={() => setQuery("")}
            className="h-auto p-0 text-sm underline"
          >
            Clear search
          </Button>
          <span>to enable drag and drop.</span>
        </div>
      )}

      {hasItems && isFiltering && (
        <p className="text-sm text-muted-foreground">
          Showing {filtered.length} of {categories.length} categories
        </p>
      )}
    </>
  );
}
