import type { LucideIcon } from "lucide-react";
import { MessageSquare, Ruler, Wrench, GraduationCap } from "lucide-react";

export interface ServiceConfig {
  slug: string;
  icon: LucideIcon;
  primary: boolean;
  sortOrder: number;
}

export const SERVICES: ServiceConfig[] = [
  { slug: "consulting", icon: MessageSquare, primary: true, sortOrder: 1 },
  { slug: "calibration", icon: Ruler, primary: true, sortOrder: 2 },
  { slug: "repair", icon: Wrench, primary: false, sortOrder: 3 },
  { slug: "training", icon: GraduationCap, primary: false, sortOrder: 4 },
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
