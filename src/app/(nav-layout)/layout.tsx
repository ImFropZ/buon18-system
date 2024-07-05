import { Layout as BaseLayout } from "@components/layout";
import { cookies } from "next/headers";
import React from "react";

export default async function Layout({ children }: React.PropsWithChildren) {
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
