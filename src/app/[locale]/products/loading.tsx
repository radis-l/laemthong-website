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
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          {/* Filter bar skeleton */}
          <div className="mb-8 space-y-4">
            <Skeleton className="h-10 w-full max-w-sm" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
          </div>

          <ProductGridSkeleton count={8} />
        </div>
      </section>
    </>
  );
}
