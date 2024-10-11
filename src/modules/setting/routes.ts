import { ResourceProps } from "@refinedev/core";

export const routes: ResourceProps[] = [
  {
    name: "setting",
    list: "/setting",
    meta: {
      displayName: "Setting",
    },
  },
  {
    name: "setting/users",
    list: "/setting/users",
    meta: {
      displayName: "Users",
    },
  },
];
