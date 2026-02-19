"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { GripVertical, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortableImageItemProps {
  id: string;
  url: string;
  isPrimary: boolean;
  showPrimaryBadge: boolean;
  aspectRatio: number;
  multiple: boolean;
  onRemove: (url: string) => void;
}

export function SortableImageItem({
  id,
  url,
  isPrimary,
  showPrimaryBadge,
  aspectRatio,
  multiple,
  onRemove,
}: SortableImageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(multiple ? {} : { aspectRatio: String(aspectRatio) }),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative overflow-hidden rounded-lg ring-1 ring-border bg-white",
        multiple && "aspect-square",
        showPrimaryBadge && isPrimary && "ring-2 ring-primary",
        isDragging && "z-10 opacity-80 shadow-lg"
      )}
    >
      <Image
        src={url}
        alt=""
        fill
        className="object-cover"
        sizes={multiple ? "200px" : "320px"}
      />
      {showPrimaryBadge && isPrimary && (
        <span className="absolute left-1.5 top-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
          Primary
        </span>
      )}

      {/* Drag handle + remove button */}
      <div className="absolute right-1.5 top-1.5 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {multiple && (
          <button
            type="button"
            className="cursor-grab rounded-full bg-foreground/80 p-1 text-background backdrop-blur-sm active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-3.5 w-3.5" />
            <span className="sr-only">Drag to reorder</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => onRemove(url)}
          className="rounded-full bg-destructive p-1 text-destructive-foreground"
        >
          <X className="h-3.5 w-3.5" />
          <span className="sr-only">Remove</span>
        </button>
      </div>
    </div>
  );
}
