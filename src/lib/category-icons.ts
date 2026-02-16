import {
  Zap, Scissors, Cable, Gauge, HardHat, Wrench, Shield, Flame,
  Cog, Factory, Hammer, Ruler, Pipette, Fan, Plug, CircuitBoard,
  Truck, Package, Eye, Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Zap, Scissors, Cable, Gauge, HardHat, Wrench, Shield, Flame,
  Cog, Factory, Hammer, Ruler, Pipette, Fan, Plug, CircuitBoard,
  Truck, Package, Eye, Sparkles,
};

const FALLBACK: LucideIcon = Wrench;

/** Resolve a Lucide icon name (from DB) to its component. Falls back to Wrench. */
export function getCategoryIcon(iconName?: string): LucideIcon {
  if (iconName && iconName in ICON_MAP) {
    return ICON_MAP[iconName];
  }
  return FALLBACK;
}

/** Available icon names for the admin picker. */
export const AVAILABLE_ICONS = Object.keys(ICON_MAP);

/** Get the icon component map (for rendering previews in admin). */
export { ICON_MAP };
