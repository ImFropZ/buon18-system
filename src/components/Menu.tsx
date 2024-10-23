"use client";

import { Nav } from "@/components/Nav";
import { useMenu } from "@refinedev/core";
import { Home } from "lucide-react";

interface MenuProps {
  isCollapsed: boolean;
  moduleKey?: string;
}

export const Menu = ({ isCollapsed, moduleKey }: MenuProps) => {
  const { menuItems, selectedKey } = useMenu();

  return (
    <Nav
      isCollapsed={isCollapsed}
      links={menuItems
        .filter((item) => {
          return item.name.startsWith(moduleKey || "");
        })
        .map((item) => ({
          icon: item.meta?.icon || <Home />,
          title: item.label || "",
          variant: selectedKey === item.key ? "default" : "ghost",
          href: item.route || "/",
          label: item.meta?.displayName,
        }))}
    />
  );
};
