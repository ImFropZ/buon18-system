import { TransactionDataTable } from "@modules/lobby-serksa/components/data-tables";
import React from "react";

export default function Page() {
  return (
    <main className="relative grid h-full grid-rows-[auto,1fr] gap-2 p-4">
      <h1 className="text-2xl font-bold">Transactions</h1>
      <TransactionDataTable />
    </main>
  );
}
