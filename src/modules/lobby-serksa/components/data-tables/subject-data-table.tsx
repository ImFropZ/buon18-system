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
import { parseAsInteger, useQueryState } from "nuqs";
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

function CreateSubjectSheet({
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
            <div className="my-2 flex flex-col gap-2">
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
                                      ?.semester
                                  : undefined
                              }
                              placeholder="Semester"
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

export function SubjectDataTable() {
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10),
  );
  const [offset, setOffset] = useQueryState(
    "offset",
    parseAsInteger.withDefault(0),
  );
  const [total, setTotal] = React.useState(0);
  const [rowSelection, setRowSelection] = React.useState({});

  const { data, refetch } = useQuery({
    queryKey: ["subjects", { limit, offset }],
    queryFn: async () => {
      const response = await axiosInstance.get(`/admin/subjects`, {
        params: { limit, offset },
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
        <CreateSubjectSheet refetch={refetch}>
          <Button>Create</Button>
        </CreateSubjectSheet>
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
                  No results.
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
