import Link from "next/link";
import { PackageX, Plus } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function EmptyTableState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: { label: string; href: string };
}) {
  return (
    <TableRow>
      <TableCell colSpan={999} className="h-[400px]">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-muted">
            <PackageX className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {action && (
            <Button variant="accent" asChild>
              <Link href={action.href}>
                <Plus className="mr-2 h-4 w-4" />
                {action.label}
              </Link>
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
