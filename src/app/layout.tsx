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
                  {
                    name: "clients",
                    list: "/clients",
                    show: "/clients/show/:id",
                    edit: "/clients/edit/:id",
                    create: "/clients/create",
                    meta: {
                      label: "Clients",
                    },
                  },
                  {
                    name: "quotes",
                    list: "/quotes",
                    show: "/quotes/show/:id",
                    edit: "/quotes/edit/:id",
                    create: "/quotes/create",
                    meta: {
                      label: "Quotes",
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
