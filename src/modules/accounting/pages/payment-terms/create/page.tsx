"use client";

import { InputFormField, TextareaFormField } from "@components/form";
import { Button } from "@components/ui/button";
import { Form, FormField } from "@components/ui/form";
import { Label } from "@components/ui/label";
import { toast } from "@components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePaymentTermSchema } from "@modules/accounting/models";
import { systemAxiosInstance } from "@modules/shared";
import { useRouter } from "next/navigation";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

async function onCreateHandler(data: z.infer<typeof CreatePaymentTermSchema>) {
  const body = {
    name: data.name,
    description: data.description,
    lines: data.lines,
  };

  return systemAxiosInstance
    .post("/accounting/payment-terms", body)
    .then((res) => res.data as { code: number; message: string });
}

export default function Page() {
  const router = useRouter();
  const form = useForm<z.infer<typeof CreatePaymentTermSchema>>({
    resolver: zodResolver(CreatePaymentTermSchema),
    defaultValues: {
      name: "",
      description: "",
      lines: [
        {
          sequence: 1,
          value_amount_percent: 0,
          number_of_days: 0,
        },
      ],
    },
  });

  const lineFieldArray = useFieldArray({
    control: form.control,
    name: "lines",
  });

  return (
    <main className="relative grid h-full grid-rows-[auto,auto,1fr] gap-2 p-4">
      <h1 className="text-2xl font-bold">Create Payment Term</h1>
      <p className="max-w-[65ch] text-gray-500">
        This is where you can create a new payment term. Please fill in the form
        below.
      </p>
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(
            (d) => {
              onCreateHandler(d).then((res) => {
                if (res.code === 201) {
                  toast({
                    title: "Payment term created",
                    description: "Payment term has been successfully created.",
                  });
                }

                form.reset();
                router.push("/accounting/payment-terms");
              });
            },
            () => {
              toast({
                title: "Failed to create payment term",
                description: "Please check the form and try again.",
                variant: "destructive",
              });
            },
          )}
        >
          <Label>
            Name <span className="text-red-600">*</span>
          </Label>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => {
              return (
                <InputFormField
                  field={field}
                  errorField={form.formState.errors.name}
                  placeholder="Name"
                />
              );
            }}
          />

          <Label>
            Description <span className="text-red-600">*</span>
          </Label>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => {
              return (
                <TextareaFormField
                  field={field}
                  errorField={form.formState.errors.description}
                  placeholder="Description"
                  rows={10}
                />
              );
            }}
          />

          <div className="grid grid-cols-[5rem,1fr,1fr] gap-4">
            <Label>
              Sequence <span className="text-red-600">*</span>
            </Label>
            <Label>
              Value amount (%) <span className="text-red-600">*</span>
            </Label>
            <Label>
              Number of days <span className="text-red-600">*</span>
            </Label>
          </div>

          <div className="relative flex-1">
            <div className="absolute inset-0 flex flex-col gap-2 overflow-y-auto">
              {lineFieldArray.fields.map((line, index) => {
                return (
                  <div
                    key={line.id}
                    className="grid grid-cols-[5rem,1fr,1fr] gap-4 p-1"
                  >
                    <FormField
                      control={form.control}
                      name={`lines.${index}.sequence`}
                      render={({ field }) => {
                        return (
                          <InputFormField
                            field={field}
                            errorField={
                              form.formState.errors.lines?.[index]?.sequence
                            }
                            placeholder="Sequence"
                            type="number"
                          />
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name={`lines.${index}.value_amount_percent`}
                      render={({ field }) => {
                        return (
                          <InputFormField
                            field={field}
                            errorField={
                              form.formState.errors.lines?.[index]
                                ?.value_amount_percent
                            }
                            placeholder="Value amount (%)"
                            type="number"
                          />
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name={`lines.${index}.number_of_days`}
                      render={({ field }) => {
                        return (
                          <InputFormField
                            field={field}
                            errorField={
                              form.formState.errors.lines?.[index]
                                ?.number_of_days
                            }
                            placeholder="Number of days"
                            type="number"
                          />
                        );
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                lineFieldArray.remove(lineFieldArray.fields.length - 1);
              }}
              disabled={lineFieldArray.fields.length === 1}
            >
              Remove last line
            </Button>
            <Button
              type="button"
              onClick={() => {
                lineFieldArray.append({
                  sequence: 1,
                  value_amount_percent: 0,
                  number_of_days: 0,
                });
              }}
            >
              Add line
            </Button>
          </div>

          <div className="mt-auto flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="ml-auto"
              disabled={
                JSON.stringify(form.formState.defaultValues) ===
                JSON.stringify(form.getValues())
              }
              onClick={() => {
                form.reset();
              }}
            >
              Reset
            </Button>
            <Button>Create</Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
