import type { Metadata } from "next";
import { adminGetContactInquiries } from "@/lib/db/admin";
import { InquiriesTable } from "@/components/admin/inquiries-table";

export const metadata: Metadata = {
  title: "Inquiries",
};

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function InquiriesPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const result = await adminGetContactInquiries(page, 20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Inquiries</h1>
        <p className="text-sm text-muted-foreground">
          Contact form submissions ({result.total})
        </p>
      </div>

      <InquiriesTable
        inquiries={result.inquiries}
        currentPage={result.page}
        totalPages={result.totalPages}
      />
    </div>
  );
}
