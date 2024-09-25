"use client";

import CustomPagination from "@components/CustomPagination";
import { professorColumns } from "@modules/lobby-serksa/components/data-tables";
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
import { CreateProfessorsSchema, Subject } from "@modules/lobby-serksa/models";
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
import {
  InputFormField,
  SearchSelectFormField,
  SelectFormField,
} from "@components/form";

async function onCreateHandler(data: z.infer<typeof CreateProfessorsSchema>) {
  const professors = data.professors.map((subject) => {
    return {
      title: subject.title,
      full_name: subject.full_name,
      subject_ids: subject.subjects.map((subject) => {
        return subject.id;
      }),
    };
  });
  return axiosInstance.post(`/admin/professors`, professors).then((res) => {
    return res.data as { code: number; message: string };
  });
}

function CreateProfessorsSheet({
  children,
  refetch,
}: {
  children: React.ReactNode;
  refetch: () => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const form = useForm<z.infer<typeof CreateProfessorsSchema>>({
    resolver: zodResolver(CreateProfessorsSchema),
    defaultValues: {
      professors: [
        { title: "Dr.", full_name: "", subjects: [{ id: 0, name: "" }] },
      ],
    },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "professors",
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
              <SheetTitle>Create professors</SheetTitle>
              <SheetDescription>
                Create multiple professors at once.
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
                    <Label>Title</Label>
                    <FormField
                      control={form.control}
                      name={`professors.${index}.title`}
                      render={({ field }) => (
                        <SelectFormField
                          field={field}
                          errorField={
                            form.formState.errors
                              ? form.formState.errors.professors?.[index]?.title
                              : undefined
                          }
                          options={[
                            { value: "Dr.", label: "Dr." },
                            { value: "Prof.", label: "Prof." },
                            { value: "Assoc. Prof.", label: "Assoc. Prof." },
                            { value: "Asst. Prof.", label: "Asst. Prof." },
                          ]}
                          defaultSelectedValue={field.value}
                          placeholderSelect="Title"
                        />
                      )}
                    />
                    <Label>Full Name</Label>
                    <FormField
                      control={form.control}
                      name={`professors.${index}.full_name`}
                      render={({ field }) => (
                        <InputFormField
                          field={field}
                          errorField={
                            form.formState.errors
                              ? form.formState.errors.professors?.[index]
                                  ?.full_name
                              : undefined
                          }
                          placeholder="Full Name"
                        />
                      )}
                    />
                    <Label>Subjects</Label>
                    <div className="space-y-2">
                      {fieldArray.fields[index].subjects.map(
                        (subject, sIndex) => {
                          return (
                            <FormField
                              key={subject.id}
                              control={form.control}
                              name={`professors.${index}.subjects.${sIndex}`}
                              render={({ field }) => (
                                <SearchSelectFormField
                                  id="subject"
                                  field={field}
                                  errorField={
                                    form.formState.errors
                                      ? form.formState.errors.professors?.[
                                          index
                                        ]?.subjects?.[sIndex]
                                      : undefined
                                  }
                                  placeholder="Select Subject"
                                  fetchResource={async (searchPhase) => {
                                    return axiosInstance
                                      .get(`/admin/subjects`, {
                                        params: { ["name:ilike"]: searchPhase },
                                      })
                                      .then((res) => {
                                        return res.data.data.subjects;
                                      });
                                  }}
                                  optionLabel="name"
                                  optionValue="id"
                                  onSelected={function (value: Subject) {
                                    field.onChange({
                                      id: value.id,
                                      name: value.name,
                                    });
                                  }}
                                />
                              )}
                            />
                          );
                        },
                      )}
                    </div>
                    <div className="my-2 flex justify-end gap-4">
                      {fieldArray.fields[index].subjects.length > 1 ? (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            const professor = fieldArray.fields[index];
                            professor.subjects.pop();

                            form.setValue(
                              `professors.${index}.subjects`,
                              professor.subjects,
                              {
                                shouldValidate: true,
                              },
                            );
                          }}
                        >
                          Remove Last Subject
                        </Button>
                      ) : null}

                      <Button
                        type="button"
                        onClick={() => {
                          const professor = fieldArray.fields[index];
                          professor.subjects.push({ id: 0, name: "" });

                          form.setValue(
                            `professors.${index}.subjects`,
                            professor.subjects,
                            {
                              shouldValidate: true,
                            },
                          );
                        }}
                      >
                        Add Subject
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() =>
                  fieldArray.append({
                    title: "Dr.",
                    full_name: "",
                    subjects: [{ id: 0, name: "" }],
                  })
                }
              >
                Add Professor
              </Button>
              {fieldArray.fields.length > 1 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    fieldArray.remove(fieldArray.fields.length - 1)
                  }
                >
                  Remove Last Professor
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

export function ProfessorDataTable() {
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
    queryKey: ["professors", { limit, offset }],
    queryFn: async () => {
      const response = await axiosInstance.get(`/admin/professors`, {
        params: { limit, offset },
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
        <CreateProfessorsSheet refetch={refetch}>
          <Button>Create</Button>
        </CreateProfessorsSheet>
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
