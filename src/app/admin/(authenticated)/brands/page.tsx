import type { Metadata } from "next";
import Link from "next/link";
import { adminGetAllBrands } from "@/lib/db/admin";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil } from "lucide-react";
import { TableThumbnail } from "@/components/admin/table-thumbnail";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { deleteBrandAction } from "@/app/admin/actions/brands";

export const metadata: Metadata = {
  title: "Brands",
};

export default async function AdminBrandsPage() {
  const brands = await adminGetAllBrands();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Brands</h1>
          <p className="text-sm text-muted-foreground">
            Manage brand partners ({brands.length})
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/brands/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Brand
          </Link>
        </Button>
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
            {brands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No brands yet.
                </TableCell>
              </TableRow>
            ) : (
              brands.map((brand) => (
                <TableRow key={brand.slug}>
                  <TableCell>
                    <TableThumbnail
                      src={brand.logo}
                      alt={brand.name}
                    />
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
    </div>
  );
}
