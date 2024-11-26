import React from "react";
import { routes } from "./routes";
import { Manifest } from "@modules/inteface";

export const manifest: Manifest = {
  name: "quiz-lobby",
  displayName: "Quiz Lobby",
  description: "",
  rootPath: "/quiz-lobby",
  icon: "/modules/quiz-lobby.jpg",
  routes: routes,
  dataProvider: null,
  pages: [
    {
      key: "/quiz-lobby",
      path: React.lazy(() => import("./pages/page")),
    },
    {
      key: "/quiz-lobby/schools",
      path: React.lazy(() => import("./pages/schools/page")),
    },
    {
      key: "/quiz-lobby/majors",
      path: React.lazy(() => import("./pages/majors/page")),
    },
    {
      key: "/quiz-lobby/subjects",
      path: React.lazy(() => import("./pages/subjects/page")),
    },
    {
      key: "/quiz-lobby/professors",
      path: React.lazy(() => import("./pages/professors/page")),
    },
    {
      key: "/quiz-lobby/quizzes",
      path: React.lazy(() => import("./pages/quizzes/page")),
    },
    {
      key: "/quiz-lobby/quizzes/create",
      path: React.lazy(() => import("./pages/quizzes/create/page")),
    },
    {
      key: "/quiz-lobby/transactions",
      path: React.lazy(() => import("./pages/transactions/page")),
    },
    {
      key: "/quiz-lobby/redeem-codes",
      path: React.lazy(() => import("./pages/redeem-codes/page")),
    },
  ],
};
