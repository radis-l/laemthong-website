import type { Metadata } from "next";
import Link from "next/link";
import { BrandForm } from "@/components/admin/brand-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "New Brand",
};

export default function NewBrandPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/brands">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Brand</h1>
          <p className="text-sm text-muted-foreground">
            Add a new brand partner.
          </p>
        </div>
      </div>

      <div className="max-w-3xl rounded-xl border bg-card p-6">
        <BrandForm />
      </div>
    </div>
  );
}
