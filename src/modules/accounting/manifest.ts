import React from "react";
import { routes } from "./routes";
import { Manifest } from "@modules/inteface";

export const manifest: Manifest = {
  name: "accounting",
  displayName: "Accounting",
  description: "",
  rootPath: "/accounting",
  icon: "/modules/accounting.jpg",
  routes: routes,
  dataProvider: null,
  pages: [
    {
      key: "/accounting",
      path: React.lazy(() => import("./pages/page")),
    },
    {
      key: "/accounting/payment-terms",
      path: React.lazy(() => import("./pages/payment-terms/page")),
    },
    {
      key: "/accounting/payment-terms/create",
      path: React.lazy(() => import("./pages/payment-terms/create/page")),
    },
  ],
};
