"use client";

import { useState, useCallback } from "react";
import { ImageUpload } from "@/components/admin/image-upload";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  upsertPageImageAction,
  deletePageImageAction,
} from "@/app/admin/actions/page-images";
import { toast } from "sonner";
import {
  Home,
  Info,
  Wrench,
  MessageSquare,
  Ruler,
  GraduationCap,
  Package,
  Building2,
  Phone,
  PanelTop,
} from "lucide-react";

interface PageImagesFormProps {
  images: Map<string, string>;
}

interface ImageSlot {
  key: string;
  label: string;
  hint: string;
  aspectRatio: number;
  aspectRatioLabel: string;
  group?: "hero" | "content";
}

// ── Slots grouped by destination page ──────────────────────────────

const HOME_SLOTS: ImageSlot[] = [
  {
    key: "home-hero",
    label: "Hero Background",
    hint: "Displayed behind the main heading on the homepage as a background image.",
    aspectRatio: 16 / 9,
    aspectRatioLabel: "16:9 landscape",
  },
];

const ABOUT_SLOTS: ImageSlot[] = [
  {
    key: "hero-about",
    label: "Hero Background",
    hint: "Background image for the About page hero banner.",
    aspectRatio: 16 / 9,
    aspectRatioLabel: "16:9 landscape",
    group: "hero",
  },
  {
    key: "about-history",
    label: "Company History",
    hint: "Shown alongside the company history text on the About page.",
    aspectRatio: 16 / 9,
    aspectRatioLabel: "16:9 landscape",
    group: "content",
  },
  {
    key: "about-reason1",
    label: "Why Choose Us — Card 1",
    hint: "First card image in the 'Why Choose Us' section.",
    aspectRatio: 4 / 3,
    aspectRatioLabel: "4:3 landscape",
    group: "content",
  },
  {
    key: "about-reason2",
    label: "Why Choose Us — Card 2",
    hint: "Second card image in the 'Why Choose Us' section.",
    aspectRatio: 4 / 3,
    aspectRatioLabel: "4:3 landscape",
    group: "content",
  },
  {
    key: "about-reason3",
    label: "Why Choose Us — Card 3",
    hint: "Third card image in the 'Why Choose Us' section.",
    aspectRatio: 4 / 3,
    aspectRatioLabel: "4:3 landscape",
    group: "content",
  },
  {
    key: "about-reason4",
    label: "Why Choose Us — Card 4",
    hint: "Fourth card image in the 'Why Choose Us' section.",
    aspectRatio: 4 / 3,
    aspectRatioLabel: "4:3 landscape",
    group: "content",
  },
];

const PRODUCTS_SLOTS: ImageSlot[] = [
  {
    key: "hero-products",
    label: "Hero Background",
    hint: "Background image for the Products page hero banner.",
    aspectRatio: 16 / 9,
    aspectRatioLabel: "16:9 landscape",
  },
];

const BRANDS_SLOTS: ImageSlot[] = [
  {
    key: "hero-brands",
    label: "Hero Background",
    hint: "Background image for the Brands page hero banner.",
    aspectRatio: 16 / 9,
    aspectRatioLabel: "16:9 landscape",
  },
];

const SERVICES_SLOTS: ImageSlot[] = [
  {
    key: "hero-services",
    label: "Hero Background",
    hint: "Background image for the Services listing page hero banner.",
    aspectRatio: 16 / 9,
    aspectRatioLabel: "16:9 landscape",
    group: "hero",
  },
  {
    key: "service-consulting",
    label: "Consulting",
    hint: "Hero image on the Consulting service detail page.",
    aspectRatio: 1,
    aspectRatioLabel: "1:1 square",
    group: "content",
  },
  {
    key: "service-calibration",
    label: "Calibration",
    hint: "Hero image on the Calibration service detail page.",
    aspectRatio: 1,
    aspectRatioLabel: "1:1 square",
    group: "content",
  },
  {
    key: "service-repair",
    label: "Repair",
    hint: "Hero image on the Repair service detail page.",
    aspectRatio: 1,
    aspectRatioLabel: "1:1 square",
    group: "content",
  },
  {
    key: "service-training",
    label: "Training",
    hint: "Hero image on the Training service detail page.",
    aspectRatio: 1,
    aspectRatioLabel: "1:1 square",
    group: "content",
  },
];

const CONTACT_SLOTS: ImageSlot[] = [
  {
    key: "hero-contact",
    label: "Hero Background",
    hint: "Background image for the Contact page hero banner.",
    aspectRatio: 16 / 9,
    aspectRatioLabel: "16:9 landscape",
  },
];

// ── Tab configuration ──────────────────────────────────────────────

interface TabSection {
  value: string;
  title: string;
  description: string;
  icon: typeof Home;
  slots: ImageSlot[];
}

const TABS: TabSection[] = [
  {
    value: "home",
    title: "Home",
    description: "Images displayed on the homepage.",
    icon: Home,
    slots: HOME_SLOTS,
  },
  {
    value: "about",
    title: "About",
    description:
      "Hero background and content images for the About page.",
    icon: Info,
    slots: ABOUT_SLOTS,
  },
  {
    value: "products",
    title: "Products",
    description: "Hero background for the Products page.",
    icon: Package,
    slots: PRODUCTS_SLOTS,
  },
  {
    value: "brands",
    title: "Brands",
    description: "Hero background for the Brands page.",
    icon: Building2,
    slots: BRANDS_SLOTS,
  },
  {
    value: "services",
    title: "Services",
    description:
      "Hero background and service detail page images.",
    icon: Wrench,
    slots: SERVICES_SLOTS,
  },
  {
    value: "contact",
    title: "Contact",
    description: "Hero background for the Contact page.",
    icon: Phone,
    slots: CONTACT_SLOTS,
  },
];

const SLOT_ICONS: Record<string, typeof MessageSquare> = {
  "service-consulting": MessageSquare,
  "service-calibration": Ruler,
  "service-repair": Wrench,
  "service-training": GraduationCap,
  "home-hero": PanelTop,
  "hero-about": PanelTop,
  "hero-products": PanelTop,
  "hero-brands": PanelTop,
  "hero-services": PanelTop,
  "hero-contact": PanelTop,
};

// ── Component ──────────────────────────────────────────────────────

export function PageImagesForm({ images }: PageImagesFormProps) {
  const [imageMap, setImageMap] = useState<Map<string, string>>(
    () => new Map(images)
  );

  const handleChange = useCallback(
    async (key: string, url: string | string[]) => {
      const imageUrl = Array.isArray(url) ? url[0] : url;

      if (!imageUrl) {
        setImageMap((prev) => {
          const next = new Map(prev);
          next.delete(key);
          return next;
        });
        const result = await deletePageImageAction(key);
        if (result.success) {
          toast.success("Image removed");
        } else {
          toast.error(result.message ?? "Failed to remove image");
        }
        return;
      }

      setImageMap((prev) => new Map(prev).set(key, imageUrl));
      const result = await upsertPageImageAction(key, imageUrl);
      if (result.success) {
        toast.success("Image saved");
      } else {
        toast.error(result.message ?? "Failed to save image");
      }
    },
    []
  );

  function countUploaded(slots: ImageSlot[]): number {
    return slots.filter((s) => imageMap.has(s.key)).length;
  }

  function renderSlot(slot: ImageSlot) {
    const SlotIcon = SLOT_ICONS[slot.key];
    return (
      <div key={slot.key} className="space-y-2">
        <div className="flex items-center gap-2">
          {SlotIcon && (
            <SlotIcon className="h-3.5 w-3.5 text-muted-foreground" />
          )}
          <span className="text-sm font-medium text-foreground">
            {slot.label}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{slot.hint}</p>
        <ImageUpload
          value={imageMap.get(slot.key) ?? ""}
          onChange={(url) => handleChange(slot.key, url)}
          folder="pages"
          entitySlug={slot.key}
          aspectRatio={slot.aspectRatio}
          aspectRatioLabel={slot.aspectRatioLabel}
        />
      </div>
    );
  }

  function renderSlots(slots: ImageSlot[]) {
    const hasGroups = slots.some((s) => s.group);

    if (!hasGroups) {
      return (
        <div className={slots.length === 1 ? "max-w-xl" : "grid gap-6 sm:grid-cols-2"}>
          {slots.map(renderSlot)}
        </div>
      );
    }

    const heroSlots = slots.filter((s) => s.group === "hero");
    const contentSlots = slots.filter((s) => s.group === "content");

    return (
      <div className="space-y-8">
        {heroSlots.length > 0 && (
          <div>
            <h4 className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Hero Background
            </h4>
            <div className="max-w-xl">{heroSlots.map(renderSlot)}</div>
          </div>
        )}
        {contentSlots.length > 0 && (
          <div className={heroSlots.length > 0 ? "border-t pt-8" : ""}>
            <h4 className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Page Content
            </h4>
            <div className="grid gap-6 sm:grid-cols-2">
              {contentSlots.map(renderSlot)}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Tabs defaultValue="home">
      <TabsList>
        {TABS.map((tab) => {
          const uploaded = countUploaded(tab.slots);
          const total = tab.slots.length;
          const Icon = tab.icon;
          return (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
              <Icon className="h-4 w-4" />
              {tab.title}
              <span className="text-xs text-muted-foreground">
                {uploaded}/{total}
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {TABS.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          forceMount
          className="data-[state=inactive]:hidden pt-4"
        >
          <div className="rounded-lg border bg-card">
            <div className="border-b px-6 py-4">
              <p className="text-sm text-muted-foreground">
                {tab.description}
              </p>
            </div>

            <div className="p-6">{renderSlots(tab.slots)}</div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
