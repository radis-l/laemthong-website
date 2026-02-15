import { Skeleton } from "@/components/ui/skeleton";

export default function BrandsLoading() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <Skeleton className="h-4 w-36" />
        </div>
      </div>

      {/* Hero */}
      <section className="border-b py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Skeleton className="mb-3 h-4 w-16" />
          <Skeleton className="h-12 w-72 max-w-full" />
          <Skeleton className="mt-4 h-5 w-96 max-w-full" />
        </div>
      </section>

      {/* Search + filter + grid */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-6 space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
          <div className="flex items-center justify-between border-b pb-4 pt-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>

          {/* Grid cards matching default grid view */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="overflow-hidden rounded-lg border bg-card">
                <Skeleton className="aspect-square w-full" />
                <div className="space-y-2 px-4 py-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
