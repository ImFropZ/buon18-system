import { ResourceProps } from "@refinedev/core";
import { LayoutDashboard, Quote } from "lucide-react";

export const routes: ResourceProps[] = [
  {
    name: "sales",
    list: "/sales",
    meta: {
      displayName: "Sales",
      icon: <LayoutDashboard />,
    },
  },
  {
    name: "sales/quotations",
    list: "/sales/quotations",
    create: "/sales/quotations/create",
    edit: "/sales/quotations/edit/:id",
    meta: {
      displayName: "Quotations",
      icon: <Quote />,
    },
  },
];
