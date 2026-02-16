"use client";

import { useEffect, useRef } from "react";

/**
 * Registers a `beforeunload` listener when the form is dirty.
 * This catches browser tab close, URL bar navigation, and hard refresh.
 *
 * For client-side navigation interception, use `UnsavedChangesProvider` +
 * `AdminBreadcrumb` which checks dirty state via context.
 */
export function useUnsavedChanges(isDirty: boolean) {
  const isDirtyRef = useRef(isDirty);
  isDirtyRef.current = isDirty;

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);
}
