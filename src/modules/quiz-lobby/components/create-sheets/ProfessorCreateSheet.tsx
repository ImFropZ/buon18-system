"use client";

import React from "react";
import { z } from "zod";
import { CreateProfessorsSchema, Subject } from "@modules/quiz-lobby/models";
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
import {
  InputFormField,
  SearchSelectFormField,
  SelectFormField,
} from "@components/form";
import { axiosInstance } from "@modules/quiz-lobby/fetch";
import { Label } from "@components/ui/label";
import { Button } from "@components/ui/button";

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

export function ProfessorCreateSheet({
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
