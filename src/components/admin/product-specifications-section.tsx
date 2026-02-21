"use client";

import { useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SortableFieldItem } from "./sortable-field-item";
import type { LocalizedString } from "@/data/types";

interface Spec {
  label: LocalizedString;
  value: LocalizedString;
}

interface ProductSpecificationsSectionProps {
  specifications: Spec[];
  onSpecificationsChange: (specs: Spec[]) => void;
}

export function ProductSpecificationsSection({
  specifications,
  onSpecificationsChange,
}: ProductSpecificationsSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const ids = specifications.map((_, i) => `spec-${i}`);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = ids.indexOf(active.id as string);
        const newIndex = ids.indexOf(over.id as string);
        if (oldIndex !== -1 && newIndex !== -1) {
          const reordered = [...specifications];
          const [moved] = reordered.splice(oldIndex, 1);
          reordered.splice(newIndex, 0, moved);
          onSpecificationsChange(reordered);
        }
      }
    },
    [specifications, onSpecificationsChange, ids]
  );

  const updateSpec = (index: number, updated: Spec) => {
    const next = [...specifications];
    next[index] = updated;
    onSpecificationsChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Specifications (Optional)</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onSpecificationsChange([
                ...specifications,
                { label: { th: "", en: "" }, value: { th: "", en: "" } },
              ])
            }
          >
            Add Spec
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Technical details like dimensions, weight, material, capacity, etc.
        </p>
      </div>

      {specifications.length > 0 && (
        <DndContext
          id="product-specifications"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {specifications.map((spec, i) => (
                <SortableFieldItem
                  key={ids[i]}
                  id={ids[i]}
                  title={spec.label.en || spec.label.th || `Spec #${i + 1}`}
                  onRemove={() =>
                    onSpecificationsChange(
                      specifications.filter((_, j) => j !== i)
                    )
                  }
                >
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Input
                      placeholder="Label (TH)"
                      value={spec.label.th}
                      onChange={(e) =>
                        updateSpec(i, {
                          ...spec,
                          label: { ...spec.label, th: e.target.value },
                        })
                      }
                    />
                    <Input
                      placeholder="Label (EN)"
                      value={spec.label.en}
                      onChange={(e) =>
                        updateSpec(i, {
                          ...spec,
                          label: { ...spec.label, en: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Input
                      placeholder="Value (TH)"
                      value={spec.value.th}
                      onChange={(e) =>
                        updateSpec(i, {
                          ...spec,
                          value: { ...spec.value, th: e.target.value },
                        })
                      }
                    />
                    <Input
                      placeholder="Value (EN)"
                      value={spec.value.en}
                      onChange={(e) =>
                        updateSpec(i, {
                          ...spec,
                          value: { ...spec.value, en: e.target.value },
                        })
                      }
                    />
                  </div>
                </SortableFieldItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
