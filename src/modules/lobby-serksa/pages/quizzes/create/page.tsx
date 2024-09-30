"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateQuizzesSchema,
  Professor,
  Subject,
} from "@modules/lobby-serksa/models";
import { useFieldArray, useForm } from "react-hook-form";
import React from "react";
import * as z from "zod";
import { Form, FormField } from "@components/ui/form";
import { Label } from "@components/ui/label";
import {
  InputFormField,
  SearchSelectFormField,
  SwitchFormField,
} from "@components/form";
import { axiosInstance } from "@modules/lobby-serksa/fetch";
import { Button } from "@components/ui/button";
import { toast } from "@components/ui/use-toast";
import { useRouter } from "next/navigation";

const DEFAULT_QUIZ = {
  question: "",
  image_url: "",
  options: [
    {
      label: "",
      is_correct: false,
    },
    {
      label: "",
      is_correct: false,
    },
    {
      label: "",
      is_correct: false,
    },
    {
      label: "",
      is_correct: false,
    },
    {
      label: "",
      is_correct: false,
    },
  ],
};

const onCreateHandler = async (data: z.infer<typeof CreateQuizzesSchema>) => {
  const quizzes = data.quizzes.map((quiz) => {
    return {
      question: quiz.question,
      ...(quiz.image_url !== "" ? { image_url: quiz.image_url } : {}),
      professor_id: data.professor.id,
      subject_id: data.subject.id,
      options: quiz.options,
    };
  });
  return axiosInstance
    .post("/admin/quizzes", quizzes)
    .then((res) => res.data as { code: number; message: string });
};

export default function Page() {
  const router = useRouter();

  const form = useForm<z.infer<typeof CreateQuizzesSchema>>({
    resolver: zodResolver(CreateQuizzesSchema),
    defaultValues: {
      professor: {
        id: 0,
        full_name: "",
      },
      subject: {
        id: 0,
        name: "",
      },
      quizzes: [DEFAULT_QUIZ],
    },
  });

  const quizFieldArray = useFieldArray({
    control: form.control,
    name: "quizzes",
  });

  return (
    <div className="grid h-full grid-rows-[auto,1fr] p-2">
      <h1 className="text-2xl font-bold">Create Quizzes</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((d) => {
            onCreateHandler(d)
              .then((response) => {
                if (response.code === 201) {
                  form.reset();
                  toast({
                    title: "Success",
                    description: response.message,
                  });
                  router.push("/lobby-serksa/quizzes");
                  return;
                }

                toast({
                  title: "Error",
                  description: response.message,
                  variant: "destructive",
                });
              })
              .catch((e) => {
                toast({
                  title: "Error",
                  description: e.response.data.message,
                  variant: "destructive",
                });
              });
          }, console.error)}
          className="grid h-full grid-rows-[auto,1fr,auto] gap-2 py-2"
        >
          <div className="flex gap-2">
            <div className="flex-1">
              <Label>Professor</Label>
              <FormField
                control={form.control}
                name="professor"
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
                    }}
                  />
                )}
              />
            </div>
            <div className="flex-1">
              <Label>Subject</Label>
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <SearchSelectFormField
                    id="subject"
                    field={field}
                    errorField={
                      form.formState.errors
                        ? form.formState.errors.subject
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
                      field.onChange({ id: value.id, name: value.name });
                    }}
                  />
                )}
              />
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex flex-col gap-2 overflow-y-auto px-4">
              {quizFieldArray.fields.map((field, index) => {
                return (
                  <div className="flex flex-col gap-2 border p-2">
                    <div className="flex justify-between">
                      <p className="rounded bg-gray-300 px-2 text-sm">
                        #{index + 1}
                      </p>
                      <p className="rounded bg-gray-300 px-2 text-sm">
                        {field.id}
                      </p>
                    </div>
                    <Label>Question</Label>
                    <FormField
                      control={form.control}
                      name={`quizzes.${index}.question`}
                      render={({ field }) => (
                        <InputFormField
                          field={field}
                          errorField={
                            form.formState.errors
                              ? form.formState.errors?.quizzes?.[index]
                                  ?.question
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
                          name={`quizzes.${index}.image_url`}
                          render={({ field }) => (
                            <InputFormField
                              className="flex-1"
                              field={field}
                              errorField={
                                form.formState.errors
                                  ? form.formState.errors?.quizzes?.[index]
                                      ?.image_url
                                  : undefined
                              }
                              placeholder="https://placehold.co/200x200"
                            />
                          )}
                        />
                        <div className="grid aspect-square h-52 w-52 place-items-center border p-2">
                          <img
                            src={form.watch(`quizzes.${index}.image_url`)}
                            alt="Preview"
                          />
                        </div>
                      </div>
                    </div>
                    <Label>Options: Label, Correct</Label>
                    <div className="flex h-64 flex-col gap-2 overflow-y-auto p-2 pr-4">
                      {field.options.map((_, j) => {
                        return (
                          <div key={j} className="flex items-center gap-2">
                            <FormField
                              control={form.control}
                              name={`quizzes.${index}.options.${j}.label`}
                              render={({ field }) => (
                                <InputFormField
                                  className="flex-1"
                                  field={field}
                                  errorField={
                                    form.formState.errors
                                      ? form.formState.errors.quizzes?.[index]
                                          ?.options?.[j]?.label
                                      : undefined
                                  }
                                  placeholder="Label"
                                />
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`quizzes.${index}.options.${j}.is_correct`}
                              render={({ field }) => {
                                return (
                                  <SwitchFormField
                                    onUpdate={(e) => {
                                      if (e) {
                                        const newQuiz =
                                          form.getValues().quizzes[index];
                                        newQuiz.options.forEach((option) => {
                                          option.is_correct = false;
                                        });
                                        form.setValue(
                                          `quizzes.${index}.options`,
                                          newQuiz.options,
                                          { shouldValidate: true },
                                        );
                                      }
                                    }}
                                    field={field}
                                    errorField={
                                      form.formState.errors
                                        ? form.formState.errors.quizzes?.[index]
                                            ?.options?.[j]?.is_correct
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
                    <div className="flex justify-end gap-2">
                      {field.options.length > 1 ? (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            const newQuiz = form.getValues().quizzes[index];
                            newQuiz.options.pop();
                            quizFieldArray.update(index, newQuiz);
                          }}
                        >
                          Remove Last Option
                        </Button>
                      ) : null}
                      <Button
                        type="button"
                        onClick={() => {
                          const newQuiz = form.getValues().quizzes[index];
                          newQuiz.options.push({
                            label: "",
                            is_correct: false,
                          });
                          quizFieldArray.update(index, newQuiz);
                        }}
                      >
                        Add Options
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => {
                  quizFieldArray.append(DEFAULT_QUIZ);
                }}
              >
                Add Quiz
              </Button>
              {quizFieldArray.fields.length > 1 ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    quizFieldArray.remove(quizFieldArray.fields.length - 1);
                  }}
                >
                  Remove Last Quiz
                </Button>
              ) : null}
            </div>
            <div>
              <Button>Create</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
