"use client";

import { useEffect } from "react";

/**
 * Registers a `beforeunload` listener when the form is dirty.
 * This catches browser tab close, URL bar navigation, and hard refresh.
 *
 * For client-side navigation interception, use `UnsavedChangesProvider` +
 * `AdminBreadcrumb` which checks dirty state via context.
 */
export function useUnsavedChanges(isDirty: boolean) {
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);
}
