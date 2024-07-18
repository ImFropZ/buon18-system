"use client";

import { SalesOrderSchema } from "@models/sales-order";
import { columns } from "@components/table/sales-orders/columns";
import { useList, useNavigation } from "@refinedev/core";
import { DataTable } from "@components/ui/data-table";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { CustomTooltip } from "@components";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePagination, useDebounce } from "@hooks";
import { utils } from "@lib/utils";
import React from "react";
import CustomPagination from "@components/CustomPagination";
import * as z from "zod";

export default function SalesOrderList() {
  const searchParams = useSearchParams();

  const [searchCode, setSearchCode] = React.useState("");
  const debouncedSearchCode = useDebounce<string>({
    value: searchCode,
    delay: utils.SEARCH_DEBOUNCE_DELAY,
  });

  const [limit, setLimit] = React.useState(
    Number(searchParams.get("limit")) || 10,
  );
  const [offset, setOffset] = React.useState(
    Number(searchParams.get("offset")) || 0,
  );

  const { show, edit, create } = useNavigation();
  const { data, isLoading } = useList<z.infer<typeof SalesOrderSchema>>({
    resource: "sales-orders",
    filters: [
      {
        field: "code",
        operator: "contains",
        value: debouncedSearchCode,
      },
    ],
    pagination: {
      pageSize: limit,
      current: offset / limit + 1,
    },
  });
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
                setSearchCode(e.target.value);
              }}
              className="max-w-96"
              value={searchCode}
              placeholder="Search Code ..."
            />
            <CustomTooltip content="Create">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  create("sales-orders");
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
                show("sales-orders", id);
              },
              edit: (id) => {
                edit("sales-orders", id);
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
