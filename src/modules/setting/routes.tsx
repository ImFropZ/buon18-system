import { ResourceProps } from "@refinedev/core";
import { LayoutDashboard, Users } from "lucide-react";

export const routes: ResourceProps[] = [
  {
    name: "setting",
    list: "/setting",
    meta: {
      displayName: "Setting",
      icon: <LayoutDashboard />,
    },
  },
  {
    name: "setting/users",
    list: "/setting/users",
    meta: {
      displayName: "Users",
      icon: <Users />,
    },
  },
];
