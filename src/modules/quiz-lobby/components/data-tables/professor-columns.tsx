"use client";

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
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Form, FormField } from "@components/ui/form";
import { Label } from "@components/ui/label";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosInstance } from "@modules/quiz-lobby/fetch";
import {
  professorSchema,
  subjectsResponseSchema,
  subjectSchema,
  updateProfessorSchema,
} from "@modules/quiz-lobby/models";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash, Undo } from "lucide-react";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

export const professorColumns: ColumnDef<z.infer<typeof professorSchema>>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "full_name",
    header: "Name",
  },
  {
    header: "Subjects",
    cell: ({ row }) => {
      const professor = row.original;

      return (
        <div className="flex items-center gap-2">
          {professor.subjects.map((subject) => (
            <p
              key={subject.id}
              className="inline rounded bg-gray-300 px-2 py-1 dark:bg-gray-700"
            >
              {subject.id} - {subject.name} ({subject.semester}:{subject.year})
            </p>
          ))}
        </div>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row, table }) => {
      const professor = row.original;
      const meta = table.options.meta as { refetch: () => void } | undefined;

      return <ActionProfessor professor={professor} meta={meta} />;
    },
  },
];

function ActionProfessor({
  professor,
  meta,
}: {
  professor: z.infer<typeof professorSchema>;
  meta?: { refetch: () => void };
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<z.infer<typeof updateProfessorSchema>>({
    resolver: zodResolver(updateProfessorSchema),
    defaultValues: {
      ...professor,
    },
  });

  React.useEffect(() => {
    form.reset({
      ...professor,
    });
  }, [form, professor]);

  const subjectFieldArray = useFieldArray({
    control: form.control,
    name: "subjects",
    keyName: "key",
  });

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <SheetTrigger asChild>
              <DropdownMenuItem className="cursor-pointer">
                Update
              </DropdownMenuItem>
            </SheetTrigger>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="cursor-pointer text-red-400 focus:text-red-500">
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              professor record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                axiosInstance
                  .delete(`/admin/professors`, {
                    data: { ids: [professor.id] },
                  })
                  .then((res) => {
                    toast({
                      title: "Success",
                      description: res.data.message,
                    });
                    if (meta) meta.refetch();
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
      </AlertDialog>
      <Form {...form}>
        <SheetContent className="lg:max-w-4xl">
          <form
            className="grid h-full grid-rows-[auto,1fr,auto]"
            onSubmit={form.handleSubmit((d) => {
              const { title, full_name, subjects } = d;

              axiosInstance
                .put("/admin/professors", [
                  {
                    title,
                    full_name,
                    subject_ids: subjects.map((subject) => subject.id),
                    id: professor.id,
                  },
                ])
                .then((res) => {
                  toast({
                    title: "Success",
                    description: res.data.message,
                  });
                  setIsOpen(false);
                  if (meta) meta.refetch();
                })
                .catch((errRes) => {
                  toast({
                    title: "Error",
                    description: errRes.response.data.message,
                    variant: "destructive",
                  });
                });
            }, console.error)}
          >
            <SheetHeader>
              <SheetTitle>Update professor</SheetTitle>
              <SheetDescription>
                Make changes to professor here. Click update when you&apos;re
                done.
              </SheetDescription>
            </SheetHeader>
            <div className="my-2 grid grid-rows-[auto,auto,1fr,auto]">
              <div>
                <Label>Title</Label>
                <FormField
                  control={form.control}
                  name={`title`}
                  render={({ field }) => (
                    <SelectFormField
                      field={field}
                      errorField={form.formState.errors?.title}
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
              </div>
              <div>
                <Label>Full Name</Label>
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <InputFormField
                      field={field}
                      errorField={form.formState.errors?.full_name}
                      placeholder="Full Name"
                    />
                  )}
                />
              </div>
              <div className="my-2 grid grid-rows-1 gap-2">
                <div className="grid grid-rows-[auto,1fr] space-y-2">
                  <Label>Subjects</Label>
                  <div className="relative">
                    <div className="absolute inset-0 space-y-2 overflow-y-auto">
                      {subjectFieldArray.fields.map((field, i) => (
                        <div
                          key={field.id}
                          className="flex items-center justify-center gap-2 text-sm"
                        >
                          <FormField
                            key={field.key}
                            control={form.control}
                            name={`subjects.${i}`}
                            render={({ field }) => (
                              <SearchSelectFormField<
                                z.infer<typeof subjectSchema>
                              >
                                className="w-full"
                                ids={["subjects"]}
                                field={field}
                                errorField={form.formState.errors.subjects?.[i]}
                                placeholder="Select Subject"
                                fetchResource={async (searchPhase) => {
                                  return axiosInstance
                                    .get(`/admin/subjects`, {
                                      params: { ["name:ilike"]: searchPhase },
                                    })
                                    .then((res) => {
                                      const result =
                                        subjectsResponseSchema.safeParse(
                                          res.data,
                                        );

                                      if (!result.success) {
                                        console.error(result.error.errors);
                                        return [];
                                      }

                                      return result.data.data.subjects;
                                    });
                                }}
                                onSelected={field.onChange}
                                getLabel={(subject) =>
                                  !subject.id
                                    ? ""
                                    : `${subject.id} - ${subject.name} (semester:${subject.semester}-year:${subject.year})`
                                }
                                isSelectedData={(subject) =>
                                  subject.id === field.value.id
                                }
                              />
                            )}
                          />
                          <Button
                            variant="destructive"
                            type="button"
                            disabled={field.id === 0}
                            onClick={() => {
                              subjectFieldArray.remove(i);
                            }}
                          >
                            <Trash />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="my-2 flex justify-end gap-2">
                {subjectFieldArray.fields.length > 0 ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      subjectFieldArray.remove(
                        subjectFieldArray.fields.length - 1,
                      );
                    }}
                  >
                    Remove Last Subject
                  </Button>
                ) : null}
                <Button
                  type="button"
                  onClick={() => {
                    subjectFieldArray.append({
                      id: 0,
                      name: "",
                      semester: 0,
                      year: 0,
                    });
                  }}
                >
                  Add Subject
                </Button>
              </div>
            </div>
            <SheetFooter>
              <Button type="submit">Update</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Form>
    </Sheet>
  );
}
