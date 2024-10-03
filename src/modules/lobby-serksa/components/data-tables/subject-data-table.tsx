"use client";

import CustomPagination from "@components/CustomPagination";
import { subjectColumns } from "@modules/lobby-serksa/components/data-tables";
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
import * as z from "zod";
import { CreateSubjectsSchema, Major } from "@modules/lobby-serksa/models";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@components/ui/sheet";
import { toast } from "@components/ui/use-toast";
import { Label } from "@components/ui/label";
import { InputFormField, SearchSelectFormField } from "@components/form";
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
import { AdvanceSearch, SearchBar } from "@components";
import { Input } from "@components/ui/input";
import { SearchPopover } from "../SearchPopover";

async function onCreateHandler(data: z.infer<typeof CreateSubjectsSchema>) {
  const subjects = data.subjects.map((subject) => {
    return {
      name: subject.name,
      year: subject.year,
      semester: subject.semester,
      major_id: subject.major.id,
    };
  });
  return axiosInstance.post(`/admin/subjects`, subjects).then((res) => {
    return res.data as { code: number; message: string };
  });
}

function CreateSubjectsSheet({
  children,
  refetch,
}: {
  children: React.ReactNode;
  refetch: () => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const form = useForm<z.infer<typeof CreateSubjectsSchema>>({
    resolver: zodResolver(CreateSubjectsSchema),
    defaultValues: {
      subjects: [
        { name: "", year: 0, semester: 0, major: { id: 0, name: "" } },
      ],
    },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "subjects",
  });

  return (
    <Form {...form}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="lg:max-w-4xl">
          <form
            className="grid h-full grid-rows-[auto,1fr,auto,auto]"
            onSubmit={form.handleSubmit(
              (d) => {
                onCreateHandler(d)
                  .then((response) => {
                    form.reset();
                    refetch();
                    setIsOpen(false);
                    toast({
                      title: "Success",
                      description: response.message,
                    });
                  })
                  .catch((errRes) => {
                    toast({
                      title: "Failed to create subjects",
                      description: errRes.response.data.message,
                      variant: "destructive",
                    });
                  });
              },
              () => {
                toast({
                  title: "Invalid form data",
                  description: "Problem with subjects data",
                  variant: "destructive",
                });
              },
            )}
          >
            <SheetHeader>
              <SheetTitle>Create subjects</SheetTitle>
              <SheetDescription>
                Create multiple majors at once.
              </SheetDescription>
            </SheetHeader>
            <div className="my-2 flex flex-col gap-2 overflow-y-auto p-2 px-4">
              {fieldArray.fields.map((field, index) => {
                return (
                  <div
                    key={field.id}
                    className="rounded border-2 p-2 px-4 pb-4"
                  >
                    <p className="ml-auto w-fit rounded bg-gray-300 px-2 text-sm">
                      {field.id}
                    </p>
                    <Label>Name</Label>
                    <FormField
                      control={form.control}
                      name={`subjects.${index}.name`}
                      render={({ field }) => (
                        <InputFormField
                          field={field}
                          errorField={
                            form.formState.errors
                              ? form.formState.errors.subjects?.[index]?.name
                              : undefined
                          }
                          placeholder="Name"
                        />
                      )}
                    />
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Label>Semester</Label>
                        <FormField
                          control={form.control}
                          name={`subjects.${index}.semester`}
                          render={({ field }) => (
                            <InputFormField
                              field={field}
                              errorField={
                                form.formState.errors
                                  ? form.formState.errors.subjects?.[index]
                                      ?.semester
                                  : undefined
                              }
                              placeholder="Semester"
                            />
                          )}
                        />
                      </div>
                      <div className="flex-1">
                        <Label>Year</Label>
                        <FormField
                          control={form.control}
                          name={`subjects.${index}.year`}
                          render={({ field }) => (
                            <InputFormField
                              field={field}
                              errorField={
                                form.formState.errors
                                  ? form.formState.errors.subjects?.[index]
                                      ?.year
                                  : undefined
                              }
                              placeholder="Year"
                            />
                          )}
                        />
                      </div>
                    </div>
                    <Label>Major</Label>
                    <FormField
                      control={form.control}
                      name={`subjects.${index}.major`}
                      render={({ field }) => (
                        <SearchSelectFormField
                          id="major"
                          field={field}
                          errorField={
                            form.formState.errors
                              ? form.formState.errors.subjects?.[index]?.major
                              : undefined
                          }
                          placeholder="Select Major"
                          fetchResource={async (searchPhase) => {
                            return axiosInstance
                              .get(`/admin/majors`, {
                                params: { ["name:ilike"]: searchPhase },
                              })
                              .then((res) => {
                                return res.data.data.majors;
                              });
                          }}
                          optionLabel="name"
                          optionValue="id"
                          onSelected={function (value: Major) {
                            field.onChange({ id: value.id, name: value.name });
                          }}
                        />
                      )}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() =>
                  fieldArray.append({
                    name: "",
                    year: 0,
                    semester: 0,
                    major: { id: 0, name: "" },
                  })
                }
              >
                Add Subject
              </Button>
              {fieldArray.fields.length > 1 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    fieldArray.remove(fieldArray.fields.length - 1)
                  }
                >
                  Remove Last Subject
                </Button>
              )}
            </div>
            <SheetFooter>
              <Button type="submit">Create</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </Form>
  );
}

function onDeleteSelectedHandler(ids: number[]) {
  const deleteBody = ids.map((id) => ({ id }));
  return axiosInstance.delete(`/admin/subjects`, { data: deleteBody });
}

export function SubjectDataTable() {
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
  const [searchSemester, setSearchSemester] = useQueryState(
    "semester:eq",
    parseAsInteger,
  );
  const [searchYear, setSearchYear] = useQueryState("year:eq", parseAsInteger);
  const [searchMajorId, setSearchMajorId] = useQueryState(
    "base-major-id:eq",
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
  const [major, setMajor] = React.useState<{ id: number; name: string } | null>(
    searchMajorId
      ? {
          id: +searchMajorId,
          name: "(not loaded)",
        }
      : null,
  );
  const [school, setSchool] = React.useState<null | {
    id: number;
    name: string;
  }>(
    searchSchoolId
      ? {
          id: +searchSchoolId,
          name: "(not loaded)",
        }
      : null,
  );

  const { data, refetch, isLoading } = useQuery({
    queryKey: [
      "subjects",
      {
        limit,
        offset,
        "name:ilike": search,
        "id:eq": searchId,
        "semester:eq": searchSemester,
        "year:eq": searchYear,
        "base-major-id:eq": searchMajorId,
        "school-id:eq": searchSchoolId,
      },
    ],
    queryFn: async () => {
      const response = await axiosInstance.get(`/admin/subjects`, {
        params: {
          limit,
          offset,
          "name:ilike": search,
          "id:eq": searchId,
          "semester:eq": searchSemester,
          "year:eq": searchYear,
          "base-major-id:eq": searchMajorId,
          "school-id:eq": searchSchoolId,
        },
      });
      setTotal(+response.headers["x-total-count"] || 0);
      return response.data;
    },
  });

  const table = useReactTable({
    data: data?.data.subjects || [],
    columns: subjectColumns,
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
          <AdvanceSearch
            title="Advance subject search"
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

              setSearchMajorId(major?.id || null);
              setSearchSchoolId(school?.id || null);
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
                    the subject records.
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
        <CreateSubjectsSheet refetch={refetch}>
          <Button>Create</Button>
        </CreateSubjectsSheet>
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
                  colSpan={subjectColumns.length}
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
