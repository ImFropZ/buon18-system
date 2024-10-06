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
  ],
};
