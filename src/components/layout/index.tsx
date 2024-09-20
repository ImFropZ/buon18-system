"use client";

import type { PropsWithChildren } from "react";
import { Menu } from "../menu";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@components/ui/resizable";
import React from "react";
import Image from "next/image";
import { addMonths, format } from "date-fns";
import Link from "next/link";

interface LayoutProps extends PropsWithChildren {
  defaultCollapse?: boolean;
  defaultLayout?: number[];
  moduleKey?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  defaultCollapse = false,
  defaultLayout = [8, 92],
  moduleKey,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapse);

  return (
    <div className="fixed inset-0 grid grid-rows-[auto,1fr]">
      <div className="flex items-center justify-between p-2 px-5">
        <div className="h-10">
          <Link href={"/"}>
            <Image
              src="/assets/Logo_Icon-01.png"
              alt="418 logo"
              width={64}
              height={64}
              className="h-full w-full"
            />
          </Link>
        </div>
      </div>
      <div className="relative h-full">
        <ResizablePanelGroup
          direction="horizontal"
          className="absolute inset-0 rounded-lg border"
          onLayout={(sizes: number[]) => {
            const futureDate = addMonths(new Date(), 1);
            document.cookie = `nav:layout=${JSON.stringify(sizes)}; expires=${format(futureDate, "EEE, dd MMM yyyy HH:mm:ss 'GMT'")}; SameSite=None; Secure`;
          }}
        >
          <ResizablePanel
            defaultSize={defaultLayout[0] || 8}
            minSize={8}
            maxSize={10}
            className="min-w-12"
            collapsible
            collapsedSize={2}
            onCollapse={() => {
              setIsCollapsed(true);
              const futureDate = addMonths(new Date(), 1);
              document.cookie = `nav:collapse=true; expires=${format(futureDate, "EEE, dd MMM yyyy HH:mm:ss 'GMT'")}; SameSite=None; Secure`;
            }}
            onExpand={() => {
              setIsCollapsed(false);
              const futureDate = addMonths(new Date(), 1);
              document.cookie = `nav:collapse=false; expires=${format(futureDate, "EEE, dd MMM yyyy HH:mm:ss 'GMT'")}; SameSite=None; Secure`;
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
