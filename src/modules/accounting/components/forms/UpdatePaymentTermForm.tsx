"use client";

import { InputFormField, TextareaFormField } from "@components/form";
import { Button } from "@components/ui/button";
import { Form, FormField } from "@components/ui/form";
import { Label } from "@components/ui/label";
import { toast } from "@components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PaymentTerm,
  UpdatePaymentTermSchema,
} from "@modules/accounting/models";
import { systemAxiosInstance } from "@modules/shared";
import { Trash, Undo } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

async function onEditHandler(
  id: number,
  data: z.infer<typeof UpdatePaymentTermSchema>,
) {
  const update_lines = data.update_lines.filter((l) => {
    return !data.remove_line_ids.some((id) => id === l.id);
  });

  const body = {
    name: data.name,
    description: data.description,
    remove_line_ids:
      data.remove_line_ids.length != 0 ? data.remove_line_ids : undefined,
    update_lines: update_lines.length != 0 ? update_lines : undefined,
    add_lines: data.add_lines.length != 0 ? data.add_lines : undefined,
  };

  return await systemAxiosInstance
    .patch(`/accounting/payment-terms/${id}`, body)
    .then((res) => res.data as { code: number; message: string });
}

interface UpdatePaymentTermFormProps {
  data: PaymentTerm;
}

export function UpdatePaymentTermForm({ data }: UpdatePaymentTermFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof UpdatePaymentTermSchema>>({
    resolver: zodResolver(UpdatePaymentTermSchema),
    defaultValues: {
      name: data.name,
      description: data.description,
      update_lines: data.lines,
      add_lines: [],
      remove_line_ids: [],
    },
  });

  React.useEffect(() => {
    form.reset({
      name: data.name,
      description: data.description,
      update_lines: data.lines,
      add_lines: [],
      remove_line_ids: [],
    });
  }, [form, data]);

  const updateLineFieldArray = useFieldArray({
    control: form.control,
    name: "update_lines",
    keyName: "key",
  });

  const addLineFieldArray = useFieldArray({
    control: form.control,
    name: "add_lines",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (d) => {
            onEditHandler(data.id, d)
              .then((res) => {
                if (res.code === 200) {
                  toast({
                    title: "Payment term updated successfully",
                    description: "Payment term has been updated successfully",
                  });
                }

                form.reset();
                router.push("/accounting/payment-terms");
              })
              .catch((e) => {
                toast({
                  title: "Failed to update payment term",
                  description: e.response.data.message,
                  variant: "destructive",
                });
              });
          },
          () => {
            toast({
              title: "Failed to update payment term",
              description: "Please check the form and try again.",
              variant: "destructive",
            });
          },
        )}
        className="flex flex-col gap-4"
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

        <div className="grid grid-cols-[5rem,1fr,1fr,5rem] gap-4">
          <Label>
            Sequence <span className="text-red-600">*</span>
          </Label>
          <Label>
            Value amount (%) <span className="text-red-600">*</span>
          </Label>
          <Label>
            Number of days <span className="text-red-600">*</span>
          </Label>
          <Label>Actions</Label>
        </div>

        <div className="relative flex-1">
          <div className="absolute inset-0 flex flex-col gap-2 overflow-y-auto">
            {updateLineFieldArray.fields.map((line, index) => {
              const isDeleted = form
                .getValues()
                .remove_line_ids.some((rid) => rid === line.id);

              return (
                <div
                  key={line.key}
                  className="grid grid-cols-[5rem,1fr,1fr,5rem] gap-4 p-1"
                >
                  <FormField
                    control={form.control}
                    name={`update_lines.${index}.sequence`}
                    render={({ field }) => {
                      return (
                        <InputFormField
                          field={field}
                          errorField={
                            form.formState.errors.update_lines?.[index]
                              ?.sequence
                          }
                          placeholder="Sequence"
                          type="number"
                        />
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name={`update_lines.${index}.value_amount_percent`}
                    render={({ field }) => {
                      return (
                        <InputFormField
                          field={field}
                          errorField={
                            form.formState.errors.update_lines?.[index]
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
                    name={`update_lines.${index}.number_of_days`}
                    render={({ field }) => {
                      return (
                        <InputFormField
                          field={field}
                          errorField={
                            form.formState.errors.update_lines?.[index]
                              ?.number_of_days
                          }
                          placeholder="Number of days"
                          type="number"
                        />
                      );
                    }}
                  />
                  <Button
                    type="button"
                    variant={isDeleted ? "outline" : "destructive"}
                    onClick={() => {
                      if (isDeleted) {
                        form.setValue(
                          "remove_line_ids",
                          [
                            ...form
                              .getValues()
                              .remove_line_ids.filter((rid) => rid !== line.id),
                          ],
                          {
                            shouldValidate: true,
                          },
                        );
                      } else {
                        form.setValue(
                          "remove_line_ids",
                          [...form.getValues().remove_line_ids, line.id],
                          {
                            shouldValidate: true,
                          },
                        );
                      }
                    }}
                  >
                    {isDeleted ? <Undo /> : <Trash />}
                  </Button>
                </div>
              );
            })}
            {addLineFieldArray.fields.map((line, index) => {
              return (
                <div
                  key={line.id}
                  className="grid grid-cols-[5rem,1fr,1fr,5rem] gap-4 p-1"
                >
                  <FormField
                    control={form.control}
                    name={`add_lines.${index}.sequence`}
                    render={({ field }) => {
                      return (
                        <InputFormField
                          field={field}
                          errorField={
                            form.formState.errors.add_lines?.[index]?.sequence
                          }
                          placeholder="Sequence"
                          type="number"
                        />
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name={`add_lines.${index}.value_amount_percent`}
                    render={({ field }) => {
                      return (
                        <InputFormField
                          field={field}
                          errorField={
                            form.formState.errors.add_lines?.[index]
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
                    name={`add_lines.${index}.number_of_days`}
                    render={({ field }) => {
                      return (
                        <InputFormField
                          field={field}
                          errorField={
                            form.formState.errors.add_lines?.[index]
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
              addLineFieldArray.remove(addLineFieldArray.fields.length - 1);
            }}
            disabled={addLineFieldArray.fields.length === 0}
          >
            Remove last line
          </Button>
          <Button
            type="button"
            onClick={() => {
              addLineFieldArray.append({
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
          <Link href="/accounting/payment-terms" className="ml-auto">
            <Button type="button" variant="outline">
              Discard
            </Button>
          </Link>
          <Button
            disabled={
              JSON.stringify(form.formState.defaultValues) ===
              JSON.stringify(form.getValues())
            }
          >
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
}
