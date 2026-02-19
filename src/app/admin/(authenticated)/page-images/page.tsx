import type { Metadata } from "next";
import { adminGetAllPageImages } from "@/lib/db/admin";
import { PageImagesForm } from "@/components/admin/page-images-form";
import { TABS } from "@/data/page-image-slots";

export const metadata: Metadata = {
  title: "Page Images",
};

type Props = {
  searchParams: Promise<{ section?: string }>;
};

export default async function AdminPageImagesPage({ searchParams }: Props) {
  const { section } = await searchParams;
  const activeSection = TABS.some((t) => t.value === section) ? section! : TABS[0].value;

  const rows = await adminGetAllPageImages();

  const images = new Map<string, string>();
  for (const row of rows) {
    images.set(row.key, row.image_url);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Page Images</h1>
        <p className="text-sm text-muted-foreground">
          Upload and manage images displayed on public pages. Changes are saved
          automatically.
        </p>
      </div>

      <PageImagesForm images={images} activeSection={activeSection} />
    </div>
  );
}
