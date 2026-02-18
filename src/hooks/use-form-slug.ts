"use client";

import { useState, useEffect } from "react";
import { slugify } from "@/lib/utils";

interface UseFormSlugOptions {
  initialSlug: string;
  initialName: string;
  isEditing: boolean;
}

export function useFormSlug({
  initialSlug,
  initialName,
  isEditing,
}: UseFormSlugOptions) {
  const [slug, setSlug] = useState(initialSlug);
  const [isCustomSlug, setIsCustomSlug] = useState(false);
  const [trackedName, setTrackedName] = useState(initialName);

  // On mount/edit: detect if slug is custom (differs from auto-generated)
  useEffect(() => {
    if (isEditing && initialName) {
      setIsCustomSlug(initialSlug !== slugify(initialName));
    }
  }, [isEditing, initialSlug, initialName]);

  // Auto-generate slug when name changes (only if not in custom mode)
  useEffect(() => {
    if (!isCustomSlug) {
      setSlug(slugify(trackedName));
    }
  }, [trackedName, isCustomSlug]);

  const handleNameChange = (name: string) => {
    setTrackedName(name);
  };

  return {
    slug,
    setSlug,
    isCustomSlug,
    setIsCustomSlug,
    handleNameChange,
  };
}
