"use client";

import { useFilterNavigation } from "./products-filter-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      <span className="hidden text-xs text-muted-foreground sm:inline">
        {sortLabel}:
      </span>
      <Select
        value={current}
        onValueChange={(value) => {
          const url = sortUrls[value];
          if (url) navigate(url);
        }}
      >
        <SelectTrigger className="h-8 w-auto gap-1.5 rounded-lg border text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {validSorts.map((s) => (
            <SelectItem key={s} value={s}>
              {labels[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
