"use client";

import { Account } from "@models/account";
import { columns } from "@components/table/accounts/columns";
import { useDelete, useList, useNavigation } from "@refinedev/core";
import React from "react";
import { DataTable } from "@components/ui/data-table";

export default function AccountList() {
  const { show, edit, create, list } = useNavigation();
  const { data, isLoading } = useList<Account>({
    resource: "accounts",
  });
  const { mutate } = useDelete();

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
            _delete: (id) => {
              mutate(
                {
                  resource: "accounts",
                  id: id,
                },
                {
                  onSuccess: () => {
                    list("accounts");
                  },
                },
              );
            },
          })}
          data={data?.data || []}
        />
      )}
    </div>
  );
}
