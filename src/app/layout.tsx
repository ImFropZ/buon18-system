import { DevtoolsProvider } from "@providers/devtools";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import { Metadata } from "next";
import React, { Suspense } from "react";

import { authProvider } from "@providers/auth-provider";
import { dataProvider } from "@providers/data-provider";
import "@styles/global.css";
import { TooltipProvider } from "@components/ui/tooltip";

export const metadata: Metadata = {
  title: "B18 System",
  description: "Management system for Buon18",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <Suspense>
          <RefineKbarProvider>
            <DevtoolsProvider>
              <Refine
                routerProvider={routerProvider}
                dataProvider={dataProvider}
                authProvider={authProvider}
                resources={[
                  {
                    name: "accounts",
                    list: "/accounts",
                    show: "/accounts/show/:id",
                    edit: "/accounts/edit/:id",
                    create: "/accounts/create",
                    meta: {
                      label: "Accounts",
                    },
                  },
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
      </body>
    </html>
  );
}
