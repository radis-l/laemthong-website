export type ParsedProductRow = {
  index: number; // Row number in CSV (1-based)
  data: {
    slug: string;
    nameTh: string;
    nameEn: string;
    shortDescriptionTh: string;
    shortDescriptionEn: string;
    descriptionTh: string;
    descriptionEn: string;
    categorySlug: string;
    brandSlug: string;
    featured?: string;
    sortOrder: number;
    // Complex fields omitted for CSV format
    gallery?: string;
    specifications?: string;
    features?: string;
    documents?: string;
    image?: string;
  };
};

export type ValidationStatus = "valid" | "warning" | "error";

export type ValidationResult = {
  row: ParsedProductRow;
  status: ValidationStatus;
  errors: string[];
  warnings: string[];
  images?: {
    main?: File;
    gallery: File[];
  };
};

export type ImageMap = Record<
  string,
  {
    main?: File;
    gallery: File[];
  }
>;

export type ValidationStats = {
  total: number;
  valid: number;
  warnings: number;
  errors: number;
};

export type ImportOptions = {
  overwriteExisting: boolean;
  skipErrors: boolean;
};

export type ImportEvent =
  | { type: "progress"; current: number; total: number; slug: string }
  | { type: "success"; slug: string; action: "created" | "updated" }
  | { type: "skipped"; slug: string; reason: string }
  | { type: "error"; slug: string; error: string }
  | { type: "complete"; stats: ImportStats };

export type ImportStats = {
  total: number;
  created: number;
  updated: number;
  skipped: number;
  failed: number;
  failures: { slug: string; error: string }[];
};
