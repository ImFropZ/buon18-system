import { ResourceProps } from "@refinedev/core";
import { BadgeCheck, Contact, LayoutDashboard, Users } from "lucide-react";

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
    name: "setting/roles",
    list: "/setting/roles",
    create: "/setting/roles/create",
    meta: {
      displayName: "Roles",
      icon: <BadgeCheck />,
    },
  },
  {
    name: "setting/customers",
    list: "/setting/customers",
    create: "/setting/customers/create",
    edit: "/setting/customers/edit/:id",
    meta: {
      displayName: "Customers",
      icon: <Contact />,
    },
  },
  {
    name: "setting/users",
    list: "/setting/users",
    create: "/setting/users/create",
    edit: "/setting/users/edit/:id",
    meta: {
      displayName: "Users",
      icon: <Users />,
    },
  },
];
