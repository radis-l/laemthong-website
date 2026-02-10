import type { Metadata } from "next";
import Link from "next/link";
import { CategoryForm } from "@/components/admin/category-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "New Category",
};

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/categories">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Category</h1>
          <p className="text-sm text-muted-foreground">
            Add a new product category.
          </p>
        </div>
      </div>

      <div className="max-w-3xl rounded-xl border bg-card p-6">
        <CategoryForm />
      </div>
    </div>
  );
}
