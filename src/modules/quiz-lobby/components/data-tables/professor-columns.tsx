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
  Professor,
  Subject,
  UpdateProfessorSchema,
} from "@modules/quiz-lobby/models";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash, Undo } from "lucide-react";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";

export const professorColumns: ColumnDef<Professor>[] = [
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
  professor: Professor;
  meta?: { refetch: () => void };
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(UpdateProfessorSchema),
    defaultValues: {
      ...professor,
      add_subjects: [] as { id: number; name: string }[],
      remove_subjects: [] as { id: number; name: string }[],
    },
  });

  React.useEffect(() => {
    form.reset({
      ...professor,
      add_subjects: [],
      remove_subjects: [],
    });
  }, [form, professor]);

  const subjectFieldArray = useFieldArray({
    control: form.control,
    name: "subjects",
    keyName: "key",
  });

  const addSubjectFieldArray = useFieldArray({
    control: form.control,
    name: "add_subjects",
    keyName: "key",
  });

  const removeSubjectFieldArray = useFieldArray({
    control: form.control,
    name: "remove_subjects",
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
                    data: [{ id: professor.id }],
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
              const { title, full_name } = d;
              const removeSubjectIds = d.remove_subjects.map((s) => s.id);
              const addSubjectIds = d.add_subjects.map((s) => s.id);

              axiosInstance
                .patch("/admin/professors", [
                  {
                    title,
                    full_name,
                    add_subject_ids: addSubjectIds,
                    remove_subject_ids: removeSubjectIds,
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
                      errorField={
                        form.formState.errors
                          ? form.formState.errors?.title
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
              </div>
              <div>
                <Label>Full Name</Label>
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <InputFormField
                      field={field}
                      errorField={
                        form.formState.errors
                          ? form.formState.errors?.full_name
                          : undefined
                      }
                      placeholder="Full Name"
                    />
                  )}
                />
              </div>
              <div className="my-2 grid grid-rows-2 gap-2">
                <div className="grid grid-rows-[auto,1fr] space-y-2">
                  <Label>Subjects</Label>
                  <div className="relative">
                    <div className="absolute inset-0 space-y-2 overflow-y-auto">
                      {subjectFieldArray.fields.map((field, _) => (
                        <div
                          key={field.id}
                          className="flex items-center justify-center gap-2 text-sm"
                        >
                          <p className="flex-1 rounded-lg border py-2 text-center">
                            {field.id} - {field.name} ({field.semester}:{field.year})
                          </p>
                          {removeSubjectFieldArray.fields.some(
                            (rs) => rs.id === field.id,
                          ) ? (
                            <Button
                              variant="ghost"
                              type="button"
                              onClick={() => {
                                removeSubjectFieldArray.remove(
                                  removeSubjectFieldArray.fields.findIndex(
                                    (rs) => rs.id === field.id,
                                  ),
                                );
                                form.setValue(`subjects`, professor.subjects, {
                                  shouldValidate: true,
                                });
                              }}
                            >
                              <Undo />
                            </Button>
                          ) : (
                            <Button
                              variant="destructive"
                              type="button"
                              onClick={() => {
                                removeSubjectFieldArray.append({
                                  id: field.id,
                                  name: field.name,
                                });
                                form.setValue(`subjects`, professor.subjects, {
                                  shouldValidate: true,
                                });
                              }}
                            >
                              <Trash />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-rows-[auto,1fr] space-y-2">
                  <Label>New Subjects</Label>
                  <div className="relative">
                    <div className="absolute inset-0 space-y-2 overflow-y-auto">
                      {addSubjectFieldArray.fields.map((field, index) => (
                        <FormField
                          key={field.key}
                          control={form.control}
                          name={`add_subjects.${index}`}
                          render={({ field }) => (
                            <SearchSelectFormField
                              id="subject"
                              field={field}
                              errorField={
                                form.formState.errors
                                  ? form.formState.errors.add_subjects?.[index]
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
                              additionalOptionLabels={["semester", "year"]}
                              optionValue="id"
                              onSelected={function (value: Subject) {
                                field.onChange({
                                  id: value.id,
                                  name: value.name,
                                  semester: value.semester,
                                  year: value.year,
                                });
                              }}
                            />
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="my-2 flex justify-end gap-2">
                {addSubjectFieldArray.fields.length > 0 ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      addSubjectFieldArray.remove(
                        addSubjectFieldArray.fields.length - 1,
                      );
                    }}
                  >
                    Remove Last Subject
                  </Button>
                ) : null}
                <Button
                  type="button"
                  onClick={() => {
                    addSubjectFieldArray.append({ id: 0, name: "" });
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
