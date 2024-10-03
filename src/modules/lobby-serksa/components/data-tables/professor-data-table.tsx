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
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";

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

  const idInputRef = React.useRef<HTMLInputElement>(null);
  const semesterInputRef = React.useRef<HTMLInputElement>(null);
  const yearInputRef = React.useRef<HTMLInputElement>(null);
  const [title, setTitle] = React.useState<string | null>(searchTitle || null);
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
            placeholder="Search full name ..."
            defaultValue={search}
          />
          <AdvanceSearch
            title="Advance professor search"
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
              <div className="flex flex-col gap-4" key="title-search">
                <Label>Title</Label>
                <div className="flex gap-2">
                  <Select onValueChange={setTitle} value={title || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Title</SelectLabel>
                        <SelectItem value="Dr.">Dr.</SelectItem>
                        <SelectItem value="Prof.">Prof.</SelectItem>
                        <SelectItem value="Assoc. Prof.">
                          Assoc. Prof.
                        </SelectItem>
                        <SelectItem value="Asst. Prof.">Asst. Prof.</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Button
                    disabled={!title}
                    onClick={() => {
                      setTitle(null);
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

              setSearchTitle(title);
              setSearchSubjectId(subject?.id || null);
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
                    the professor records.
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
