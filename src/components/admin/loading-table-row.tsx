import { TableCell, TableRow } from "@/components/ui/table";

export function LoadingTableRow({ columns }: { columns: number }) {
  return (
    <TableRow>
      {Array.from({ length: columns }).map((_, i) => (
        <TableCell key={i}>
          <div className="h-4 bg-muted animate-pulse rounded" />
        </TableCell>
      ))}
    </TableRow>
  );
}
