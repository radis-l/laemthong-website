import { Skeleton } from "@/components/ui/skeleton";

export default function BrandsLoading() {
  return (
    <>
      {/* Hero */}
      <section className="border-b py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Skeleton className="mb-3 h-4 w-16" />
          <Skeleton className="h-12 w-72 max-w-full" />
          <Skeleton className="mt-4 h-5 w-96 max-w-full" />
        </div>
      </section>

      {/* Brand grid */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="overflow-hidden rounded-lg border bg-card">
                <Skeleton className="aspect-square w-full" />
                <div className="h-0.5 w-full bg-primary/20" />
                <div className="space-y-2 px-4 py-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
