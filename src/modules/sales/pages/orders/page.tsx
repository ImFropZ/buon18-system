import { OrderDataTable } from "@modules/sales/components";
import React from "react";

export default function Page() {
  return (
    <main className="relative grid h-full grid-rows-[auto,1fr] gap-2 p-4">
      <h1 className="text-2xl font-bold">Orders</h1>
      <OrderDataTable />
    </main>
  );
}
