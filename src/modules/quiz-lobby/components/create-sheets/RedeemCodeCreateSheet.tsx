"use client";

import { DateFormField, InputFormField } from "@components/form";
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
  CreateRedeemCodeSchema,
  CreateRedeemCodesSchema,
} from "@modules/quiz-lobby/models";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

async function onCreateHandler(data: {
  redeemCodes: z.infer<typeof CreateRedeemCodeSchema>[];
}) {
  return axiosInstance
    .post(`/admin/redeem-codes`, data.redeemCodes)
    .then((res) => {
      return res.data as { code: number; message: string };
    });
}

export function RedeemCodeCreateSheet({
  children,
  refetch,
}: {
  children: React.ReactNode;
  refetch: () => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const form = useForm<{
    redeemCodes: z.infer<typeof CreateRedeemCodeSchema>[];
  }>({
    resolver: zodResolver(CreateRedeemCodesSchema),
    defaultValues: {
      redeemCodes: [
        {
          code: "",
          credit: 0,
          amount: 0,
          expired_at: new Date(),
        },
      ],
    },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "redeemCodes",
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
              <SheetTitle>Create redeem codes</SheetTitle>
              <SheetDescription>
                Create redeem codes here. Click create when you&apos;re done.
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
                      #{index + 1}
                    </p>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Label>Code</Label>
                          <FormField
                            control={form.control}
                            name={`redeemCodes.${index}.code`}
                            render={({ field }) => (
                              <InputFormField
                                field={field}
                                errorField={
                                  form.formState.errors
                                    ? form.formState.errors.redeemCodes?.[index]
                                        ?.code
                                    : undefined
                                }
                                placeholder="Code"
                              />
                            )}
                          />
                        </div>

                        <div className="min-w-44">
                          <Label>Expired At</Label>
                          <FormField
                            control={form.control}
                            name={`redeemCodes.${index}.expired_at`}
                            render={({ field }) => (
                              <DateFormField
                                className="flex-1"
                                field={field}
                                errorField={
                                  form.formState.errors
                                    ? form.formState.errors?.redeemCodes?.[
                                        index
                                      ]?.expired_at
                                    : undefined
                                }
                                placeholder="Expired At"
                              />
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Label>Credit</Label>
                          <FormField
                            control={form.control}
                            name={`redeemCodes.${index}.credit`}
                            render={({ field }) => (
                              <InputFormField
                                className="flex-1"
                                field={field}
                                errorField={
                                  form.formState.errors
                                    ? form.formState.errors?.redeemCodes?.[
                                        index
                                      ]?.credit
                                    : undefined
                                }
                                placeholder="Credit amount"
                              />
                            )}
                          />
                        </div>
                        <div className="flex-1">
                          <Label>Amount</Label>
                          <FormField
                            control={form.control}
                            name={`redeemCodes.${index}.amount`}
                            render={({ field }) => (
                              <InputFormField
                                className="flex-1"
                                field={field}
                                errorField={
                                  form.formState.errors
                                    ? form.formState.errors?.redeemCodes?.[
                                        index
                                      ]?.amount
                                    : undefined
                                }
                                placeholder="Amount"
                              />
                            )}
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
                onClick={() =>
                  fieldArray.append({
                    code: "",
                    credit: 0,
                    amount: 0,
                    expired_at: new Date(),
                  })
                }
              >
                Add redeem code
              </Button>
              {fieldArray.fields.length > 1 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    fieldArray.remove(fieldArray.fields.length - 1)
                  }
                >
                  Remove last redeem code
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
