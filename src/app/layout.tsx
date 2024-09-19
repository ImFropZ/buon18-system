import { DevtoolsProvider } from "@providers/devtools";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import { Metadata } from "next";
import React, { Suspense } from "react";
import { authProvider } from "@providers/auth-provider";
import { dataProvider } from "@providers/data-provider/base";
import "@styles/global.css";
import { TooltipProvider } from "@components/ui/tooltip";
import localFont from "next/font/local";
import { cn } from "@lib/utils";
import { installedModules } from "@modules";
import { Toaster } from "@components/ui/toaster";

export const metadata: Metadata = {
  title: "B18 System",
  description: "Management system for Buon18",
  icons: {
    icon: "/favicon.ico",
  },
};

const gothamFont = localFont({
  src: [
    {
      path: "../assets/fonts/Gotham-Book.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/Gotham-BookItalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../assets/fonts/Gotham-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/Gotham-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../assets/fonts/Gotham-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../assets/fonts/Gotham-ThinItalic.otf",
      weight: "100",
      style: "italic",
    },
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", gothamFont.className)}>
      <body>
        <Suspense>
          <RefineKbarProvider>
            <DevtoolsProvider>
              <Refine
                routerProvider={routerProvider}
                dataProvider={dataProvider}
                authProvider={authProvider}
                resources={[
                  ...installedModules.flatMap((m) => {
                    const routes = m.module.manifest.routes;
                    for (const route of routes) {
                      route.show = route.show
                        ? m.module.manifest.rootPath + route.show
                        : undefined;
                      route.list = route.list
                        ? m.module.manifest.rootPath + route.list
                        : undefined;
                      route.create = route.create
                        ? m.module.manifest.rootPath + route.create
                        : undefined;
                      route.edit = route.edit
                        ? m.module.manifest.rootPath + route.edit
                        : undefined;
                    }
                    return routes;
                  }),
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "KHj5hP-vK2ueq-vDwC4U",
                }}
              >
                <TooltipProvider>{children}</TooltipProvider>
                <RefineKbar />
              </Refine>
            </DevtoolsProvider>
          </RefineKbarProvider>
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}
