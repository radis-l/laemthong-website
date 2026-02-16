"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUnsavedChangesContext } from "./unsaved-changes-provider";

interface BreadcrumbItemData {
  label: string;
  href?: string;
}

interface AdminBreadcrumbProps {
  items: BreadcrumbItemData[];
}

export function AdminBreadcrumb({ items }: AdminBreadcrumbProps) {
  const { isDirty } = useUnsavedChangesContext();
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const handleClick = (e: React.MouseEvent, href: string) => {
    if (isDirty) {
      e.preventDefault();
      setPendingHref(href);
    }
  };

  const handleLeave = () => {
    if (pendingHref) {
      router.push(pendingHref);
      setPendingHref(null);
    }
  };

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <BreadcrumbItem key={index}>
                {index > 0 && <BreadcrumbSeparator />}
                {isLast || !item.href ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={item.href}
                      onClick={(e) => handleClick(e, item.href!)}
                    >
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <Dialog
        open={pendingHref !== null}
        onOpenChange={(open) => {
          if (!open) setPendingHref(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes. Are you sure you want to leave this
              page? Your changes will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingHref(null)}>
              Stay
            </Button>
            <Button variant="destructive" onClick={handleLeave}>
              Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
