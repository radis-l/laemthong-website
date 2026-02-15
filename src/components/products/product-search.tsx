"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { useFilterNavigation } from "./products-filter-context";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

export function ProductSearch({ currentQuery = "" }: { currentQuery?: string }) {
  const t = useTranslations("products");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { navigate } = useFilterNavigation();
  const [value, setValue] = useState(currentQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setValue(currentQuery);
  }, [currentQuery]);

  const updateUrl = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (query.trim()) {
        params.set("q", query.trim());
      } else {
        params.delete("q");
      }
      params.delete("page");
      const qs = params.toString();
      navigate(`${pathname}${qs ? `?${qs}` : ""}`);
    },
    [navigate, pathname, searchParams],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateUrl(newValue), 300);
  };

  const handleClear = () => {
    setValue("");
    updateUrl("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    updateUrl(value);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={t("searchPlaceholder")}
        value={value}
        onChange={handleChange}
        className="pl-9 pr-9"
        aria-label={t("searchLabel")}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
