"use client";

import { useFilterNavigation } from "./products-filter-context";

export function ProductGridWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isPending } = useFilterNavigation();

  return (
    <div
      className="transition-opacity duration-200"
      style={{ opacity: isPending ? 0.5 : 1 }}
      aria-busy={isPending}
    >
      {children}
    </div>
  );
}
