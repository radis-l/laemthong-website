import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableThumbnailProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
}

export function TableThumbnail({ src, alt, className }: TableThumbnailProps) {
  const hasImage = src?.startsWith("http");

  return (
    <div
      className={cn(
        "relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted",
        className
      )}
    >
      {hasImage ? (
        <Image
          src={src!}
          alt={alt}
          fill
          sizes="40px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
