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
];
