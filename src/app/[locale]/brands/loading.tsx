import { Skeleton } from "@/components/ui/skeleton";
import { BrandCardSkeleton } from "@/components/brands/brand-card-skeleton";

export default function BrandsLoading() {
  return (
    <>
      {/* Header */}
      <section className="border-b py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Skeleton className="mb-3 h-4 w-16" />
          <Skeleton className="h-12 w-72 max-w-full" />
          <Skeleton className="mt-4 h-5 w-96 max-w-full" />
        </div>
      </section>

      {/* Brand cards */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="space-y-8">
            {Array.from({ length: 3 }, (_, i) => (
              <BrandCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
