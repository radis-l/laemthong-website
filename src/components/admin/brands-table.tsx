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
import { deleteBrandAction } from "@/app/admin/actions/brands";
import { matchesSearch } from "@/lib/search";
import type { DbBrand } from "@/data/types";

interface BrandsTableProps {
  brands: DbBrand[];
}

export function BrandsTable({ brands }: BrandsTableProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => brands.filter((b) => matchesSearch(query, b.name, b.slug, b.country)),
    [brands, query]
  );

  const hasItems = brands.length > 0;
  const hasResults = filtered.length > 0;
  const isFiltering = query.trim().length > 0;

  return (
    <>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search brands..."
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
              <TableHead>Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Slug</TableHead>
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
                  No brands yet.
                </TableCell>
              </TableRow>
            ) : !hasResults ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No brands match your search.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((brand) => (
                <TableRow key={brand.slug}>
                  <TableCell>
                    <TableThumbnail src={brand.logo} alt={brand.name} />
                  </TableCell>
                  <TableCell className="font-medium">{brand.name}</TableCell>
                  <TableCell>{brand.country}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {brand.slug}
                  </TableCell>
                  <TableCell className="text-center">
                    {brand.sort_order}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
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
          Showing {filtered.length} of {brands.length} brands
        </p>
      )}
    </>
  );
}
