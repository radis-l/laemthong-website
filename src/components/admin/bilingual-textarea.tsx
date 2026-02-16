"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface BilingualTextareaProps {
  label: string;
  nameTh: string;
  nameEn: string;
  defaultValueTh?: string;
  defaultValueEn?: string;
  required?: boolean;
  errorTh?: string;
  errorEn?: string;
  rows?: number;
  helperText?: string;
}

export function BilingualTextarea({
  label,
  nameTh,
  nameEn,
  defaultValueTh,
  defaultValueEn,
  required,
  errorTh,
  errorEn,
  rows = 4,
  helperText,
}: BilingualTextareaProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label} {required && "*"}
      </Label>
      {helperText && (
        <p className="text-xs text-muted-foreground -mt-1">{helperText}</p>
      )}
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <div className="mb-0.5 text-xs text-muted-foreground">TH</div>
          <Textarea
            name={nameTh}
            defaultValue={defaultValueTh}
            placeholder={`${label} (Thai)`}
            required={required}
            rows={rows}
          />
          {errorTh && (
            <p className="mt-1 text-xs text-destructive">{errorTh}</p>
          )}
        </div>
        <div>
          <div className="mb-0.5 text-xs text-muted-foreground">EN</div>
          <Textarea
            name={nameEn}
            defaultValue={defaultValueEn}
            placeholder={`${label} (English)`}
            required={required}
            rows={rows}
          />
          {errorEn && (
            <p className="mt-1 text-xs text-destructive">{errorEn}</p>
          )}
        </div>
      </div>
    </div>
  );
}
