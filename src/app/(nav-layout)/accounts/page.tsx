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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@components/ui/pagination";
import { usePagination } from "@hooks/usePagination";

export default function AccountList() {
  const searchParams = useSearchParams();

  const [query, setQuery] = React.useState(searchParams.get("q") || "");
  const [limit, setLimit] = React.useState(
    Number(searchParams.get("limit")) || 10,
  );
  const [offset, setOffset] = React.useState(
    Number(searchParams.get("offset")) || 0,
  );

  const { show, edit, create, list } = useNavigation();
  const { data, isLoading, refetch } = useList<Account>({
    resource: "accounts",
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
  const { currentPage, back, next, go } = usePagination({
    page: offset / limit + 1,
    pageSize: limit,
    totalItems: data?.total || 100,
    onChange: (pageNumber, { pageSize }) => {
      const url = new URL(window.location.href);
      url.searchParams.set("limit", pageSize.toString());
      url.searchParams.set("offset", (pageSize * (pageNumber - 1)).toString());
      router.push(url.toString());

      setLimit(() => pageSize);
      setOffset(() => pageSize * (pageNumber - 1));

      refetch();
    },
  });

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
                url.searchParams.set("offset", "0");
                url.searchParams.set("q", query);
                router.push(url.toString());
                go(1);

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
          <Pagination className="mt-3 flex justify-end">
            <PaginationContent>
              <PaginationItem
                onClick={() => {
                  back();
                }}
              >
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  {currentPage}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem
                onClick={() => {
                  next();
                }}
              >
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
}
