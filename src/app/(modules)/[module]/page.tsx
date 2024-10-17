import { installedModules } from "@modules";
import { notFound } from "next/navigation";
import React from "react";

export default function ModuleGatewayPage({
  params,
}: {
  params: { module: string };
}) {
  const selectedKey = "/" + params.module;

  const activeModule = installedModules.find((m) =>
    m.module.manifest.name.startsWith(selectedKey.split("/")[1]),
  );

  if (!activeModule) {
    return notFound();
  }

  let PageComponent: any;
  for (const page of activeModule.module.manifest.pages) {
    if (page.key === selectedKey) {
      PageComponent = page.path;
    }
  }

  if (!PageComponent) {
    return notFound();
  }

  return <PageComponent />;
}
