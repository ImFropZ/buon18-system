"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CustomPagination from "@components/CustomPagination";
import { usePagination } from "@hooks";
import { Button } from "@components/ui/button";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import { schoolColumns } from "@modules/lobby-serksa/components/data-tables";
import { axiosInstance } from "@modules/lobby-serksa/fetch";
import React from "react";
import { SearchBar } from "@components";
import { SchoolCreateSheet } from "../create-sheets";
import { SchoolAdvanceSearch } from "../advance-searchs";
import { DeleteSelectButton } from "../DeleteSelectButton";

function onDeleteSelectedHandler(ids: number[]) {
  const deleteBody = ids.map((id) => ({ id }));
  return axiosInstance.delete(`/admin/schools`, { data: deleteBody });
}

export function SchoolDataTable() {
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
  const [searchId, setSearchId] = useQueryState("id:eq", parseAsInteger);
  const [total, setTotal] = React.useState(0);
  const [rowSelection, setRowSelection] = React.useState({});

  const { data, refetch, isLoading } = useQuery({
    queryKey: [
      "schools",
      { limit, offset, "name:ilike": search, "id:eq": searchId },
    ],
    queryFn: async () => {
      const response = await axiosInstance.get(`/admin/schools`, {
        params: { limit, offset, "name:ilike": search, "id:eq": searchId },
      });
      setTotal(+response.headers["x-total-count"] || 0);
      return response.data;
    },
  });

  const table = useReactTable({
    data: data?.data.schools || [],
    columns: schoolColumns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
    meta: {
      refetch: () => refetch(),
    },
  });

  const { totalPage, pageSize, go, ...pagination } = usePagination({
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
            onSearch={(searchPharse) => setSearch(searchPharse)}
            placeholder="Search name ..."
            defaultValue={search}
          />
          <SchoolAdvanceSearch
            defaultValues={{ id: searchId }}
            onConfirm={({ id }) => {
              setSearchId(id);
            }}
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
        <SchoolCreateSheet refetch={() => refetch()}>
          <Button>Create</Button>
        </SchoolCreateSheet>
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
                  colSpan={schoolColumns.length}
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
      <CustomPagination {...pagination} className="justify-end" />
    </div>
  );
}
