import React from "react";
import { routes } from "./routes";
import { Manifest } from "@modules/inteface";

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
      key: "/lobby-serksa/majors",
      path: React.lazy(() => import("./pages/majors/page")),
    },
    {
      key: "/lobby-serksa/subjects",
      path: React.lazy(() => import("./pages/subjects/page")),
    },
    {
      key: "/lobby-serksa/professors",
      path: React.lazy(() => import("./pages/professors/page")),
    },
    {
      key: "/lobby-serksa/quizzes",
      path: React.lazy(() => import("./pages/quizzes/page")),
    },
    {
      key: "/lobby-serksa/quizzes/create",
      path: React.lazy(() => import("./pages/quizzes/create/page")),
    },
  ],
};
