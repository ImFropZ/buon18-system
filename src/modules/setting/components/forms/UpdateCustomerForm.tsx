"use client";

import { InputFormField, SelectFormField } from "@components/form";
import { Button } from "@components/ui/button";
import { Form, FormField } from "@components/ui/form";
import { Label } from "@components/ui/label";
import { toast } from "@components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Customer, UpdateCustomerSchema } from "@modules/setting/models";
import { systemAxiosInstance } from "@modules/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

async function onEditHandler(
  id: number,
  data: z.infer<typeof UpdateCustomerSchema>,
) {
  const body = {
    full_name: data.full_name,
    gender: data.gender,
    email: data.email,
    phone: data.phone,
    additional_information: JSON.stringify(data.additional_info),
  };

  return await systemAxiosInstance
    .patch(`/setting/customers/${id}`, body)
    .then((res) => res.data as { code: number; message: string });
}

interface UpdateCustomerFormProps {
  data: Customer;
}

export function UpdateCustomerForm({ data }: UpdateCustomerFormProps) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(UpdateCustomerSchema),
    defaultValues: {
      ...data,
      gender: data.gender as "m" | "f" | "u",
      additional_info: data.additional_info ?? {},
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
                router.push("/setting/customers");
              })
              .catch(() => {
                toast({
                  title: "Failed to update customer",
                  description: "Please check the form and try again.",
                  variant: "destructive",
                });
              });
          },
          (e) => {
            console.log(e);
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
            <Label>Full name</Label>
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => {
                return (
                  <InputFormField
                    field={field}
                    errorField={form.formState.errors.full_name}
                    placeholder="Full name"
                  />
                );
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Gender</Label>
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => {
                return (
                  <SelectFormField
                    field={field}
                    errorField={form.formState.errors.gender}
                    options={[
                      { value: "m", label: "Male" },
                      { value: "f", label: "Female" },
                      { value: "u", label: "Unkown" },
                    ]}
                    defaultSelectedValue={field.value}
                    placeholderSelect="Gender"
                    className="min-w-32"
                  />
                );
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              return (
                <InputFormField
                  field={field}
                  errorField={form.formState.errors.email}
                  placeholder="Email"
                  type="email"
                />
              );
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Phone</Label>
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => {
              return (
                <InputFormField
                  field={field}
                  errorField={form.formState.errors.phone}
                  placeholder="Phone"
                  type="tel"
                />
              );
            }}
          />
        </div>

        <div className="mt-auto flex gap-2">
          <Link href="/setting/customers" className="ml-auto">
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
