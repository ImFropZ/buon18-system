"use client";

import CustomPagination from "@components/CustomPagination";
import { Button } from "@components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { usePagination } from "@hooks";
import { SearchBar } from "@components";
import { DeleteSelectButton } from "@components";
import { paymentTermColumns } from "./payment-term-columns";
import { systemAxiosInstance } from "@modules/shared";
import Link from "next/link";

function onDeleteSelectedHandler(ids: number[]) {
  const deleteBody = ids.map((id) => ({ id }));
  return systemAxiosInstance.delete(`/admin/majors`, { data: deleteBody });
}

export function PaymentTermDataTable() {
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10),
  );
  const [offset, setOffset] = useQueryState(
    "offset",
    parseAsInteger.withDefault(0),
  );
  const [search, setSearch] = useQueryState(
    "name:ilike",
    parseAsString.withDefault(""),
  );
  const [total, setTotal] = React.useState(0);
  const [rowSelection, setRowSelection] = React.useState({});

  const { data, refetch, isLoading } = useQuery({
    queryKey: [
      "payment-terms",
      {
        limit,
        offset,
        "name:ilike": search,
      },
    ],
    queryFn: async () => {
      const response = await systemAxiosInstance.get(
        `/accounting/payment-terms`,
        {
          params: {
            limit,
            offset,
            "name:ilike": search,
          },
        },
      );
      setTotal(+response.headers["x-total-count"] || 0);
      return response.data;
    },
  });

  const table = useReactTable({
    data: data?.data.payment_terms || [],
    columns: paymentTermColumns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
    meta: {
      refetch: () => refetch(),
    },
  });

  const { go, ...pagination } = usePagination({
    page: Math.ceil(offset / limit + 1),
    pageSize: limit,
    totalItems: total,
    onChange: (pageNumber, { pageSize }) => {
      setLimit(pageSize);
      setOffset((pageNumber - 1) * pageSize);
    },
  });

  return (
    <div className="grid h-full grid-rows-[auto,1fr,auto] gap-2 pb-4">
      <div className="flex justify-end gap-4">
        <div className="mr-auto flex gap-2">
          <SearchBar
            onSearch={(searchPharse) => {
              setSearch(searchPharse);
              go(1);
            }}
            placeholder="Search name ..."
            defaultValue={search}
          />
        </div>
        <DeleteSelectButton
          isHidden={
            !(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected())
          }
          onDeleteSelectedHandler={onDeleteSelectedHandler}
          refetch={refetch}
          table={table}
        />
        <Link href="/accounting/payment-terms/create">
          <Button>Create</Button>
        </Link>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={paymentTermColumns.length}
                  className="h-24 text-center"
                >
                  {isLoading ? (
                    <div className="loader mx-auto"></div>
                  ) : (
                    "No results."
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <CustomPagination
        currentPage={pagination.currentPage}
        hasNextPage={pagination.hasNextPage}
        hasPreviousPage={pagination.hasPreviousPage}
        back={pagination.back}
        next={pagination.next}
        className="justify-end"
      />
    </div>
  );
}
