"use client";

import { InputFormField } from "@components/form";
import React from "react";
import { z } from "zod";
import { createTransactionsSchema } from "@modules/quiz-lobby/models";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
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
import { axiosInstance } from "@modules/quiz-lobby/fetch";
import { Label } from "@components/ui/label";
import { Button } from "@components/ui/button";
import { scanTransactionFromImage } from "@lib/ocr-transaction-extractor";
import { Upload } from "lucide-react";

async function onCreateHandler(data: z.infer<typeof createTransactionsSchema>) {
  const body = data.transactions.map((t) => {
    return {
      id: t.id,
      amount: t.amount,
    };
  });

  return axiosInstance.post(`/admin/transactions`, body).then((res) => {
    return res.data as { code: number; message: string };
  });
}

export function TransactionCreateSheet({
  children,
  refetch,
}: {
  children: React.ReactNode;
  refetch: () => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const form = useForm<z.infer<typeof createTransactionsSchema>>({
    resolver: zodResolver(createTransactionsSchema),
    defaultValues: {
      transactions: [{ id: "", amount: 0 }],
    },
  });

  const transactionFieldArray = useFieldArray({
    control: form.control,
    name: "transactions",
    keyName: "key",
  });

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Form {...form}>
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
                      title: "Failed to create transactions",
                      description: errRes.response.data.message,
                      variant: "destructive",
                    });
                  });
              },
              () => {
                toast({
                  title: "Invalid form data",
                  description: "Problem with transactions data",
                  variant: "destructive",
                });
              },
            )}
          >
            <SheetHeader>
              <SheetTitle>Create transaction</SheetTitle>
              <SheetDescription>
                Create multiple transactions at once.
              </SheetDescription>
            </SheetHeader>
            <div className="my-2 flex flex-col gap-2 overflow-y-auto p-2 px-4">
              {transactionFieldArray.fields.map((field, index) => {
                return (
                  <div
                    key={field.key}
                    className="rounded border-2 p-2 px-4 pb-4"
                  >
                    <p className="ml-auto w-fit rounded bg-gray-300 px-2 text-sm">
                      {field.key}
                    </p>
                    <Label>Transaction ID</Label>
                    <TransactionIDInputField form={form} index={index} />
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Label>Amount</Label>
                        <FormField
                          control={form.control}
                          name={`transactions.${index}.amount`}
                          render={({ field }) => (
                            <InputFormField
                              field={field}
                              errorField={
                                form.formState.errors.transactions?.[index]
                                  ?.amount
                              }
                              type="number"
                              placeholder="Amount"
                            />
                          )}
                        />
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
                  transactionFieldArray.append({
                    id: "",
                    amount: 0,
                  })
                }
              >
                Add transaction
              </Button>
              {transactionFieldArray.fields.length > 1 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    transactionFieldArray.remove(
                      transactionFieldArray.fields.length - 1,
                    )
                  }
                >
                  Remove last transaction
                </Button>
              )}
            </div>
            <SheetFooter>
              <Button type="submit">Create</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Form>
    </Sheet>
  );
}

function TransactionIDInputField(props: {
  form: UseFormReturn<z.infer<typeof createTransactionsSchema>, any, any>;
  index: number;
}) {
  const [isIDLoading, setIsIDLoading] = React.useState(false);

  return (
    <div className="flex gap-4">
      <FormField
        control={props.form.control}
        name={`transactions.${props.index}.id`}
        render={({ field }) => (
          <InputFormField
            field={field}
            errorField={
              props.form.formState.errors.transactions?.[props.index]?.id
            }
            placeholder="Transaction ID"
            className="flex-1"
            disabled={isIDLoading}
          />
        )}
      />
      <Button
        type="button"
        className="flex gap-2"
        onClick={() => {
          if (!window) return;

          setIsIDLoading(true);

          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";

          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            scanTransactionFromImage(
              file,
              (txID) => {
                props.form.setValue(`transactions.${props.index}.id`, txID);
              },
              () => {},
              () => {
                setIsIDLoading(false);
                toast({
                  title: "Scan completed",
                  description:
                    "Transaction ID has been scanned from the receipt",
                });

                if (input.onchange)
                  input.removeEventListener("change", input.onchange);
              },
            );
          };

          input.oncancel = () => {
            setIsIDLoading(false);

            if (input.onchange)
              input.removeEventListener("change", input.onchange);
          };

          input.click();
        }}
      >
        <span>Upload receipt</span>
        <Upload />
      </Button>
    </div>
  );
}
