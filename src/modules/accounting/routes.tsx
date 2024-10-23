import { ResourceProps } from "@refinedev/core";
import { HandCoins, LayoutDashboard } from "lucide-react";

export const routes: ResourceProps[] = [
  {
    name: "accounting",
    list: "/accounting",
    meta: {
      displayName: "Accounting",
      icon: <LayoutDashboard />,
    },
  },
  {
    name: "accounting/payment-terms",
    list: "/accounting/payment-terms",
    create: "/accounting/payment-terms/create",
    edit: "/accounting/payment-terms/edit/:id",
    meta: {
      displayName: "Payment terms",
      icon: <HandCoins />,
    },
  },
];
