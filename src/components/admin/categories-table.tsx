"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Search } from "lucide-react";
import { TableThumbnail } from "@/components/admin/table-thumbnail";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { deleteCategoryAction } from "@/app/admin/actions/categories";
import { matchesSearch } from "@/lib/search";
import type { DbCategory } from "@/data/types";

interface CategoriesTableProps {
  categories: DbCategory[];
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      categories.filter((c) =>
        matchesSearch(query, c.name.en, c.name.th, c.slug)
      ),
    [categories, query]
  );

  const hasItems = categories.length > 0;
  const hasResults = filtered.length > 0;
  const isFiltering = query.trim().length > 0;

  return (
    <>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
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
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No categories yet.
                </TableCell>
              </TableRow>
            ) : !hasResults ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No categories match your search.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((cat) => (
                <TableRow key={cat.slug}>
                  <TableCell>
                    <TableThumbnail src={cat.image} alt={cat.name.en} />
                  </TableCell>
                  <TableCell className="font-medium">{cat.name.en}</TableCell>
                  <TableCell>{cat.name.th}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {cat.slug}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {cat.icon}
                  </TableCell>
                  <TableCell className="text-center">
                    {cat.sort_order}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
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
          Showing {filtered.length} of {categories.length} categories
        </p>
      )}
    </>
  );
}
