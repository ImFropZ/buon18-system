import { Layout as BaseLayout } from "@components/layout";
import { authProviderServer } from "@providers/auth-provider";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({ children }: React.PropsWithChildren) {
  const data = await getData();

  if (!data.authenticated) {
    redirect(data?.redirectTo || "/login");
  }

  const layout = cookies().get("nav:layout");
  const collapse = cookies().get("nav:collapse");

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapse ? JSON.parse(collapse.value) : undefined;

  return (
    <BaseLayout
      defaultCollapse={defaultCollapsed}
      defaultLayout={defaultLayout}
    >
      {children}
    </BaseLayout>
  );
}

async function getData() {
  const { authenticated, redirectTo, error } = await authProviderServer.check();

  return {
    authenticated,
    redirectTo,
    error,
  };
}