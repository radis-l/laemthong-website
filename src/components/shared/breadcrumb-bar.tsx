import { Link } from "@/i18n/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

type BreadcrumbEntry = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbEntry[];
};

export function BreadcrumbBar({ items }: Props) {
  return (
    <div className="border-b bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-3">
        <Breadcrumb>
          <BreadcrumbList>
            {items.map((item, i) => {
              const isLast = i === items.length - 1;
              return (
                <React.Fragment key={i}>
                  <BreadcrumbItem>
                    {isLast || !item.href ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={item.href}>{item.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
