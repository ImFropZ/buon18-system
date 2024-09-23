import { ResourceProps } from "@refinedev/core";

export const routes: ResourceProps[] = [
  {
    name: "lobby-serksa",
    list: "/lobby-serksa",
    meta: {
      displayName: "Lobby Serksa",
    },
  },
  {
    name: "lobby-serksa/schools",
    list: "/lobby-serksa/schools",
    meta: {
      displayName: "Schools",
    },
  },
  {
    name: "lobby-serksa/majors",
    list: "/lobby-serksa/majors",
    meta: {
      displayName: "Majors",
    },
  },
  {
    name: "lobby-serksa/subjects",
    list: "/lobby-serksa/subjects",
    meta: {
      displayName: "Subjects",
    },
  },
  {
    name: "lobby-serksa/professors",
    list: "/lobby-serksa/professors",
    meta: {
      displayName: "Professors",
    },
  },
  {
    name: "lobby-serksa/quizzes",
    list: "/lobby-serksa/quizzes",
    meta: {
      displayName: "Quizzes",
    },
  },
];
