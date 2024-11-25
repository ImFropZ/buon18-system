"use client";

import {
  InputFormField,
  SearchSelectFormField,
  SwitchFormField,
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
import { Dialog, DialogContent, DialogTrigger } from "@components/ui/dialog";
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
import { cn } from "@lib/utils";
import { axiosInstance } from "@modules/quiz-lobby/fetch";
import {
  Professor,
  Quiz,
  Subject,
  UpdateQuizSchema,
} from "@modules/quiz-lobby/models";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Trash, Undo } from "lucide-react";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

export const quizColumns: ColumnDef<Quiz>[] = [
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
    header: "ID",
    cell: ({ row }) => (
      <p className={cn(row.original.archived ? "font-bold text-red-400" : "")}>
        {row.original.id}
      </p>
    ),
  },
  {
    header: "Question (Image)",
    cell: ({ row }) => {
      const quiz = row.original;
      return (
        <div className="flex items-center justify-between gap-2">
          <p>{quiz.question}</p>
          {quiz.image_url !== "" ? (
            <ImageDialog src={quiz.image_url}>
              <Eye className="cursor-pointer rounded-lg px-1 outline outline-2 outline-gray-400" />
            </ImageDialog>
          ) : null}
        </div>
      );
    },
  },
  {
    header: "Answer",
    cell: ({ row }) => {
      const quiz = row.original;
      const answer = quiz.options.find(
        (option) => option.id === quiz.answer_id,
      );

      return (
        <div className="flex items-center gap-2">
          <p className="inline rounded bg-gray-300 px-2 py-1 dark:bg-gray-700">
            {answer?.id}
          </p>
          <p>{answer?.label}</p>
        </div>
      );
    },
  },
  {
    header: "Professor",
    cell: ({ row }) => {
      const quiz = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="inline rounded bg-gray-300 px-2 py-1 dark:bg-gray-700">
            {quiz.professor.id}
          </p>
          <p>
            {quiz.professor.title} {quiz.professor.full_name}
          </p>
        </div>
      );
    },
  },
  {
    header: "Subject",
    cell: ({ row }) => {
      const quiz = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="inline rounded bg-gray-300 px-2 py-1 dark:bg-gray-700">
            {quiz.subject.id}
          </p>
          <p>{quiz.subject.name}</p>
        </div>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row, table }) => {
      const quiz = row.original;
      const meta = table.options.meta as { refetch: () => void } | undefined;

      return <ActionQuiz quiz={quiz} meta={meta} />;
    },
  },
];

function ImageDialog({
  children,
  src,
}: {
  children: React.ReactNode;
  src: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex justify-center">
        <img src={src} alt="quiz image" />
      </DialogContent>
    </Dialog>
  );
}

function ActionQuiz({
  quiz,
  meta,
}: {
  quiz: Quiz;
  meta?: { refetch: () => void };
}) {
  const [professorId, setProfessorId] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<z.infer<typeof UpdateQuizSchema>>({
    resolver: zodResolver(UpdateQuizSchema),
    defaultValues: {
      question: quiz.question,
      image_url: quiz.image_url,
      archived: quiz.archived,
      professor: quiz.professor,
      subject: quiz.subject,
      update_options: quiz.options.map((option) => ({
        id: option.id,
        label: option.label,
        is_correct: option.id === quiz.answer_id,
      })),
      add_options: [],
      remove_option_ids: [],
    },
  });

  React.useEffect(() => {
    form.reset({
      question: quiz.question,
      image_url: quiz.image_url,
      archived: quiz.archived,
      professor: quiz.professor,
      subject: quiz.subject,
      update_options: quiz.options.map((option) => ({
        id: option.id,
        label: option.label,
        is_correct: option.id === quiz.answer_id,
      })),
      add_options: [],
      remove_option_ids: [],
    });
    setProfessorId(quiz.professor.id);
  }, [form, quiz]);

  const updateOptionFieldArray = useFieldArray({
    control: form.control,
    name: "update_options",
    keyName: "key",
  });

  const addOptionFieldArray = useFieldArray({
    control: form.control,
    name: "add_options",
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
              quiz record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                axiosInstance
                  .delete(`/admin/quizzes`, {
                    data: [{ id: quiz.id }],
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
            className="flex h-full flex-col"
            onSubmit={form.handleSubmit((d) => {
              const update_options = d.update_options.filter((o) => {
                return !d.remove_option_ids.some((id) => id === o.id);
              });
              const add_options = d.add_options.map((o) => {
                return { label: o.label, is_correct: o.is_correct };
              });

              axiosInstance
                .patch("/admin/quizzes", [
                  {
                    question: d.question,
                    image_url: d.image_url,
                    archived: d.archived,
                    professor_id: d.professor.id,
                    subject_id: d.subject.id,
                    ...(d.remove_option_ids.length > 0
                      ? { remove_option_ids: d.remove_option_ids }
                      : {}),
                    ...(update_options.length > 0 ? { update_options } : {}),
                    ...(add_options.length > 0 ? { add_options } : {}),
                    id: quiz.id,
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
              <SheetTitle>Update quiz</SheetTitle>
              <SheetDescription>
                Make changes to quiz here. Click update when you&apos;re done.
              </SheetDescription>
            </SheetHeader>
            <div className="my-2 flex flex-1 flex-col gap-2">
              <div className="flex items-center justify-end gap-4">
                <FormField
                  control={form.control}
                  name="archived"
                  render={({ field }) => (
                    <SwitchFormField
                      field={field}
                      errorField={
                        form.formState.errors
                          ? form.formState.errors?.archived
                          : undefined
                      }
                    />
                  )}
                />
                <Label>Archived</Label>
              </div>
              <Label>Question</Label>
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <InputFormField
                    field={field}
                    errorField={
                      form.formState.errors
                        ? form.formState.errors?.question
                        : undefined
                    }
                    placeholder="Question"
                  />
                )}
              />
              <div className="flex flex-col gap-2">
                <Label>Image URL</Label>
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <InputFormField
                        className="flex-1"
                        field={field}
                        errorField={
                          form.formState.errors
                            ? form.formState.errors?.image_url
                            : undefined
                        }
                        placeholder="https://placehold.co/200x200"
                      />
                    )}
                  />
                  <div className="grid aspect-square h-52 w-52 place-items-center border p-2">
                    <img src={form.watch("image_url")} alt="Preview" />
                  </div>
                </div>
              </div>
              <Label>Professor</Label>
              <FormField
                control={form.control}
                name={`professor`}
                render={({ field }) => (
                  <SearchSelectFormField
                    id="professor"
                    field={field}
                    errorField={
                      form.formState.errors
                        ? form.formState.errors.professor
                        : undefined
                    }
                    placeholder="Select Professor"
                    fetchResource={async (searchPhase) => {
                      return axiosInstance
                        .get(`/admin/professors`, {
                          params: { ["full-name:ilike"]: searchPhase },
                        })
                        .then((res) => {
                          return res.data.data.professors;
                        });
                    }}
                    optionLabel="full_name"
                    optionValue="id"
                    onSelected={function (value: Professor) {
                      field.onChange({
                        id: value.id,
                        full_name: value.full_name,
                      });
                      setProfessorId(value.id);
                      form.setValue(`subject`, {
                        id: 0,
                        name: "",
                        semester: 0,
                        year: 0,
                      });
                    }}
                  />
                )}
              />
              <Label>Subject</Label>
              <FormField
                control={form.control}
                name={`subject`}
                render={({ field }) => (
                  <SearchSelectFormField
                    id="subject"
                    field={field}
                    additionalKeys={[professorId.toString()]}
                    disabled={professorId === 0}
                    errorField={
                      form.formState.errors
                        ? form.formState.errors.subject
                        : undefined
                    }
                    placeholder="Select Subject"
                    fetchResource={async (searchPhase) => {
                      return axiosInstance
                        .get(`/admin/subjects`, {
                          params: {
                            ["name:ilike"]: searchPhase,
                            ["professor-id:eq"]: professorId === 0 ? undefined : professorId,
                          },
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
              <Label>Options: Label, Correct</Label>
              <div className="relative flex-1">
                <div className="absolute inset-0 space-y-2 overflow-y-auto p-2 pr-4">
                  {updateOptionFieldArray.fields.map((field, index) => {
                    return (
                      <div key={field.id} className="flex items-center gap-2">
                        {form
                          .getValues("remove_option_ids")
                          .some((id) => id === field.id) ? (
                          <Button
                            variant="ghost"
                            type="button"
                            onClick={() => {
                              const removeOptionIds = form
                                .getValues("remove_option_ids")
                                .filter((id) => id !== field.id);
                              form.setValue(
                                `remove_option_ids`,
                                removeOptionIds,
                                {
                                  shouldValidate: true,
                                },
                              );
                            }}
                          >
                            <Undo />
                          </Button>
                        ) : (
                          <Button
                            variant="destructive"
                            type="button"
                            onClick={() => {
                              if (field.id) {
                                form.setValue(
                                  `remove_option_ids`,
                                  [
                                    ...form.getValues("remove_option_ids"),
                                    field.id,
                                  ],
                                  {
                                    shouldValidate: true,
                                  },
                                );
                              }
                            }}
                          >
                            <Trash />
                          </Button>
                        )}
                        <FormField
                          control={form.control}
                          name={`update_options.${index}.label`}
                          render={({ field }) => (
                            <InputFormField
                              className="flex-1"
                              field={field}
                              errorField={
                                form.formState.errors
                                  ? form.formState.errors.update_options?.[
                                      index
                                    ]?.label
                                  : undefined
                              }
                              placeholder="Label"
                            />
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`update_options.${index}.is_correct`}
                          render={({ field }) => {
                            return (
                              <SwitchFormField
                                onUpdate={(e) => {
                                  if (e) {
                                    updateOptionFieldArray.fields.forEach(
                                      (_, i) => {
                                        if (i !== index) {
                                          form.setValue(
                                            `update_options.${i}.is_correct`,
                                            false,
                                          );
                                        }
                                      },
                                    );
                                    addOptionFieldArray.fields.forEach(
                                      (_, i) => {
                                        if (i !== index) {
                                          form.setValue(
                                            `add_options.${i}.is_correct`,
                                            false,
                                          );
                                        }
                                      },
                                    );
                                  }
                                }}
                                field={field}
                                errorField={
                                  form.formState.errors
                                    ? form.formState.errors.update_options?.[
                                        index
                                      ]?.is_correct
                                    : undefined
                                }
                              />
                            );
                          }}
                        />
                      </div>
                    );
                  })}
                  {addOptionFieldArray.fields.map((field, index) => {
                    return (
                      <div key={field.id} className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name={`add_options.${index}.label`}
                          render={({ field }) => (
                            <InputFormField
                              className="flex-1"
                              field={field}
                              errorField={
                                form.formState.errors
                                  ? form.formState.errors.add_options?.[index]
                                      ?.label
                                  : undefined
                              }
                              placeholder="Label"
                            />
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`add_options.${index}.is_correct`}
                          render={({ field }) => {
                            return (
                              <SwitchFormField
                                onUpdate={(e) => {
                                  if (e) {
                                    updateOptionFieldArray.fields.forEach(
                                      (_, i) => {
                                        if (i !== index) {
                                          form.setValue(
                                            `update_options.${i}.is_correct`,
                                            false,
                                          );
                                        }
                                      },
                                    );
                                    addOptionFieldArray.fields.forEach(
                                      (_, i) => {
                                        if (i !== index) {
                                          form.setValue(
                                            `add_options.${i}.is_correct`,
                                            false,
                                          );
                                        }
                                      },
                                    );
                                  }
                                }}
                                field={field}
                                errorField={
                                  form.formState.errors
                                    ? form.formState.errors.add_options?.[index]
                                        ?.is_correct
                                    : undefined
                                }
                              />
                            );
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                {addOptionFieldArray.fields.length > 0 ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      addOptionFieldArray.remove(
                        addOptionFieldArray.fields.length - 1,
                      );
                    }}
                  >
                    Remove Last Option
                  </Button>
                ) : null}
                <Button
                  type="button"
                  onClick={() => {
                    addOptionFieldArray.append({
                      label: "",
                      is_correct: false,
                    });
                  }}
                >
                  Add Options
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
