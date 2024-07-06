"use client";

import {
  Breadcrumb as Bc,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumb } from "@refinedev/core";
import React from "react";

export function Breadcrumb() {
  const { breadcrumbs } = useBreadcrumb();
  const size = breadcrumbs.length;

  return (
    <Bc className="p-2">
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, i) => {
          return (
            <React.Fragment key={i}>
              <BreadcrumbItem>
                <BreadcrumbLink href={breadcrumb.href}>
                  {breadcrumb.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {size - 1 == i ? null : <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Bc>
  );
}
