import { ResourceProps } from "@refinedev/core";
import { LayoutDashboard, NotepadText, Quote } from "lucide-react";

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
  {
    name: "sales/orders",
    list: "/sales/orders",
    meta: {
      displayName: "Orders",
      icon: <NotepadText />,
    },
  },
];
