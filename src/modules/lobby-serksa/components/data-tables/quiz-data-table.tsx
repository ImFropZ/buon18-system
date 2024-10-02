"use client";

import CustomPagination from "@components/CustomPagination";
import { quizColumns } from "@modules/lobby-serksa/components/data-tables";
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
import { axiosInstance } from "@modules/lobby-serksa/fetch";
import { usePagination } from "@hooks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@components/ui/alert-dialog";
import { toast } from "@components/ui/use-toast";
import Link from "next/link";
import { SearchBar } from "@components";

function onDeleteSelectedHandler(ids: number[]) {
  const deleteBody = ids.map((id) => ({ id }));
  return axiosInstance.delete(`/admin/quizzes`, { data: deleteBody });
}

export function QuizDataTable() {
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10),
  );
  const [offset, setOffset] = useQueryState(
    "offset",
    parseAsInteger.withDefault(0),
  );
  const [search, setSearch] = useQueryState(
    "question:ilike",
    parseAsString.withDefault(""),
  );
  const [total, setTotal] = React.useState(0);
  const [rowSelection, setRowSelection] = React.useState({});

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["quizzes", { limit, offset, "question:ilike": search }],
    queryFn: async () => {
      const response = await axiosInstance.get(`/admin/quizzes`, {
        params: { limit, offset, "question:ilike": search },
      });
      setTotal(+response.headers["x-total-count"] || 0);
      return response.data;
    },
  });

  const table = useReactTable({
    data: data?.data.quizzes || [],
    columns: quizColumns,
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
        <div className="mr-auto flex">
          <SearchBar
            onSearch={(searchPharse) => setSearch(searchPharse)}
            placeholder="Search question ..."
            defaultValue={search}
          />
        </div>
        <AlertDialog>
          {table.getIsSomeRowsSelected() || table.getIsAllRowsSelected() ? (
            <>
              <AlertDialogTrigger asChild>
                <Button
                  variant={"outline"}
                  className="text-red-400 hover:text-red-500"
                >
                  Delete Selected
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the quiz records.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      const ids = table
                        .getSelectedRowModel()
                        .rows.flatMap((r) => r.original.id);
                      if (ids.length === 0) return;
                      onDeleteSelectedHandler(ids)
                        .then((res) => {
                          toast({
                            title: "Success",
                            description: res.data.message,
                          });
                          refetch();
                          table.resetRowSelection(false);
                        })
                        .catch((errRes) => {
                          toast({
                            title: "Error",
                            description: errRes.response.data.message,
                            variant: "destructive",
                          });
                        });
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </>
          ) : null}
        </AlertDialog>
        <Link href="/lobby-serksa/quizzes/create">
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
                  colSpan={quizColumns.length}
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
