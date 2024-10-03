"use client";

import { InputFormField, SearchSelectFormField } from "@components/form";
import React from "react";
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
import { axiosInstance } from "@modules/lobby-serksa/fetch";
import { Label } from "@components/ui/label";
import { Button } from "@components/ui/button";

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

export function SubjectCreateSheet({
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
              <SheetTitle>Create subjects</SheetTitle>
              <SheetDescription>
                Create multiple majors at once.
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
                                      ?.year
                                  : undefined
                              }
                              placeholder="Year"
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
                  variant="secondary"
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
