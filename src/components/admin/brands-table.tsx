"use client";

import { useState, useMemo, useTransition, useEffect } from "react";
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
import { deleteBrandAction } from "@/app/admin/actions/brands";
import { reorderBrands } from "@/app/admin/actions/reorder";
import { matchesSearch } from "@/lib/search";
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
import { cn } from "@/lib/utils";
import type { DbBrand } from "@/data/types";

interface BrandWithCount extends DbBrand {
  productCount: number;
}

interface BrandsTableProps {
  brands: BrandWithCount[];
}

export function BrandsTable({ brands }: BrandsTableProps) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState(brands);
  const [isPending, startTransition] = useTransition();
  const [isScrolled, setIsScrolled] = useState(false);

  // Update local items when brands prop changes
  useMemo(() => setItems(brands), [brands]);

  // Track scroll for sticky header border
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filtered = useMemo(
    () => items.filter((b) => matchesSearch(query, b.name, b.slug, b.country)),
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
    const originalItems = items; // Capture original before state update

    // Update UI optimistically
    setItems(reordered);

    // Persist to server
    startTransition(async () => {
      try {
        await reorderBrands(reordered.map((b) => b.slug));
        toast.success("Brands reordered successfully");
      } catch (error) {
        toast.error("Failed to reorder brands");
        setItems(originalItems); // Revert on error
      }
    });
  };

  return (
    <>
      <TableSearchBar
        query={query}
        onQueryChange={setQuery}
        placeholder="Search brands..."
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
                <TableHead>Country</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!hasItems ? (
                <EmptyTableState
                  title="No brands yet"
                  description="Add your first brand to get started"
                  action={{ label: "Add Brand", href: "/admin/brands/new" }}
                />
              ) : !hasResults ? (
                <EmptyTableState
                  title="No brands match your search"
                  description="Try adjusting your search term"
                />
              ) : (
                <SortableContext
                  items={filtered.map((b) => b.slug)}
                  strategy={verticalListSortingStrategy}
                >
                  {filtered.map((brand) => (
                    <SortableTableRow
                      key={brand.slug}
                      id={brand.slug}
                      disabled={isFiltering || isPending}
                    >
                      <TableCell>
                        <TableThumbnail src={brand.logo} alt={brand.name} />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{brand.name}</div>
                          <div className="text-xs text-muted-foreground tabular-nums">
                            {brand.productCount} products • #{brand.sort_order}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{brand.country}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          ) : (
                            <>
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/admin/brands/${brand.slug}/edit`}>
                                  <Pencil className="h-4 w-4" />
                                </Link>
                              </Button>
                              <DeleteDialog
                                title={`Delete "${brand.name}"?`}
                                description="This action cannot be undone. Products associated with this brand will need to be reassigned."
                                onDelete={deleteBrandAction.bind(null, brand.slug)}
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
          Showing {filtered.length} of {brands.length} brands
        </p>
      )}
    </>
  );
}
