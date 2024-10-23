import React from "react";
import { PermissionSection } from "../components";

export default function Page() {
  return (
    <main className="relative grid h-full grid-rows-[auto,1fr] gap-2 p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <PermissionSection />
    </main>
  );
}
