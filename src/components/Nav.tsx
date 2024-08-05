"use client";

import Link from "next/link";
import { LogOut, LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { useLogout } from "@refinedev/core";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    variant: "default" | "ghost";
    href: string;
  }[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  const { mutate: logout } = useLogout();

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex h-full flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="flex h-full flex-col gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <Link
              key={index}
              href={link.href}
              className={cn(
                buttonVariants({ variant: link.variant, size: "icon" }),
                "h-9 w-9",
                link.variant === "default" &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
              )}
            >
              <link.icon className="h-4 w-4" />
              <span className="sr-only">{link.title}</span>
            </Link>
          ) : (
            <Link
              key={index}
              href={link.href}
              className={cn(
                buttonVariants({ variant: link.variant, size: "sm" }),
                link.variant === "default" &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start",
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    "ml-auto",
                    link.variant === "default" &&
                      "text-background dark:text-white",
                  )}
                >
                  {link.label}
                </span>
              )}
            </Link>
          ),
        )}
        {isCollapsed ? (
          <Button
            onClick={() => logout()}
            className="mt-auto h-9 w-9"
            size="icon"
            variant="destructive"
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Logout</span>
          </Button>
        ) : (
          <Button
            onClick={() => logout()}
            variant="destructive"
            size="sm"
            className="mt-auto justify-start"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        )}
      </nav>
    </div>
  );
}
