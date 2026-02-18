"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  name: string;
};

export function BrandLogo({ src, alt, name }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="text-4xl font-bold text-muted-foreground/60">
        {name.charAt(0)}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 280px"
      className="object-contain p-6"
      onError={() => setFailed(true)}
    />
  );
}
