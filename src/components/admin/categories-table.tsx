"use client";

import { useState, useMemo, useTransition } from "react";
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
import { deleteCategoryAction } from "@/app/admin/actions/categories";
import { reorderCategories } from "@/app/admin/actions/reorder";
import { matchesSearch } from "@/lib/search";
import { getCategoryIcon } from "@/lib/category-icons";
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
import type { DbCategory } from "@/data/types";

interface CategoriesTableProps {
  categories: DbCategory[];
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState(categories);
  const [isPending, startTransition] = useTransition();

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

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.slug === active.id);
    const newIndex = items.findIndex((item) => item.slug === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(items, oldIndex, newIndex);

    // Update UI optimistically
    setItems(reordered);

    // Persist to server
    startTransition(async () => {
      try {
        await reorderCategories(reordered.map((c) => c.slug));
        toast.success("Categories reordered successfully");
      } catch (error) {
        toast.error("Failed to reorder categories");
        setItems(items); // Revert on error
      }
    });
  };

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
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead className="w-12"></TableHead>
                <TableHead>Name (EN)</TableHead>
                <TableHead>Name (TH)</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead className="w-16 text-center">Order</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!hasItems ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No categories yet.
                  </TableCell>
                </TableRow>
              ) : !hasResults ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No categories match your search.
                  </TableCell>
                </TableRow>
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
                      <TableCell className="font-medium">{cat.name.en}</TableCell>
                      <TableCell>{cat.name.th}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {cat.slug}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {(() => {
                          const Icon = getCategoryIcon(cat.icon);
                          return (
                            <span className="flex items-center gap-1.5">
                              <Icon className="h-4 w-4" />
                              {cat.icon}
                            </span>
                          );
                        })()}
                      </TableCell>
                      <TableCell className="text-center">
                        {cat.sort_order}
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
        <p className="text-sm text-muted-foreground">
          Drag to reorder is disabled while searching. Clear search to reorder categories.
        </p>
      )}

      {hasItems && isFiltering && (
        <p className="text-sm text-muted-foreground">
          Showing {filtered.length} of {categories.length} categories
        </p>
      )}
    </>
  );
}
