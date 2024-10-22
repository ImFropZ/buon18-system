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
import { Quotation, UpdateQuotationSchema } from "@modules/sales/models";
import { Customer } from "@modules/setting/models";
import { systemAxiosInstance } from "@modules/shared";
import { Trash, Undo } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

async function onEditHandler(
  id: number,
  data: z.infer<typeof UpdateQuotationSchema>,
) {
  const update_items = data.update_items.filter((i) => {
    return !data.delete_item_ids.some((id) => id === i.id);
  });

  const body = {
    name: data.name,
    creation_date: data.creation_date,
    validity_date: data.validity_date,
    discount: data.discount,
    amount_delivery: data.amount_delivery,
    status: data.status,
    customer_id: data.customer.id,
    delete_item_ids:
      data.delete_item_ids.length != 0 ? data.delete_item_ids : undefined,
    update_items: update_items.length != 0 ? update_items : undefined,
    add_items: data.add_items.length != 0 ? data.add_items : undefined,
  };

  return await systemAxiosInstance
    .patch(`/sales/quotations/${id}`, body)
    .then((res) => res.data as { code: number; message: string });
}

interface UpdateQuotationFormProps {
  data: Quotation;
}

export function UpdateQuotationForm({ data }: UpdateQuotationFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof UpdateQuotationSchema>>({
    resolver: zodResolver(UpdateQuotationSchema),
    defaultValues: {
      name: data.name,
      creation_date: new Date(data.creation_date),
      validity_date: new Date(data.validity_date),
      discount: data.discount,
      amount_delivery: data.amount_delivery,
      status: data.status,
      customer: data.customer,
      update_items: data.items,
      delete_item_ids: [],
    },
  });

  React.useEffect(() => {
    form.reset({
      name: data.name,
      creation_date: new Date(data.creation_date),
      validity_date: new Date(data.validity_date),
      discount: data.discount,
      amount_delivery: data.amount_delivery,
      status: data.status,
      customer: data.customer,
      update_items: data.items,
      delete_item_ids: [],
    });
  }, [form, data]);

  const updateItemFieldArray = useFieldArray({
    control: form.control,
    name: "update_items",
    keyName: "key",
  });

  const addItemFieldArray = useFieldArray({
    control: form.control,
    name: "add_items",
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(
          (d) => {
            onEditHandler(data.id, d)
              .then((res) => {
                if (res.code === 200) {
                  toast({
                    title: "Quotation updated successfully",
                    description: "Quotation has been updated successfully",
                  });
                }

                form.reset();
                router.push("/sales/quotations");
              })
              .catch((e) => {
                toast({
                  title: "Failed to update quotation",
                  description: e.response.data.message,
                  variant: "destructive",
                });
              });
          },
          () => {
            toast({
              title: "Failed to update quotation",
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
          <div className="grid grid-cols-[1fr,4fr,.5fr,.5fr,.5fr] gap-4 px-1">
            <Label>
              Name <span className="text-red-600">*</span>
            </Label>
            <Label>
              Description <span className="text-red-600">*</span>
            </Label>
            <Label>Price</Label>
            <Label>Discount</Label>
            <Label>Actions</Label>
          </div>
          <div className="relative h-full">
            <div className="absolute inset-0 flex flex-col gap-2 overflow-y-auto p-1">
              {updateItemFieldArray.fields.map((item, index) => {
                const isDeleted = form
                  .getValues()
                  .delete_item_ids.some((rid) => rid === item.id);

                return (
                  <div
                    className="grid grid-cols-[1fr,4fr,.5fr,.5fr,.5fr] gap-4"
                    key={item.id}
                  >
                    <FormField
                      control={form.control}
                      name={`update_items.${index}.name`}
                      render={({ field }) => {
                        return (
                          <InputFormField
                            field={field}
                            errorField={
                              form.formState.errors.update_items?.[index]?.name
                            }
                            placeholder="Name"
                          />
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name={`update_items.${index}.description`}
                      render={({ field }) => {
                        return (
                          <InputFormField
                            field={field}
                            errorField={
                              form.formState.errors.update_items?.[index]
                                ?.description
                            }
                            placeholder="Description"
                          />
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name={`update_items.${index}.price`}
                      render={({ field }) => {
                        return (
                          <InputFormField
                            field={field}
                            errorField={
                              form.formState.errors.update_items?.[index]?.price
                            }
                            placeholder="Price"
                            type="number"
                          />
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name={`update_items.${index}.discount`}
                      render={({ field }) => {
                        return (
                          <InputFormField
                            field={field}
                            errorField={
                              form.formState.errors.update_items?.[index]
                                ?.discount
                            }
                            placeholder="Discount"
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
                            "delete_item_ids",
                            [
                              ...form
                                .getValues()
                                .delete_item_ids.filter(
                                  (rid) => rid !== item.id,
                                ),
                            ],
                            {
                              shouldValidate: true,
                            },
                          );
                        } else {
                          form.setValue(
                            "delete_item_ids",
                            [...form.getValues().delete_item_ids, item.id],
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
              {addItemFieldArray.fields.map((item, index) => {
                return (
                  <div
                    className="grid grid-cols-[1fr,4fr,.5fr,.5fr,.5fr] gap-4"
                    key={item.id}
                  >
                    <FormField
                      control={form.control}
                      name={`add_items.${index}.name`}
                      render={({ field }) => {
                        return (
                          <InputFormField
                            field={field}
                            errorField={
                              form.formState.errors.add_items?.[index]?.name
                            }
                            placeholder="Name"
                          />
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name={`add_items.${index}.description`}
                      render={({ field }) => {
                        return (
                          <InputFormField
                            field={field}
                            errorField={
                              form.formState.errors.add_items?.[index]
                                ?.description
                            }
                            placeholder="Description"
                          />
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name={`add_items.${index}.price`}
                      render={({ field }) => {
                        return (
                          <InputFormField
                            field={field}
                            errorField={
                              form.formState.errors.add_items?.[index]?.price
                            }
                            placeholder="Price"
                            type="number"
                          />
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name={`add_items.${index}.discount`}
                      render={({ field }) => {
                        return (
                          <InputFormField
                            field={field}
                            errorField={
                              form.formState.errors.add_items?.[index]?.discount
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
            disabled={addItemFieldArray.fields.length === 0}
            onClick={() => {
              addItemFieldArray.remove(addItemFieldArray.fields.length - 1);
            }}
          >
            Remove last item
          </Button>

          <Button
            type="button"
            onClick={() => {
              addItemFieldArray.append({
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
          <Link href="/setting/customer">
            <Button type="button" variant="outline">
              View customers
            </Button>
          </Link>

          <Link href="/sales/quotations" className="ml-auto">
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
