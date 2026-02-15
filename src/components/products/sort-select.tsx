"use client";

import { useFilterNavigation } from "./products-filter-context";

type Props = {
  current: string;
  sortUrls: Record<string, string>;
  labels: Record<string, string>;
  validSorts: string[];
  sortLabel: string;
};

export function SortSelect({
  current,
  sortUrls,
  labels,
  validSorts,
  sortLabel,
}: Props) {
  const { navigate } = useFilterNavigation();

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sort-select"
        className="hidden text-xs text-muted-foreground sm:inline"
      >
        {sortLabel}:
      </label>
      <select
        id="sort-select"
        value={current}
        onChange={(e) => {
          const url = sortUrls[e.target.value];
          if (url) navigate(url);
        }}
        className="h-8 cursor-pointer appearance-none rounded-lg border bg-background pr-8 pl-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
      >
        {validSorts.map((s) => (
          <option key={s} value={s}>
            {labels[s]}
          </option>
        ))}
      </select>
    </div>
  );
}
