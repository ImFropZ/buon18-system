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
import { AdvanceSearch, SearchBar } from "@components";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { SearchPopover } from "../SearchPopover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";

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
  const [searchId, setSearchId] = useQueryState("id:eq", parseAsInteger);
  const [searchArchived, setSearchArchived] = useQueryState(
    "archived:eq",
    parseAsString,
  );
  const [searchProfessorId, setSearchProfessorId] = useQueryState(
    "base-professor-id:eq",
    parseAsInteger,
  );
  const [searchSubjectId, setSearchSubjectId] = useQueryState(
    "base-subject-id:eq",
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

  const idInputRef = React.useRef<HTMLInputElement>(null);
  const semesterInputRef = React.useRef<HTMLInputElement>(null);
  const yearInputRef = React.useRef<HTMLInputElement>(null);
  const [archived, setArchived] = React.useState<"true" | "false" | null>(
    (searchArchived + "") as "true" | "false" | null,
  );
  const [subject, setSubject] = React.useState<{
    id: number;
    name: string;
  } | null>(
    searchSubjectId
      ? {
          id: +searchSubjectId,
          name: "(not loaded)",
        }
      : null,
  );
  const [professor, setProfessor] = React.useState<{
    id: number;
    full_name: string;
  } | null>(
    searchProfessorId
      ? {
          id: +searchProfessorId,
          full_name: "(not loaded)",
        }
      : null,
  );
  const [major, setMajor] = React.useState<{ id: number; name: string } | null>(
    searchMajorId
      ? {
          id: +searchMajorId,
          name: "(not loaded)",
        }
      : null,
  );
  const [school, setSchool] = React.useState<{
    id: number;
    name: string;
  } | null>(
    searchSchoolId
      ? {
          id: +searchSchoolId,
          name: "(not loaded)",
        }
      : null,
  );

  const { data, refetch, isLoading } = useQuery({
    queryKey: [
      "quizzes",
      {
        limit,
        offset,
        "question:ilike": search,
        "id:eq": searchId,
        "archived:eq": searchArchived,
        "base-professor-id:eq": searchProfessorId,
        "base-subject-id:eq": searchSubjectId,
        "semester:eq": searchSemester,
        "year:eq": searchYear,
        "major-id:eq": searchMajorId,
        "school-id:eq": searchSchoolId,
      },
    ],
    queryFn: async () => {
      const response = await axiosInstance.get(`/admin/quizzes`, {
        params: {
          limit,
          offset,
          "question:ilike": search,
          "id:eq": searchId,
          "archived:eq": searchArchived,
          "base-professor-id:eq": searchProfessorId,
          "base-subject-id:eq": searchSubjectId,
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
        <div className="mr-auto flex gap-2">
          <SearchBar
            onSearch={(searchPharse) => setSearch(searchPharse)}
            placeholder="Search question ..."
            defaultValue={search}
          />
          <AdvanceSearch
            title="Advance quiz search"
            description="If you want to do a more specific search, you can use this feature."
            items={[
              <div className="flex flex-col gap-4" key="id-search">
                <Label>
                  ID{" "}
                  <span className="rounded bg-gray-500 px-2 py-1 text-secondary">
                    number only
                  </span>
                </Label>
                <Input
                  ref={idInputRef}
                  placeholder="ID"
                  defaultValue={searchId || undefined}
                />
              </div>,
              <div className="flex flex-col gap-4" key="archived-search">
                <Label>Archived</Label>
                <div className="flex gap-2">
                  <Select
                    onValueChange={(s) => {
                      if (s === "true") setArchived("true");
                      else if (s === "false") setArchived("false");
                      else setArchived(null);
                    }}
                    value={archived || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select archived" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Archived</SelectLabel>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Button
                    disabled={!archived}
                    onClick={() => {
                      setArchived(null);
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </div>,
              <div className="flex flex-col gap-4" key="professor-id-search">
                <Label>Professor</Label>
                <div className="flex gap-2">
                  <SearchPopover
                    id="professor"
                    fetchResource={async (searchPharse) => {
                      const res = await axiosInstance.get(`/admin/professors`, {
                        params: { ["full-name:ilike"]: searchPharse },
                      });
                      return res.data.data.professors;
                    }}
                    onSelected={(d) => {
                      setProfessor({ id: d.id, full_name: d.full_name });
                    }}
                    optionLabel="full_name"
                    optionValue="id"
                    value={professor}
                    placeholder="Select professor"
                  />
                  <Button
                    disabled={!professor}
                    onClick={() => {
                      setProfessor(null);
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </div>,
              <div className="flex flex-col gap-4" key="subject-id-search">
                <Label>Subject</Label>
                <div className="flex gap-2">
                  <SearchPopover
                    id="subject"
                    fetchResource={async (searchPharse) => {
                      const res = await axiosInstance.get(`/admin/subjects`, {
                        params: { ["name:ilike"]: searchPharse },
                      });
                      return res.data.data.subjects;
                    }}
                    onSelected={(d) => {
                      setSubject({ id: d.id, name: d.name });
                    }}
                    optionLabel="name"
                    optionValue="id"
                    value={subject}
                    placeholder="Select subject"
                  />
                  <Button
                    disabled={!subject}
                    onClick={() => {
                      setSubject(null);
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </div>,
              <div className="flex gap-4" key="semester-year-search">
                <div className="flex flex-col gap-4">
                  <Label>
                    Semester{" "}
                    <span className="rounded bg-gray-500 px-2 py-1 text-secondary">
                      number only
                    </span>
                  </Label>
                  <Input
                    ref={semesterInputRef}
                    placeholder="Semester"
                    defaultValue={searchSemester || undefined}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <Label>
                    Year{" "}
                    <span className="rounded bg-gray-500 px-2 py-1 text-secondary">
                      number only
                    </span>
                  </Label>
                  <Input
                    ref={yearInputRef}
                    placeholder="Year"
                    defaultValue={searchYear || undefined}
                  />
                </div>
              </div>,
              <div className="flex flex-col gap-4" key="major-id-search">
                <Label>Major</Label>
                <div className="flex gap-2">
                  <SearchPopover
                    id="major"
                    fetchResource={async (searchPharse) => {
                      const res = await axiosInstance.get(`/admin/majors`, {
                        params: { ["name:ilike"]: searchPharse },
                      });
                      return res.data.data.majors;
                    }}
                    onSelected={(d) => {
                      setMajor({ id: d.id, name: d.name });
                    }}
                    optionLabel="name"
                    optionValue="id"
                    value={major}
                    placeholder="Select major"
                  />
                  <Button
                    disabled={!major}
                    onClick={() => {
                      setMajor(null);
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </div>,
              <div className="flex flex-col gap-4" key="school-id-search">
                <Label>School</Label>
                <div className="flex gap-2">
                  <SearchPopover
                    id="school"
                    fetchResource={async (searchPharse) => {
                      const res = await axiosInstance.get(`/admin/schools`, {
                        params: { ["name:ilike"]: searchPharse },
                      });
                      return res.data.data.schools;
                    }}
                    onSelected={(d) => {
                      setSchool({ id: d.id, name: d.name });
                    }}
                    optionLabel="name"
                    optionValue="id"
                    value={school}
                    placeholder="Select school"
                  />
                  <Button
                    disabled={!school}
                    onClick={() => {
                      setSchool(null);
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </div>,
            ]}
            onConfirm={() => {
              if (idInputRef.current)
                setSearchId(+idInputRef.current.value || null);

              if (semesterInputRef.current)
                setSearchSemester(+semesterInputRef.current.value || null);

              if (yearInputRef.current)
                setSearchYear(+yearInputRef.current.value || null);

              setSearchProfessorId(professor?.id || null);
              setSearchSubjectId(subject?.id || null);
              setSearchMajorId(major?.id || null);
              setSearchSchoolId(school?.id || null);
              setSearchArchived(archived || null);
            }}
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
