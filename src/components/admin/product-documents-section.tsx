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

interface Doc {
  name: string;
  url: string;
}

interface ProductDocumentsSectionProps {
  documents: Doc[];
  onDocumentsChange: (docs: Doc[]) => void;
}

export function ProductDocumentsSection({
  documents,
  onDocumentsChange,
}: ProductDocumentsSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const ids = documents.map((_, i) => `doc-${i}`);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = ids.indexOf(active.id as string);
        const newIndex = ids.indexOf(over.id as string);
        if (oldIndex !== -1 && newIndex !== -1) {
          const reordered = [...documents];
          const [moved] = reordered.splice(oldIndex, 1);
          reordered.splice(newIndex, 0, moved);
          onDocumentsChange(reordered);
        }
      }
    },
    [documents, onDocumentsChange, ids]
  );

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Documents (Optional)</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onDocumentsChange([...documents, { name: "", url: "" }])
            }
          >
            Add Document
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Datasheets, manuals, certifications, or other downloadable resources
        </p>
      </div>

      {documents.length > 0 && (
        <DndContext
          id="product-documents"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {documents.map((doc, i) => (
                <SortableFieldItem
                  key={ids[i]}
                  id={ids[i]}
                  title={doc.name || `Document #${i + 1}`}
                  onRemove={() =>
                    onDocumentsChange(documents.filter((_, j) => j !== i))
                  }
                >
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Input
                      placeholder="Document name"
                      value={doc.name}
                      onChange={(e) => {
                        const updated = [...documents];
                        updated[i] = { ...updated[i], name: e.target.value };
                        onDocumentsChange(updated);
                      }}
                    />
                    <Input
                      placeholder="URL"
                      value={doc.url}
                      onChange={(e) => {
                        const updated = [...documents];
                        updated[i] = { ...updated[i], url: e.target.value };
                        onDocumentsChange(updated);
                      }}
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
