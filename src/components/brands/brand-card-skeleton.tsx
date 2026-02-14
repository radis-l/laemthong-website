import { Skeleton } from "@/components/ui/skeleton";

export function BrandCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="grid gap-6 p-8 md:grid-cols-[200px_1fr]">
        <Skeleton className="flex h-32 items-center justify-center rounded-lg" />
        <div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-1 h-4 w-4/5" />
          <Skeleton className="mt-4 h-4 w-48" />
        </div>
      </div>
    </div>
  );
}
