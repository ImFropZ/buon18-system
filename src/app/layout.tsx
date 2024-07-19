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
import localFont from "next/font/local";
import { cn } from "@lib/utils";
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
                  {
                    name: "sales-orders",
                    list: "/sales-orders",
                    show: "/sales-orders/show/:id",
                    edit: "/sales-orders/edit/:id",
                    create: "/sales-orders/create",
                    meta: {
                      label: "Sales Orders",
                    },
                  },
                  {
                    name: "users",
                    list: "/users",
                    meta: {
                      label: "Users",
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
        <Toaster />
      </body>
    </html>
  );
}
