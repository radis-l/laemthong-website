"use client";

import { useState, type ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, GripVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortableFieldItemProps {
  id: string;
  title: string;
  onRemove: () => void;
  defaultExpanded?: boolean;
  children: ReactNode;
}

export function SortableFieldItem({
  id,
  title,
  onRemove,
  defaultExpanded = true,
  children,
}: SortableFieldItemProps) {
  const [isOpen, setIsOpen] = useState(defaultExpanded);
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
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg border",
        isDragging && "z-10 opacity-80 shadow-lg"
      )}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center gap-1 px-3 py-2">
          <button
            type="button"
            className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
            <span className="sr-only">Drag to reorder</span>
          </button>

          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex flex-1 items-center gap-2 text-left text-sm font-medium"
            >
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-muted-foreground transition-transform",
                  !isOpen && "-rotate-90"
                )}
              />
              <span className="truncate">{title}</span>
            </button>
          </CollapsibleTrigger>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>

        <CollapsibleContent>
          <div className="space-y-2 px-3 pb-3">{children}</div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
