"use client";

import { InputFormField } from "@components/form";
import { Button } from "@components/ui/button";
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
  createSchoolSchema,
  createSchoolsSchema,
} from "@modules/quiz-lobby/models";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

async function onCreateHandler(data: {
  schools: z.infer<typeof createSchoolSchema>[];
}) {
  return axiosInstance.post(`/admin/schools`, data.schools).then((res) => {
    return res.data as { code: number; message: string };
  });
}

export function SchoolCreateSheet({
  children,
  refetch,
}: {
  children: React.ReactNode;
  refetch: () => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const form = useForm<{ schools: z.infer<typeof createSchoolSchema>[] }>({
    resolver: zodResolver(createSchoolsSchema),
    defaultValues: { schools: [{ name: "", image_url: "" }] },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "schools",
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
                      title: "Failed to create schools",
                      description: errRes.response.data.message,
                      variant: "destructive",
                    });
                  });
              },
              () => {
                toast({
                  title: "Invalid form data",
                  description: "Problem with schools data",
                  variant: "destructive",
                });
              },
            )}
          >
            <SheetHeader>
              <SheetTitle>Create schools</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
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
                    <div className="flex flex-col gap-2">
                      <Label>Name</Label>
                      <FormField
                        control={form.control}
                        name={`schools.${index}.name`}
                        render={({ field }) => (
                          <InputFormField
                            field={field}
                            errorField={
                              form.formState.errors.schools?.[index]?.name
                            }
                            placeholder="Name"
                          />
                        )}
                      />
                      <Label>Image URL</Label>
                      <div className="flex gap-2">
                        <FormField
                          control={form.control}
                          name={`schools.${index}.image_url`}
                          render={({ field }) => (
                            <InputFormField
                              className="flex-1"
                              field={field}
                              errorField={
                                form.formState.errors?.schools?.[index]
                                  ?.image_url
                              }
                              placeholder="https://placehold.co/200x200"
                            />
                          )}
                        />
                        <div className="grid aspect-square h-52 w-52 place-items-center border p-2">
                          <img
                            src={form.watch(`schools.${index}.image_url`)}
                            alt="Preview"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => fieldArray.append({ name: "", image_url: "" })}
              >
                Add School
              </Button>
              {fieldArray.fields.length > 1 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    fieldArray.remove(fieldArray.fields.length - 1)
                  }
                >
                  Remove Last School
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
