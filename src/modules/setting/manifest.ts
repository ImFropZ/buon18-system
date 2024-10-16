import React from "react";
import { routes } from "./routes";
import { Manifest } from "@modules/inteface";

export const manifest: Manifest = {
  name: "setting",
  displayName: "Setting",
  description: "",
  rootPath: "/setting",
  icon: "/modules/setting.jpg",
  routes: routes,
  dataProvider: null,
  pages: [
    {
      key: "/setting",
      path: React.lazy(() => import("./pages/page")),
    },
    {
      key: "/setting/roles",
      path: React.lazy(() => import("./pages/roles/page")),
    },
    {
      key: "/setting/roles/create",
      path: React.lazy(() => import("./pages/roles/create/page")),
    },
    {
      key: "/setting/customers",
      path: React.lazy(() => import("./pages/customers/page")),
    },
    {
      key: "/setting/customers/create",
      path: React.lazy(() => import("./pages/customers/create/page")),
    },
    {
      key: "/setting/customers/edit/:id",
      path: React.lazy(() => import("./pages/customers/edit/[id]/page")),
    },
    {
      key: "/setting/users",
      path: React.lazy(() => import("./pages/users/page")),
    },
    {
      key: "/setting/users/create",
      path: React.lazy(() => import("./pages/users/create/page")),
    },
    {
      key: "/setting/users/edit/:id",
      path: React.lazy(() => import("./pages/users/edit/[id]/page")),
    },
  ],
};
