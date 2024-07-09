"use client";

import { Account } from "@models/account";
import { columns } from "@components/table/accounts/columns";
import { useDelete, useList, useNavigation } from "@refinedev/core";
import React from "react";
import { DataTable } from "@components/ui/data-table";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { CustomTooltip } from "@components";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AccountList() {
  const searchParams = useSearchParams();
  const [query, setQuery] = React.useState(searchParams.get("q") || "");
  const { show, edit, create, list } = useNavigation();
  const { data, isLoading, refetch } = useList<Account>({
    resource: "accounts",
    meta: {
      filters: {
        q: query,
      },
    },
  });
  const { mutate } = useDelete();
  const router = useRouter();

  return (
    <div className="mx-auto">
      {isLoading ? (
        <div className="grid place-content-center pt-10">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          <div className="mb-5 flex gap-5">
            <Input
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              className="w-52"
              value={query}
              placeholder="Search..."
            />
            <Button
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.set("q", query);
                router.push(url.toString());
                refetch();
              }}
            >
              Search
            </Button>
            <CustomTooltip content="Create">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  create("accounts");
                }}
                className="ml-auto"
              >
                <Plus />
              </Button>
            </CustomTooltip>
          </div>
          <DataTable
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
        </>
      )}
    </div>
  );
}
