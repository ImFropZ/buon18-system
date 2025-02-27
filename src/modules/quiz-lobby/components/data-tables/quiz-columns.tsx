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
  professorsResponseSchema,
  professorSchema,
  quizSchema,
  subjectsResponseSchema,
  subjectSchema,
  updateQuizSchema,
} from "@modules/quiz-lobby/models";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Trash } from "lucide-react";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

export const quizColumns: ColumnDef<z.infer<typeof quizSchema>>[] = [
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
          <p>
            {quiz.question.length > 50
              ? quiz.question.slice(0, 50) + "..."
              : quiz.question}
          </p>
          {quiz.image_url && quiz.image_url.trim() !== "" ? (
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

      if (!answer) return null;

      return (
        <div className="flex items-center gap-2">
          <p className="inline rounded bg-gray-300 px-2 py-1 dark:bg-gray-700">
            {answer.id}
          </p>
          <p>
            {answer.label.length > 50
              ? answer.label.slice(0, 50) + "..."
              : answer.label}
          </p>
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
  quiz: z.infer<typeof quizSchema>;
  meta?: { refetch: () => void };
}) {
  const [professorId, setProfessorId] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<z.infer<typeof updateQuizSchema>>({
    resolver: zodResolver(updateQuizSchema),
    defaultValues: {
      ...quiz,
      options: quiz.options.map((option) => ({
        id: option.id,
        label: option.label,
        is_correct: option.id === quiz.answer_id,
      })),
    },
  });

  React.useEffect(() => {
    form.reset({
      question: quiz.question,
      image_url: quiz.image_url,
      archived: quiz.archived,
      professor: quiz.professor,
      subject: quiz.subject,
      options: quiz.options.map((option) => ({
        id: option.id,
        label: option.label,
        is_correct: option.id === quiz.answer_id,
      })),
    });
    setProfessorId(quiz.professor.id);
  }, [form, quiz]);

  const optionFieldArray = useFieldArray({
    control: form.control,
    name: "options",
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
              quiz record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                axiosInstance
                  .delete(`/admin/quizzes`, {
                    data: { ids: [quiz.id] },
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
              axiosInstance
                .put("/admin/quizzes", [
                  {
                    question: d.question,
                    image_url: d.image_url === "" ? null : d.image_url,
                    archived: d.archived,
                    professor_id: d.professor.id,
                    subject_id: d.subject.id,
                    options: d.options.map((option) => ({
                      id: "id" in option ? option.id : null,
                      label: option.label,
                      is_correct: option.is_correct,
                    })),
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
                      errorField={form.formState.errors?.archived}
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
                    errorField={form.formState.errors?.question}
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
                        errorField={form.formState.errors?.image_url}
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
                  <SearchSelectFormField<z.infer<typeof professorSchema>>
                    ids={["professors"]}
                    field={field}
                    errorField={form.formState.errors.professor}
                    placeholder="Select Professor"
                    fetchResource={async (searchPhase) => {
                      return axiosInstance
                        .get(`/admin/professors`, {
                          params: { ["full-name:ilike"]: searchPhase },
                        })
                        .then((res) => {
                          const result = professorsResponseSchema.safeParse(
                            res.data,
                          );

                          if (!result.success) {
                            console.error(result.error.errors);
                            return [];
                          }

                          return result.data.data.professors;
                        });
                    }}
                    onSelected={function (v) {
                      field.onChange(v);
                      setProfessorId(v.id);
                      form.setValue(`subject`, {
                        id: 0,
                        name: "",
                        semester: 0,
                        year: 0,
                      });
                    }}
                    getLabel={(professor) =>
                      !professor.id
                        ? ""
                        : `${professor.id} - ${professor.title} ${professor.full_name}`
                    }
                    isSelectedData={(professor) =>
                      professor.id === field.value.id
                    }
                  />
                )}
              />
              <Label>Subject</Label>
              <FormField
                control={form.control}
                name={`subject`}
                render={({ field }) => (
                  <SearchSelectFormField<z.infer<typeof subjectSchema>>
                    ids={["subjects", professorId.toString()]}
                    field={field}
                    disabled={professorId === 0}
                    errorField={form.formState.errors.subject}
                    placeholder="Select Subject"
                    fetchResource={async (searchPhase) => {
                      return axiosInstance
                        .get(`/admin/subjects`, {
                          params: {
                            ["name:ilike"]: searchPhase,
                            ["professor-id:eq"]:
                              professorId === 0 ? undefined : professorId,
                          },
                        })
                        .then((res) => {
                          const result = subjectsResponseSchema.safeParse(
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
                    isSelectedData={(subject) => subject.id === field.value.id}
                  />
                )}
              />
              <div className="flex gap-2">
                <Label>Options: Label, Correct</Label>
                <p className="text-sm font-medium leading-none text-destructive peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {form.formState.errors?.options?.root?.message}
                </p>
              </div>
              <div className="relative flex-1">
                <div className="absolute inset-0 space-y-2 overflow-y-auto p-2 pr-4">
                  {optionFieldArray.fields.map((field, index) => {
                    return (
                      <div key={field.key} className="flex items-center gap-2">
                        <Button
                          variant="destructive"
                          type="button"
                          onClick={() => {
                            optionFieldArray.remove(index);
                          }}
                        >
                          <Trash />
                        </Button>
                        <FormField
                          control={form.control}
                          name={`options.${index}.label`}
                          render={({ field }) => (
                            <InputFormField
                              className="flex-1"
                              field={field}
                              errorField={
                                form.formState.errors.options?.[index]?.label
                              }
                              placeholder="Label"
                            />
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`options.${index}.is_correct`}
                          render={({ field }) => {
                            return (
                              <SwitchFormField
                                onUpdate={(e) => {
                                  if (e) {
                                    optionFieldArray.fields.forEach((_, i) => {
                                      if (i !== index) {
                                        form.setValue(
                                          `options.${i}.is_correct`,
                                          false,
                                        );
                                      }
                                    });
                                  }
                                }}
                                field={field}
                                errorField={
                                  form.formState.errors.options?.[index]
                                    ?.is_correct
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
                {optionFieldArray.fields.length > 0 ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      optionFieldArray.remove(
                        optionFieldArray.fields.length - 1,
                      );
                    }}
                  >
                    Remove Last Option
                  </Button>
                ) : null}
                <Button
                  type="button"
                  onClick={() => {
                    optionFieldArray.append({
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
