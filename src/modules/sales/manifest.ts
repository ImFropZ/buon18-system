import React from "react";
import { routes } from "./routes";
import { Manifest } from "@modules/inteface";

export const manifest: Manifest = {
  name: "sales",
  displayName: "Sales",
  description: "",
  rootPath: "/sales",
  icon: "/modules/sales.jpg",
  routes: routes,
  dataProvider: null,
  pages: [
    {
      key: "/sales",
      path: React.lazy(() => import("./pages/page")),
    },
    {
      key: "/sales/quotations",
      path: React.lazy(() => import("./pages/quotations/page")),
    },
    {
      key: "/sales/quotations/create",
      path: React.lazy(() => import("./pages/quotations/create/page")),
    },
    {
      key: "/sales/orders",
      path: React.lazy(() => import("./pages/orders/page")),
    },
    {
      key: "/sales/orders/create",
      path: React.lazy(() => import("./pages/orders/create/page")),
    },
  ],
};
