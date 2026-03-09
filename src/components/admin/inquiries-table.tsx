"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { ChevronLeft, ChevronRight, Mail, Building2, Phone, Package, MessageSquare } from "lucide-react";
import { deleteInquiryAction } from "@/app/admin/actions/inquiries";
import type { ContactInquiryRow } from "@/lib/db/admin";

type Props = {
  inquiries: ContactInquiryRow[];
  currentPage: number;
  totalPages: number;
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function InquiriesTable({ inquiries, currentPage, totalPages }: Props) {
  const [selected, setSelected] = useState<ContactInquiryRow | null>(null);

  if (inquiries.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-lg border py-20 text-center">
        <MessageSquare className="h-10 w-10 text-muted-foreground/40" />
        <p className="mt-4 text-sm font-medium text-muted-foreground">
          No inquiries yet
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          Contact form submissions will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[160px]">Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Company</TableHead>
              <TableHead className="hidden lg:table-cell">Email</TableHead>
              <TableHead className="hidden xl:table-cell">Interest</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.map((inquiry) => (
              <TableRow
                key={inquiry.id}
                className="cursor-pointer"
                onClick={() => setSelected(inquiry)}
              >
                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(inquiry.created_at)}
                </TableCell>
                <TableCell className="font-medium">{inquiry.name}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {inquiry.company}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">
                  {inquiry.email}
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  {inquiry.product_interest && (
                    <Badge variant="secondary" className="text-xs">
                      {inquiry.product_interest}
                    </Badge>
                  )}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DeleteDialog
                    title="Delete Inquiry"
                    description={`Delete the inquiry from ${inquiry.name}? This cannot be undone.`}
                    onDelete={() => deleteInquiryAction(inquiry.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {currentPage > 1 ? (
            <Link href={`/admin/inquiries?page=${currentPage - 1}`}>
              <Button variant="outline" size="sm">
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
          )}
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages ? (
            <Link href={`/admin/inquiries?page=${currentPage + 1}`}>
              <Button variant="outline" size="sm">
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
                <SheetDescription>
                  {formatDate(selected.created_at)}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-2 space-y-4 px-4 pb-4">
                <DetailRow icon={Mail} label="Email">
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-primary hover:underline"
                  >
                    {selected.email}
                  </a>
                </DetailRow>
                <DetailRow icon={Building2} label="Company">
                  {selected.company}
                </DetailRow>
                {selected.phone && (
                  <DetailRow icon={Phone} label="Phone">
                    <a
                      href={`tel:${selected.phone}`}
                      className="text-primary hover:underline"
                    >
                      {selected.phone}
                    </a>
                  </DetailRow>
                )}
                {selected.product_interest && (
                  <DetailRow icon={Package} label="Product Interest">
                    <Badge variant="secondary">{selected.product_interest}</Badge>
                  </DetailRow>
                )}
                <div className="border-t pt-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Message
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {selected.message}
                  </p>
                </div>
                <div className="border-t pt-4">
                  <a
                    href={`mailto:${selected.email}?subject=Re: Your inquiry to Laemthong Syndicate`}
                    className="inline-flex"
                  >
                    <Button size="sm">
                      <Mail className="mr-2 h-4 w-4" />
                      Reply via Email
                    </Button>
                  </a>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}
