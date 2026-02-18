import type { Metadata } from "next";
import { adminGetAllPageImages } from "@/lib/db/admin";
import { PageImagesForm } from "@/components/admin/page-images-form";

export const metadata: Metadata = {
  title: "Page Images",
};

export default async function AdminPageImagesPage() {
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

      <PageImagesForm images={images} />
    </div>
  );
}
