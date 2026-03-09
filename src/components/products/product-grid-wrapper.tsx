"use client";

import { useFilterNavigation } from "./products-filter-context";

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="aspect-[4/3] animate-pulse bg-muted/60" />
      <div className="h-px w-full bg-border" />
      <div className="space-y-2.5 px-5 py-4">
        <div className="h-3 w-20 animate-pulse rounded bg-muted/60" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted/60" />
        <div className="h-3 w-full animate-pulse rounded bg-muted/60" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-muted/60" />
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function ProductGridWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isPending } = useFilterNavigation();

  return (
    <div className="relative" aria-busy={isPending}>
      <div
        className="transition-opacity duration-200"
        style={{ opacity: isPending ? 0 : 1 }}
      >
        {children}
      </div>
      {isPending && (
        <div className="absolute inset-0">
          <SkeletonGrid />
        </div>
      )}
    </div>
  );
}
