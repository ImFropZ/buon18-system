import { ResourceProps } from "@refinedev/core";

export const routes: ResourceProps[] = [
  {
    name: "lobby-serksa",
    list: "/",
  },
  {
    name: "lobby-serksa/schools",
    list: "/schools",
    show: "/schools/:id",
  },
];
