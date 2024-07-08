"use client";

import { Account } from "@models/account";
import { columns } from "@components/table/accounts/columns";
import { useList, useNavigation } from "@refinedev/core";
import React from "react";
import { DataTable } from "@components/ui/data-table";

export default function AccountList() {
  const { show, edit, create } = useNavigation();
  const { data, isLoading } = useList<Account>({
    resource: "accounts",
  });

  return (
    <div className="mx-auto">
      {isLoading ? (
        <div className="grid place-content-center pt-10">
          <div className="loader"></div>
        </div>
      ) : (
        <DataTable
          create={() => {
            create("accounts");
          }}
          columns={columns({
            show: (id) => {
              show("accounts", id);
            },
            edit: (id) => {
              edit("accounts", id);
            },
          })}
          data={data?.data || []}
        />
      )}
    </div>
  );
}
