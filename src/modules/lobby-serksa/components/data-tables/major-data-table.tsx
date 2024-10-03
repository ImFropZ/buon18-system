"use client";

import CustomPagination from "@components/CustomPagination";
import { majorColumns } from "@modules/lobby-serksa/components/data-tables";
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
import { toast } from "@components/ui/use-toast";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateMajorsSchema, School } from "@modules/lobby-serksa/models";
import * as z from "zod";
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

async function onCreateHandler(data: z.infer<typeof CreateMajorsSchema>) {
  const majors = data.majors.map((major) => {
    return {
      name: major.name,
      school_id: major.school.id,
    };
  });
  return axiosInstance.post(`/admin/majors`, majors).then((res) => {
    return res.data as { code: number; message: string };
  });
}

function CreateMajorSheet({
  children,
  refetch,
}: {
  children: React.ReactNode;
  refetch: () => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const form = useForm<z.infer<typeof CreateMajorsSchema>>({
    resolver: zodResolver(CreateMajorsSchema),
    defaultValues: { majors: [{ name: "", school: { id: 0, name: "" } }] },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "majors",
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
                      title: "Failed to create majors",
                      description: errRes.response.data.message,
                      variant: "destructive",
                    });
                  });
              },
              () => {
                toast({
                  title: "Invalid form data",
                  description: "Problem with majors data",
                  variant: "destructive",
                });
              },
            )}
          >
            <SheetHeader>
              <SheetTitle>Create majors</SheetTitle>
              <SheetDescription>
                Create multiple majors at once.
              </SheetDescription>
            </SheetHeader>
            <div className="my-2 flex flex-col gap-2 overflow-y-auto px-4 py-2">
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
                      name={`majors.${index}.name`}
                      render={({ field }) => (
                        <InputFormField
                          field={field}
                          errorField={
                            form.formState.errors
                              ? form.formState.errors.majors?.[index]?.name
                              : undefined
                          }
                          placeholder="Name"
                        />
                      )}
                    />
                    <Label>School</Label>
                    <FormField
                      control={form.control}
                      name={`majors.${index}.school`}
                      render={({ field }) => (
                        <SearchSelectFormField
                          id="school"
                          field={field}
                          errorField={
                            form.formState.errors
                              ? form.formState.errors.majors?.[index]?.school
                              : undefined
                          }
                          placeholder="Select School"
                          fetchResource={async (searchPhase) => {
                            return axiosInstance
                              .get(`/admin/schools`, {
                                params: { ["name:ilike"]: searchPhase },
                              })
                              .then((res) => {
                                return res.data.data.schools;
                              });
                          }}
                          optionLabel="name"
                          optionValue="id"
                          onSelected={function (value: School) {
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
                  fieldArray.append({ name: "", school: { id: 0, name: "" } })
                }
              >
                Add Major
              </Button>
              {fieldArray.fields.length > 1 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    fieldArray.remove(fieldArray.fields.length - 1)
                  }
                >
                  Remove Last Major
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
  return axiosInstance.delete(`/admin/majors`, { data: deleteBody });
}

export function MajorDataTable() {
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
  const [searchSchoolId, setSearchSchoolId] = useQueryState(
    "base-school-id:eq",
    parseAsInteger,
  );
  const [total, setTotal] = React.useState(0);
  const [rowSelection, setRowSelection] = React.useState({});

  const idInputRef = React.useRef<HTMLInputElement>(null);
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
      "majors",
      {
        limit,
        offset,
        "name:ilike": search,
        "id:eq": searchId,
        "base-school-id:eq": searchSchoolId,
      },
    ],
    queryFn: async () => {
      const response = await axiosInstance.get(`/admin/majors`, {
        params: {
          limit,
          offset,
          "name:ilike": search,
          "id:eq": searchId,
          "base-school-id:eq": searchSchoolId,
        },
      });
      setTotal(+response.headers["x-total-count"] || 0);
      return response.data;
    },
  });

  const table = useReactTable({
    data: data?.data.majors || [],
    columns: majorColumns,
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
            title="Advance major search"
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
                    the major records.
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
        <CreateMajorSheet refetch={() => refetch()}>
          <Button>Create</Button>
        </CreateMajorSheet>
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
                  colSpan={majorColumns.length}
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
