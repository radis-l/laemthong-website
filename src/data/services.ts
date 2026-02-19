export interface ServiceConfig {
  slug: string;
  primary: boolean;
  sortOrder: number;
}

export const SERVICES: ServiceConfig[] = [
  { slug: "consulting", primary: true, sortOrder: 1 },
  { slug: "calibration", primary: true, sortOrder: 2 },
  { slug: "repair", primary: false, sortOrder: 3 },
  { slug: "training", primary: false, sortOrder: 4 },
];

export const SERVICE_SLUGS = SERVICES.map((s) => s.slug);

export function getServiceBySlug(slug: string): ServiceConfig | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function getPrimaryServices(): ServiceConfig[] {
  return SERVICES.filter((s) => s.primary);
}

export function getSecondaryServices(): ServiceConfig[] {
  return SERVICES.filter((s) => !s.primary);
}
