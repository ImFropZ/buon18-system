"use client";

import {
  DateFormField,
  InputFormField,
  SearchSelectFormField,
  TextareaFormField,
} from "@components/form";
import { Button } from "@components/ui/button";
import { Form, FormField } from "@components/ui/form";
import { Label } from "@components/ui/label";
import { toast } from "@components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentTerm } from "@modules/accounting/models";
import { Order, UpdateOrderSchema } from "@modules/sales/models";
import { systemAxiosInstance } from "@modules/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

async function onEditHandler(
  id: number,
  data: z.infer<typeof UpdateOrderSchema>,
) {
  const body = {
    name: data.name,
    commitment_date: data.commitment_date,
    note: data.note,
    payment_term_id: data.payment_term.id,
  };

  return await systemAxiosInstance
    .patch(`/sales/orders/${id}`, body)
    .then((res) => res.data as { code: number; message: string });
}

interface UpdateOrderFormProps {
  data: Order;
}

export function UpdateOrderForm({ data }: UpdateOrderFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof UpdateOrderSchema>>({
    resolver: zodResolver(UpdateOrderSchema),
    defaultValues: {
      name: data.name,
      commitment_date: new Date(data.commitment_date),
      note: data.note,
      quotation: {
        id: data.quotation.id,
        name: data.quotation.name,
      },
      payment_term: {
        id: data.payment_term.id,
        name: data.payment_term.name,
      },
    },
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
                    title: "Customer updated successfully",
                    description: "Customer has been updated successfully",
                  });
                }

                form.reset();
                router.push("/sales/orders");
              })
              .catch((e) => {
                toast({
                  title: "Failed to update customer",
                  description: e.response.data.message,
                  variant: "destructive",
                });
              });
          },
          () => {
            toast({
              title: "Failed to update customer",
              description: "Please check the form and try again.",
              variant: "destructive",
            });
          },
        )}
        className="flex flex-col gap-4"
      >
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-2">
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
          </div>
          <div className="min-w-44">
            <Label>
              Commitment date <span className="text-red-600">*</span>
            </Label>
            <FormField
              control={form.control}
              name="commitment_date"
              render={({ field }) => {
                return (
                  <DateFormField
                    field={field}
                    errorField={form.formState.errors.commitment_date}
                    placeholder="Select the commitment date"
                  />
                );
              }}
            />
          </div>
        </div>

        <div className="flex w-full gap-4">
          <div className="flex-1">
            <Label>
              Quotation <span className="text-red-600">*</span>
            </Label>
            <FormField
              control={form.control}
              name="quotation.name"
              render={({ field }) => {
                return (
                  <InputFormField
                    field={field}
                    errorField={form.formState.errors.quotation}
                    placeholder="Quotation"
                    disabled={true}
                  />
                );
              }}
            />
          </div>
          <div className="flex-1">
            <Label>
              Payment term <span className="text-red-600">*</span>
            </Label>
            <FormField
              control={form.control}
              name="payment_term"
              render={({ field }) => {
                return (
                  <SearchSelectFormField
                    id="payment-term"
                    field={field}
                    errorField={form.formState.errors.quotation}
                    placeholder="Select payment term"
                    fetchResource={async (searchPhase) => {
                      return systemAxiosInstance
                        .get(`/accounting/payment-terms`, {
                          params: {
                            ["name:ilike"]: searchPhase,
                          },
                        })
                        .then((res) => {
                          return res.data.data.payment_terms;
                        });
                    }}
                    optionLabel="name"
                    optionValue="id"
                    onSelected={function (value: PaymentTerm) {
                      field.onChange({ id: value.id, name: value.name });
                    }}
                  />
                );
              }}
            />
          </div>
        </div>

        <Label>Note</Label>
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => {
            return (
              <TextareaFormField
                field={field}
                errorField={form.formState.errors.note}
                placeholder="Note"
                rows={10}
              />
            );
          }}
        />

        <div className="mt-auto flex gap-2">
          <Link href="/sales/quotations">
            <Button type="button" variant="outline">
              View quotations
            </Button>
          </Link>
          <Link href="/accounting/payment-terms">
            <Button type="button" variant="outline">
              View payment terms
            </Button>
          </Link>

          <Link href="/sales/orders" className="ml-auto">
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
