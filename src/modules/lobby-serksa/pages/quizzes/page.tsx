import { QuizDataTable } from "@modules/lobby-serksa/components/data-tables";
import React from "react";

export default async function Page() {
  return (
    <main className="relative grid h-full grid-rows-[auto,1fr] gap-2 p-4">
      <h1 className="text-2xl font-bold">Quizzes</h1>
      <QuizDataTable />
    </main>
  );
}
