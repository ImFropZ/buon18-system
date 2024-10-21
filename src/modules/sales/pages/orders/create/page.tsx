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
import { CreateOrderSchema, Quotation } from "@modules/sales/models";
import { systemAxiosInstance } from "@modules/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

async function onCreateHandler(data: z.infer<typeof CreateOrderSchema>) {
  const body = {
    name: data.name,
    commitment_date: data.commitment_date,
    note: data.note,
    quotation_id: data.quotation.id,
    payment_term_id: data.payment_term.id,
  };

  return systemAxiosInstance
    .post("/sales/orders", body)
    .then((res) => res.data as { code: number; message: string });
}

export default function Page() {
  const router = useRouter();
  const form = useForm<z.infer<typeof CreateOrderSchema>>({
    resolver: zodResolver(CreateOrderSchema),
    defaultValues: {
      name: "",
      commitment_date: new Date(),
      note: "",
      quotation: {
        id: 0,
        name: "",
      },
      payment_term: {
        id: 0,
        name: "",
      },
    },
  });

  return (
    <main className="relative grid h-full grid-rows-[auto,auto,1fr] gap-2 p-4">
      <h1 className="text-2xl font-bold">Create Order</h1>
      <p className="max-w-[65ch] text-gray-500">
        This is where you can create a new order. Please fill in the form below.
      </p>
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(
            (d) => {
              onCreateHandler(d).then((res) => {
                if (res.code === 201) {
                  toast({
                    title: "Order created",
                    description: "Order has been successfully created.",
                  });
                }

                form.reset();
                router.push("/sales/orders");
              });
            },
            () => {
              toast({
                title: "Failed to create order",
                description: "Please check the form and try again.",
                variant: "destructive",
              });
            },
          )}
        >
          <div className="flex gap-4">
            <div className="flex-1">
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
                name="quotation"
                render={({ field }) => {
                  return (
                    <SearchSelectFormField
                      id="quotation-sales-order"
                      field={field}
                      errorField={form.formState.errors.quotation}
                      placeholder="Select quotation"
                      fetchResource={async (searchPhase) => {
                        return systemAxiosInstance
                          .get(`/sales/quotations`, {
                            params: {
                              ["status:eq"]: "sales_order",
                              ["name:ilike"]: searchPhase,
                            },
                          })
                          .then((res) => {
                            return res.data.data.quotations;
                          });
                      }}
                      optionLabel="name"
                      optionValue="id"
                      onSelected={function (value: Quotation) {
                        field.onChange({ id: value.id, name: value.name });
                      }}
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
