import { Zap, Scissors, Cable, Gauge, HardHat, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "welding-machines": Zap,
  "cutting-equipment": Scissors,
  "welding-wire-rods": Cable,
  "gas-regulators": Gauge,
  "safety-equipment": HardHat,
};

export function getCategoryIcon(slug: string): LucideIcon {
  return CATEGORY_ICONS[slug] ?? Wrench;
}
