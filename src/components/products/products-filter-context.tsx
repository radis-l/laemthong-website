"use client";

import {
  createContext,
  useContext,
  useTransition,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "@/i18n/navigation";

type FilterContextType = {
  isPending: boolean;
  navigate: (url: string) => void;
};

const FilterContext = createContext<FilterContextType>({
  isPending: false,
  navigate: () => {},
});

export function useFilterNavigation() {
  return useContext(FilterContext);
}

export function FilterNavigationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = useCallback(
    (url: string) => {
      startTransition(() => {
        router.replace(url, { scroll: false });
      });
    },
    [router],
  );

  return (
    <FilterContext value={{ isPending, navigate }}>{children}</FilterContext>
  );
}
