"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

export function FadeImage({ className, onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      {...props}
      className={cn(
        "transition-opacity duration-300",
        loaded ? "opacity-100" : "opacity-0",
        className
      )}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
    />
  );
}
