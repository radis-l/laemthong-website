"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface UnsavedChangesContextValue {
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;
}

const UnsavedChangesContext = createContext<UnsavedChangesContextValue>({
  isDirty: false,
  setIsDirty: () => {},
});

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const [isDirty, setIsDirty] = useState(false);

  return (
    <UnsavedChangesContext.Provider value={{ isDirty, setIsDirty }}>
      {children}
    </UnsavedChangesContext.Provider>
  );
}

export function useUnsavedChangesContext() {
  return useContext(UnsavedChangesContext);
}
