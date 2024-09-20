import { SchoolDataTable } from "@modules/lobby-serksa/components/data-tables";
import React from "react";

export default async function Page() {
  return (
    <main className="h-full p-4">
      <SchoolDataTable />
    </main>
  );
}
