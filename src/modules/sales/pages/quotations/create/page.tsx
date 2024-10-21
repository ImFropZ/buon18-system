"use client";

import {
  DateFormField,
  InputFormField,
  SearchSelectFormField,
  SelectFormField,
} from "@components/form";
import { Button } from "@components/ui/button";
import { Form, FormField } from "@components/ui/form";
import { Label } from "@components/ui/label";
import { toast } from "@components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateQuotationSchema } from "@modules/sales/models";
import { Customer } from "@modules/setting/models";
import { systemAxiosInstance } from "@modules/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

async function onCreateHandler(data: z.infer<typeof CreateQuotationSchema>) {
  const body = {
    name: data.name,
    creation_date: data.creation_date,
    validity_date: data.validity_date,
    discount: data.discount,
    amount_delivery: data.amount_delivery,
    status: data.status,
    items: data.items,
    customer_id: data.customer.id,
  };

  return systemAxiosInstance
    .post("/sales/quotations", body)
    .then((res) => res.data as { code: number; message: string });
}

export default function Page() {
  const router = useRouter();
  const form = useForm<z.infer<typeof CreateQuotationSchema>>({
    resolver: zodResolver(CreateQuotationSchema),
    defaultValues: {
      name: "",
      creation_date: new Date(),
      validity_date: new Date(),
      discount: 0,
      amount_delivery: 0,
      status: "quotation",
      items: [{ name: "", description: "", price: 0, discount: 0 }],
      customer: {
        id: 0,
        full_name: "",
      },
    },
  });

  const itemFieldArray = useFieldArray({
    control: form.control,
    name: "items",
  });

  return (
    <main className="relative grid h-full grid-rows-[auto,auto,1fr] gap-2 p-4">
      <h1 className="text-2xl font-bold">Create Quotation</h1>
      <p className="max-w-[65ch] text-gray-500">
        This is where you can create a new quotation. Please fill in the form
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
                    title: "Quotation created",
                    description: "Quotation has been successfully created.",
                  });
                }

                form.reset();
                router.push("/sales/quotations");
              });
            },
            () => {
              toast({
                title: "Failed to create quotation",
                description: "Please check the form and try again.",
                variant: "destructive",
              });
            },
          )}
        >
          <div className="flex items-center justify-end gap-2">
            <Label className="font-bold">
              Status <span className="text-red-600">*</span>
            </Label>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => {
                return (
                  <SelectFormField
                    field={field}
                    errorField={form.formState.errors.status}
                    options={[
                      { value: "quotation", label: "Quotation" },
                      { value: "quotation_sent", label: "Quotation Sent" },
                      { value: "sales_order", label: "Sales Order" },
                      { value: "cancelled", label: "Cancelled" },
                    ]}
                    defaultSelectedValue={field.value}
                    placeholderSelect="Status"
                    className="w-44"
                  />
                );
              }}
            />
          </div>

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
                Creation date <span className="text-red-600">*</span>
              </Label>
              <FormField
                control={form.control}
                name="creation_date"
                render={({ field }) => {
                  return (
                    <DateFormField
                      field={field}
                      errorField={form.formState.errors.creation_date}
                      placeholder="Select the creation date"
                    />
                  );
                }}
              />
            </div>
            <div className="min-w-44">
              <Label>
                Validity date <span className="text-red-600">*</span>
              </Label>
              <FormField
                control={form.control}
                name="validity_date"
                render={({ field }) => {
                  return (
                    <DateFormField
                      field={field}
                      errorField={form.formState.errors.validity_date}
                      placeholder="Select the validity date"
                    />
                  );
                }}
              />
            </div>
            <div className="min-w-44">
              <Label>
                Customer <span className="text-red-600">*</span>
              </Label>
              <FormField
                control={form.control}
                name="customer"
                render={({ field }) => {
                  return (
                    <SearchSelectFormField
                      id="customer"
                      field={field}
                      errorField={
                        form.formState.errors
                          ? form.formState.errors.customer
                          : undefined
                      }
                      placeholder="Select customer"
                      fetchResource={async (searchPhase) => {
                        return systemAxiosInstance
                          .get(`/setting/customers`, {
                            params: { ["full-name:ilike"]: searchPhase },
                          })
                          .then((res) => {
                            return res.data.data.customers;
                          });
                      }}
                      optionLabel="full_name"
                      optionValue="id"
                      onSelected={function (value: Customer) {
                        field.onChange({
                          id: value.id,
                          full_name: value.full_name,
                        });
                      }}
                    />
                  );
                }}
              />
            </div>
          </div>

          <Label>Items</Label>
          <div className="grid h-full grid-rows-[auto,1fr] gap-4 rounded-lg border p-4 px-2">
            <div className="grid grid-cols-[1fr,4fr,.5fr,.5fr] gap-4 px-1">
              <Label>
                Name <span className="text-red-600">*</span>
              </Label>
              <Label>
                Description <span className="text-red-600">*</span>
              </Label>
              <Label>Price</Label>
              <Label>Discount</Label>
            </div>
            <div className="relative h-full">
              <div className="absolute inset-0 flex flex-col gap-2 overflow-y-auto p-1">
                {itemFieldArray.fields.map((item, index) => {
                  return (
                    <div
                      className="grid grid-cols-[1fr,4fr,.5fr,.5fr] gap-4"
                      key={item.id}
                    >
                      <FormField
                        control={form.control}
                        name={`items.${index}.name`}
                        render={({ field }) => {
                          return (
                            <InputFormField
                              field={field}
                              errorField={
                                form.formState.errors.items?.[index]?.name
                              }
                              placeholder="Name"
                            />
                          );
                        }}
                      />
                      <FormField
                        control={form.control}
                        name={`items.${index}.description`}
                        render={({ field }) => {
                          return (
                            <InputFormField
                              field={field}
                              errorField={
                                form.formState.errors.items?.[index]
                                  ?.description
                              }
                              placeholder="Description"
                            />
                          );
                        }}
                      />
                      <FormField
                        control={form.control}
                        name={`items.${index}.price`}
                        render={({ field }) => {
                          return (
                            <InputFormField
                              field={field}
                              errorField={
                                form.formState.errors.items?.[index]?.price
                              }
                              placeholder="Price"
                              type="number"
                            />
                          );
                        }}
                      />
                      <FormField
                        control={form.control}
                        name={`items.${index}.discount`}
                        render={({ field }) => {
                          return (
                            <InputFormField
                              field={field}
                              errorField={
                                form.formState.errors.items?.[index]?.discount
                              }
                              placeholder="Discount"
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
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              disabled={itemFieldArray.fields.length === 1}
              onClick={() => {
                itemFieldArray.remove(itemFieldArray.fields.length - 1);
              }}
            >
              Remove last item
            </Button>

            <Button
              type="button"
              onClick={() => {
                itemFieldArray.append({
                  name: "",
                  description: "",
                  price: 0,
                  discount: 0,
                });
              }}
            >
              Add item
            </Button>
          </div>

          <div className="flex justify-end gap-4">
            <div className="min-w-44">
              <Label>Discount</Label>
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => {
                  return (
                    <InputFormField
                      field={field}
                      errorField={form.formState.errors.discount}
                      placeholder="Discount"
                      type="number"
                    />
                  );
                }}
              />
            </div>
            <div className="min-w-44">
              <Label>Delivery amount</Label>
              <FormField
                control={form.control}
                name="amount_delivery"
                render={({ field }) => {
                  return (
                    <InputFormField
                      field={field}
                      errorField={form.formState.errors.amount_delivery}
                      placeholder="Delivery amount"
                      type="number"
                    />
                  );
                }}
              />
            </div>
          </div>

          <div className="mt-auto flex gap-2">
            <Link href="/setting/customers">
              <Button type="button" variant="outline">
                View customers
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
