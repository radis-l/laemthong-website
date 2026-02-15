import { Skeleton } from "@/components/ui/skeleton";
import { ProductGridSkeleton } from "@/components/products/product-grid-skeleton";

export default function ProductsLoading() {
  return (
    <>
      {/* Header */}
      <section className="border-b py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Skeleton className="mb-3 h-4 w-24" />
          <Skeleton className="h-12 w-96 max-w-full" />
          <Skeleton className="mt-4 h-5 w-80 max-w-full" />
        </div>
      </section>

      {/* Filters + grid */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-6">
          {/* Filter bar skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-10 w-full max-w-sm" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>
          </div>

          {/* Results bar skeleton */}
          <div className="mt-8 mb-6 flex items-center justify-between border-b pb-4">
            <Skeleton className="h-4 w-28" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-28 rounded-lg" />
              <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
          </div>

          <ProductGridSkeleton count={8} />

          {/* Pagination skeleton */}
          <div className="mt-12 flex items-center justify-center gap-1">
            <Skeleton className="h-9 w-20 rounded-lg" />
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-9 w-9 rounded-lg" />
            ))}
            <Skeleton className="h-9 w-20 rounded-lg" />
          </div>
        </div>
      </section>
    </>
  );
}
