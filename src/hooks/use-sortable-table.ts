"use client";

import { useTransition } from "react";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { toast } from "sonner";

interface UseSortableTableOptions<T> {
  items: T[];
  setItems: (items: T[]) => void;
  reorderAction: (slugs: string[]) => Promise<void>;
  getId: (item: T) => string;
  successMessage?: string;
  errorMessage?: string;
  disabled?: boolean;
}

export function useSortableTable<T>({
  items,
  setItems,
  reorderAction,
  getId,
  successMessage = "Reordered successfully",
  errorMessage = "Failed to reorder",
  disabled = false,
}: UseSortableTableOptions<T>) {
  const [isPending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || disabled) return;

    const oldIndex = items.findIndex((item) => getId(item) === active.id);
    const newIndex = items.findIndex((item) => getId(item) === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(items, oldIndex, newIndex);
    const originalItems = items;

    // Optimistic update
    setItems(reordered);

    // Persist to server
    startTransition(async () => {
      try {
        await reorderAction(reordered.map(getId));
        toast.success(successMessage);
      } catch {
        toast.error(errorMessage);
        setItems(originalItems);
      }
    });
  };

  return { sensors, handleDragEnd, isPending };
}
