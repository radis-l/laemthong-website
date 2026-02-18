export type Locale = "th" | "en";

export interface LocalizedString {
  th: string;
  en: string;
}

export interface Product {
  slug: string;
  categorySlug: string;
  brandSlug: string;
  name: LocalizedString;
  shortDescription: LocalizedString;
  description: LocalizedString;
  images: string[];
  specifications: { label: LocalizedString; value: LocalizedString }[];
  features: LocalizedString[];
  documents?: { name: string; url: string }[];
  featured: boolean;
  sortOrder: number;
}

export interface Category {
  slug: string;
  name: LocalizedString;
  description: LocalizedString;
  image: string;
  productCount?: number;
  sortOrder: number;
}

export interface Brand {
  slug: string;
  name: string;
  logo: string;
  description: LocalizedString;
  website?: string;
  country: string;
  productCount?: number;
  sortOrder: number;
}

export interface CompanyInfo {
  name: LocalizedString;
  tagline: LocalizedString;
  description: LocalizedString;
  yearEstablished: number;
  address: LocalizedString;
  phone: string;
  email: string;
  lineId?: string;
  mapUrl: string;
  coordinates: { lat: number; lng: number };
}

// ========================================
// Database row types (snake_case, JSONB)
// ========================================

export interface DbCategory {
  slug: string;
  name: LocalizedString;
  description: LocalizedString;
  image: string;
  sort_order: number;
  updated_at: string;
}

export interface DbBrand {
  slug: string;
  name: string;
  logo: string;
  description: LocalizedString;
  website: string | null;
  country: string;
  sort_order: number;
  updated_at: string;
}

export interface DbProduct {
  slug: string;
  category_slug: string;
  brand_slug: string;
  name: LocalizedString;
  short_description: LocalizedString;
  description: LocalizedString;
  images: string[];
  specifications: { label: LocalizedString; value: LocalizedString }[];
  features: LocalizedString[];
  documents: { name: string; url: string }[];
  featured: boolean;
  sort_order: number;
  updated_at: string;
}

export interface DbCompanyInfo {
  id: number;
  name: LocalizedString;
  tagline: LocalizedString;
  description: LocalizedString;
  year_established: number;
  address: LocalizedString;
  phone: string;
  email: string;
  line_id: string | null;
  map_url: string;
  coordinates: { lat: number; lng: number };
}

export interface DbPageImage {
  key: string;
  image_url: string;
  updated_at: string;
}

export interface PageImage {
  key: string;
  imageUrl: string;
}
