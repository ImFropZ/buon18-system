import { RoleDataTable } from "@modules/setting/components";
import React from "react";

export default function Page() {
  return (
    <main className="relative grid h-full grid-rows-[auto,1fr] gap-2 p-4">
      <h1 className="text-2xl font-bold">Roles</h1>
      <RoleDataTable />
    </main>
  );
}
