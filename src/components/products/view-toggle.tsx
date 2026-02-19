"use client";

import { useFilterNavigation } from "./products-filter-context";
import { LayoutGrid, List } from "lucide-react";

type Props = {
  currentView: "grid" | "list";
  gridUrl: string;
  listUrl: string;
  gridLabel: string;
  listLabel: string;
};

export function ViewToggle({
  currentView,
  gridUrl,
  listUrl,
  gridLabel,
  listLabel,
}: Props) {
  const { navigate } = useFilterNavigation();

  return (
    <div className="flex items-center rounded-lg border">
      <button
        type="button"
        onClick={() => navigate(gridUrl)}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-l-lg transition-colors ${
          currentView === "grid"
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label={gridLabel}
        aria-pressed={currentView === "grid"}
      >
        <LayoutGrid className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => navigate(listUrl)}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-r-lg transition-colors ${
          currentView === "list"
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label={listLabel}
        aria-pressed={currentView === "list"}
      >
        <List className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
