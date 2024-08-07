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
import { useDebounce, usePagination } from "@hooks";
import CustomPagination from "@components/CustomPagination";
import { utils } from "@lib/utils";

export default function AccountList() {
  const searchParams = useSearchParams();

  const [searchName, setSearchName] = React.useState("");
  const debouncedSearchName = useDebounce<string>({
    value: searchName,
    delay: utils.SEARCH_DEBOUNCE_DELAY,
  });

  const [limit, setLimit] = React.useState(
    Number(searchParams.get("limit")) || 10,
  );
  const [offset, setOffset] = React.useState(
    Number(searchParams.get("offset")) || 0,
  );

  const { show, edit, create, list } = useNavigation();
  const { data, isLoading } = useList<Account>({
    resource: "accounts",
    filters: [
      {
        field: "name",
        operator: "contains",
        value: debouncedSearchName || null,
      },
    ],
    pagination: {
      pageSize: limit,
      current: offset / limit + 1,
    },
  });
  const { mutate } = useDelete();
  const router = useRouter();

  const { currentPage, back, next, go, hasPreviousPage, hasNextPage } =
    usePagination({
      page: offset / limit + 1,
      pageSize: limit,
      totalItems: data?.total ?? Number.MAX_SAFE_INTEGER,
      onChange: (pageNumber, { pageSize }) => {
        const url = new URL(window.location.href);
        url.searchParams.set("limit", pageSize.toString());
        url.searchParams.set(
          "offset",
          (pageSize * (pageNumber - 1)).toString(),
        );
        router.push(url.toString());

        setLimit(() => pageSize);
        setOffset(() => pageSize * (pageNumber - 1));
      },
    });

  return (
    <div className="mx-auto h-full">
      {isLoading ? (
        <div className="grid place-content-center pt-10">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="grid h-full grid-rows-[auto,1fr,auto]">
          <div className="mb-5 flex gap-3">
            <Input
              onChange={(e) => {
                go(1);
                setSearchName(e.target.value);
              }}
              className="max-w-96"
              value={searchName}
              placeholder="Search Name ..."
            />
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
          <CustomPagination
            back={back}
            next={next}
            currentPage={currentPage}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            className="relative bottom-0 mb-3 flex justify-end"
          />
        </div>
      )}
    </div>
  );
}
