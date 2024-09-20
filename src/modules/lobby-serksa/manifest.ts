import React from "react";
import { routes } from "./routes";
import { Manifest } from "@modules/inteface";
import dynamic from "next/dynamic";

export const manifest: Manifest = {
  name: "lobby-serksa",
  displayName: "Lobby Serksa",
  description: "",
  rootPath: "/lobby-serksa",
  icon: "/modules/lobby-serksa.jpg",
  routes: routes,
  dataProvider: null,
  pages: [
    {
      key: "/lobby-serksa",
      path: React.lazy(() => import("./pages/page")),
    },
    {
      key: "/lobby-serksa/schools",
      path: React.lazy(() => import("./pages/schools/page")),
    },
    {
      key: "/lobby-serksa/schools/:id",
      path: React.lazy(() => import("./pages/schools/[id]/page")),
    },
  ],
};
