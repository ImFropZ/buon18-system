"use client";

import { Account } from "@models/account";
import { columns } from "@components/table/accounts/columns";
import { useList } from "@refinedev/core";
import React from "react";
import { DataTable } from "@components/ui/data-table";

export default function AccountList() {
  const { data } = useList<Account>({
    resource: "accounts",
  });

  return (
    <div className="mx-auto px-2">
      <DataTable columns={columns({})} data={data?.data || []} />
    </div>
  );
}
