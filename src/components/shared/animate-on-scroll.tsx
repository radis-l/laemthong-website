"use client";

import type { ReactNode } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
};

const directionClasses = {
  up: "translate-y-3",
  left: "translate-x-3",
  right: "-translate-x-3",
  none: "",
};

export function AnimateOnScroll({
  children,
  className,
  delay = 0,
  direction = "up",
}: Props) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-500 ease-out",
        isInView
          ? "opacity-100 translate-x-0 translate-y-0"
          : cn("opacity-0", directionClasses[direction]),
        className,
      )}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
