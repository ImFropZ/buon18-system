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
import { QueryClientContextProvider } from "@components";

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
    <html lang="en" className={cn(gothamFont.className)}>
      <body>
        <Suspense>
          <RefineKbarProvider>
            <DevtoolsProvider>
              <QueryClientContextProvider>
                <Refine
                  routerProvider={routerProvider}
                  dataProvider={dataProvider}
                  authProvider={authProvider}
                  resources={[
                    ...installedModules.flatMap(
                      (m) => m.module.manifest.routes,
                    ),
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
              </QueryClientContextProvider>
            </DevtoolsProvider>
          </RefineKbarProvider>
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}
