"use client";

import { Client } from "@models/client";
import { columns } from "@components/table/clients/columns";
import { useDelete, useList, useNavigation } from "@refinedev/core";
import React from "react";
import { DataTable } from "@components/ui/data-table";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { CustomTooltip } from "@components";
import { Plus, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePagination } from "@hooks/usePagination";
import CustomPagination from "@components/CustomPagination";

export default function ClientList() {
  const searchParams = useSearchParams();

  const [query, setQuery] = React.useState(searchParams.get("q") || "");
  const [limit, setLimit] = React.useState(
    Number(searchParams.get("limit")) || 10,
  );
  const [offset, setOffset] = React.useState(
    Number(searchParams.get("offset")) || 0,
  );

  const { show, edit, create, list } = useNavigation();
  const { data, isLoading, refetch } = useList<Client>({
    resource: "clients",
    pagination: {
      pageSize: limit,
      current: offset / limit + 1,
    },
    meta: {
      filters: {
        q: query,
      },
    },
  });
  const { mutate } = useDelete();
  const router = useRouter();

  const { currentPage, back, next, go, hasPreviousPage, hasNextPage } =
    usePagination({
      page: offset / limit + 1,
      pageSize: limit,
      totalItems: data?.total || 100,
      onChange: (pageNumber, { pageSize }) => {
        const url = new URL(window.location.href);
        url.searchParams.set("limit", pageSize.toString());
        url.searchParams.set(
          "offset",
          (pageSize * (pageNumber - 1)).toString(),
        );
        if (query) {
          url.searchParams.set("q", query);
        } else {
          url.searchParams.delete("q");
        }
        router.push(url.toString());

        setLimit(() => pageSize);
        setOffset(() => pageSize * (pageNumber - 1));

        refetch();
      },
    });

  function handleSearch() {
    go(1);
    refetch();
  }

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
                setQuery(e.target.value);
              }}
              className="max-w-96"
              value={query}
              placeholder="Search..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <Button
              className="p-2"
              variant="outline"
              size="icon"
              onClick={handleSearch}
            >
              <Search />
            </Button>
            <CustomTooltip content="Create">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  create("clients");
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
                show("clients", id);
              },
              edit: (id) => {
                edit("clients", id);
              },
              _delete: (id) => {
                mutate(
                  {
                    resource: "clients",
                    id: id,
                  },
                  {
                    onSuccess: () => {
                      list("clients");
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
