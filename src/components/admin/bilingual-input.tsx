"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BilingualInputProps {
  label: string;
  nameTh: string;
  nameEn: string;
  defaultValueTh?: string;
  defaultValueEn?: string;
  required?: boolean;
  errorTh?: string;
  errorEn?: string;
}

export function BilingualInput({
  label,
  nameTh,
  nameEn,
  defaultValueTh,
  defaultValueEn,
  required,
  errorTh,
  errorEn,
}: BilingualInputProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label} {required && "*"}
      </Label>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <div className="mb-1 text-xs text-muted-foreground">TH Thai</div>
          <Input
            name={nameTh}
            defaultValue={defaultValueTh}
            placeholder={`${label} (Thai)`}
            required={required}
          />
          {errorTh && (
            <p className="mt-1 text-xs text-destructive">{errorTh}</p>
          )}
        </div>
        <div>
          <div className="mb-1 text-xs text-muted-foreground">EN English</div>
          <Input
            name={nameEn}
            defaultValue={defaultValueEn}
            placeholder={`${label} (English)`}
            required={required}
          />
          {errorEn && (
            <p className="mt-1 text-xs text-destructive">{errorEn}</p>
          )}
        </div>
      </div>
    </div>
  );
}
