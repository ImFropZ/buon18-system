"use client";

import { Nav } from "@/components/Nav";
import { NAVIGATIONS_ICON } from "@/data/navigation";
import { useMenu } from "@refinedev/core";
import { Home } from "lucide-react";

interface MenuProps {
  isCollapsed: boolean;
}

export const Menu = ({ isCollapsed }: MenuProps) => {
  const { menuItems, selectedKey } = useMenu();

  return (
    <Nav
      isCollapsed={isCollapsed}
      links={menuItems.map((item) => ({
        icon: NAVIGATIONS_ICON[item.name] || Home,
        title: item.label || "",
        variant: selectedKey === item.key ? "default" : "ghost",
        href: item.route || "/",
      }))}
    />
  );
};
