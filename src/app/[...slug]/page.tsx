import { installedModules } from "@modules";
import { notFound } from "next/navigation";
import React from "react";

export default function ModuleGatewayPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const selectedKey = "/" + params.slug.join("/");

  const activeModule = installedModules.find((m) =>
    m.module.manifest.name.startsWith(selectedKey.split("/")[1]),
  );

  if (!activeModule) {
    return notFound();
  }

  let passParams: { [key in string]: string } = {};
  let PageComponent: any;
  for (const page of activeModule.module.manifest.pages) {
    if (page.key.includes(":")) {
      const tmpPassParams: { [key in string]: string } = {};
      const sections = page.key.slice(1).split("/");
      if (sections.length !== params.slug.length) {
        continue;
      }

      let isValid = true;
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].startsWith(":")) {
          tmpPassParams[sections[i].slice(1)] = params.slug[i];
        } else if (sections[i] !== params.slug[i]) {
          isValid = false;
          break;
        }
      }

      if (isValid) {
        passParams = tmpPassParams;
        PageComponent = page.path;
      }
    }

    if (page.key === selectedKey) {
      PageComponent = page.path;
    }
  }

  if (!PageComponent) {
    return notFound();
  }

  return <PageComponent params={passParams} />;
}
