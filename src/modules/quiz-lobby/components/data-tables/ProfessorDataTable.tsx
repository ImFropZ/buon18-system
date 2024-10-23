"use client";

import CustomPagination from "@components/CustomPagination";
import { professorColumns } from "@modules/quiz-lobby/components/data-tables";
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
import { axiosInstance } from "@modules/quiz-lobby/fetch";
import { usePagination } from "@hooks";
import { DeleteSelectButton } from "@components";
import { ProfessorCreateSheet } from "../create-sheets";
import { ProfessorAdvanceSearch } from "../advance-searchs";
import { SearchBar } from "@components";

function onDeleteSelectedHandler(ids: number[]) {
  const deleteBody = ids.map((id) => ({ id }));
  return axiosInstance.delete(`/admin/professors`, { data: deleteBody });
}

export function ProfessorDataTable() {
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10),
  );
  const [offset, setOffset] = useQueryState(
    "offset",
    parseAsInteger.withDefault(0),
  );
  const [search, setSearch] = useQueryState(
    "full-name:ilike",
    parseAsString.withDefault(""),
  );
  const [searchId, setSearchId] = useQueryState("id:eq", parseAsInteger);
  const [searchTitle, setSearchTitle] = useQueryState(
    "title:eq",
    parseAsString,
  );
  const [searchSubjectId, setSearchSubjectId] = useQueryState(
    "subject-id:eq",
    parseAsInteger,
  );
  const [searchSemester, setSearchSemester] = useQueryState(
    "semester:eq",
    parseAsInteger,
  );
  const [searchYear, setSearchYear] = useQueryState("year:eq", parseAsInteger);
  const [searchMajorId, setSearchMajorId] = useQueryState(
    "major-id:eq",
    parseAsInteger,
  );
  const [searchSchoolId, setSearchSchoolId] = useQueryState(
    "school-id:eq",
    parseAsInteger,
  );
  const [total, setTotal] = React.useState(0);
  const [rowSelection, setRowSelection] = React.useState({});

  const { data, refetch, isLoading } = useQuery({
    queryKey: [
      "professors",
      {
        limit,
        offset,
        "full-name:ilike": search,
        "id:eq": searchId,
        "title:eq": searchTitle,
        "subject-id:eq": searchSubjectId,
        "semester:eq": searchSemester,
        "year:eq": searchYear,
        "major-id:eq": searchMajorId,
        "school-id:eq": searchSchoolId,
      },
    ],
    queryFn: async () => {
      const response = await axiosInstance.get(`/admin/professors`, {
        params: {
          limit,
          offset,
          "full-name:ilike": search,
          "id:eq": searchId,
          "title:eq": searchTitle,
          "subject-id:eq": searchSubjectId,
          "semester:eq": searchSemester,
          "year:eq": searchYear,
          "major-id:eq": searchMajorId,
          "school-id:eq": searchSchoolId,
        },
      });
      setTotal(+response.headers["x-total-count"] || 0);
      return response.data;
    },
  });

  const table = useReactTable({
    data: data?.data.professors || [],
    columns: professorColumns,
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
            placeholder="Search full name ..."
            defaultValue={search}
          />
          <ProfessorAdvanceSearch
            defaultValues={{
              id: searchId,
              title: searchTitle,
              subjectId: searchSubjectId,
              semester: searchSemester,
              year: searchYear,
              majorId: searchMajorId,
              schoolId: searchSchoolId,
            }}
            onConfirm={({
              id,
              title,
              subjectId,
              semester,
              year,
              majorId,
              schoolId,
            }) => {
              setSearchId(id);
              setSearchTitle(title);
              setSearchSubjectId(subjectId);
              setSearchSemester(semester);
              setSearchYear(year);
              setSearchMajorId(majorId);
              setSearchSchoolId(schoolId);
              go(1);
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
        <ProfessorCreateSheet refetch={refetch}>
          <Button>Create</Button>
        </ProfessorCreateSheet>
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
                  colSpan={professorColumns.length}
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
