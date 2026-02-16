"use client";

import { useUnsavedChangesContext } from "./unsaved-changes-provider";

interface AdminPageTitleProps {
  title: string;
  description?: string;
}

export function AdminPageTitle({ title, description }: AdminPageTitleProps) {
  const { isDirty } = useUnsavedChangesContext();

  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {isDirty && (
          <span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-900">
            Unsaved changes
          </span>
        )}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
