import { SubjectDataTable } from "@modules/quiz-lobby/components/data-tables";
import React from "react";

export default async function Page() {
  return (
    <main className="relative grid h-full grid-rows-[auto,1fr] gap-2 p-4">
      <h1 className="text-2xl font-bold">Subjects</h1>
      <SubjectDataTable />
    </main>
  );
}
