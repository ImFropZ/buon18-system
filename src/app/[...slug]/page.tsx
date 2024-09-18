"use client";
import { installedModules } from "@modules";
import { useMenu } from "@refinedev/core";
import { notFound } from "next/navigation";
import React from "react";

function page() {
  const { selectedKey } = useMenu();

  const activeModule = installedModules.find((m) =>
    m.module.manifest.name.startsWith(selectedKey.split("/")[1]),
  );

  if (!activeModule) {
    console.log("Unable to find module", selectedKey);
    return notFound();
  }

  const Page = activeModule.module.manifest.pages.find(
    (page) => page.key === selectedKey,
  )?.path;

  if (!Page) {
    console.log("Unable to find page", selectedKey);
    return notFound();
  }

  return <Page />;
}

export default page;
