"use client";

import {
  Breadcrumb as Bc,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { useBreadcrumb } from "@refinedev/core";
import { ChevronRight } from "lucide-react";
import React from "react";

export function Breadcrumb() {
  const { breadcrumbs } = useBreadcrumb();
  const size = breadcrumbs.length;

  return (
    <Bc className="px-4 py-2">
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, i) => {
          return (
            <React.Fragment key={i}>
              <BreadcrumbItem className="text-base">
                <BreadcrumbLink href={breadcrumb.href}>
                  {breadcrumb.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {size - 1 == i ? null : (
                <ChevronRight className="relative translate-y-[2px]" />
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Bc>
  );
}
