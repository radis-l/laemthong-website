import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      {/* Product detail */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Image */}
            <div>
              <Skeleton className="aspect-[4/3] rounded-lg" />
              <div className="mt-3 grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }, (_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-lg" />
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
              <Skeleton className="mt-4 h-10 w-3/4" />
              <Skeleton className="mt-4 h-5 w-full" />
              <Skeleton className="mt-1 h-5 w-4/5" />
              <Skeleton className="mt-1 h-5 w-2/3" />

              {/* Features */}
              <Skeleton className="mt-6 h-5 w-24" />
              <div className="mt-3 space-y-2">
                {Array.from({ length: 4 }, (_, i) => (
                  <Skeleton key={i} className="h-4 w-4/5" />
                ))}
              </div>

              <Skeleton className="mt-8 h-12 w-48" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
