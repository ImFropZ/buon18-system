"use client";

import type { PropsWithChildren } from "react";
import { Menu } from "./Menu";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@components/ui/resizable";
import React from "react";
import Image from "next/image";
import { addMonths, format } from "date-fns";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Profile } from "./Profile";

interface LayoutProps extends PropsWithChildren {
  defaultCollapsed: boolean;
  defaultLayout?: number[];
  moduleKey?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  defaultCollapsed,
  defaultLayout = [8, 90],
  moduleKey,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const router = useRouter();

  return (
    <div className="fixed inset-0 grid grid-rows-[auto,1fr]">
      <div className="flex items-center justify-between border-b-4 px-8 py-4">
        <div className="h-10">
          <Link href={"/"}>
            <Image
              src="/assets/buon18/logo.png"
              alt="418 logo"
              width={140}
              height={64}
              className="h-full w-full"
            />
          </Link>
        </div>
        <Profile />
      </div>
      <div className="relative h-full">
        <ResizablePanelGroup
          direction="horizontal"
          className="absolute inset-0 rounded-lg"
          onLayout={(sizes: number[]) => {
            const futureDate = addMonths(new Date(), 1);
            document.cookie = `nav:layout=${JSON.stringify(sizes)}; expires=${format(futureDate, "EEE, dd MMM yyyy HH:mm:ss 'GMT'")}; SameSite=None; Secure; Path=/`;
            router.refresh();
          }}
        >
          <ResizablePanel
            defaultSize={defaultLayout[0] || 8}
            minSize={10}
            maxSize={12}
            className="min-w-12"
            collapsible
            collapsedSize={2}
            onCollapse={() => {
              const futureDate = addMonths(new Date(), 1);
              Cookies.set("nav:collapse", "true", {
                expires: futureDate,
                sameSite: "None",
                secure: true,
                path: "/",
              });
              setIsCollapsed(true);
              router.refresh();
            }}
            onExpand={() => {
              const futureDate = addMonths(new Date(), 1);
              Cookies.set("nav:collapse", "false", {
                expires: futureDate,
                sameSite: "None",
                secure: true,
                path: "/",
              });
              setIsCollapsed(false);
              router.refresh();
            }}
          >
            <Menu isCollapsed={isCollapsed} moduleKey={moduleKey} />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={defaultLayout[1] || 92}>
            <div className="flex h-full flex-col">
              <div className="flex-1 px-2">{children}</div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};
