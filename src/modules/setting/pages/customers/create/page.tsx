"use client";

import { InputFormField, SelectFormField } from "@components/form";
import { Button } from "@components/ui/button";
import { Form, FormField } from "@components/ui/form";
import { Label } from "@components/ui/label";
import { toast } from "@components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCustomerSchema } from "@modules/setting/models";
import { systemAxiosInstance } from "@modules/shared";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";

async function onCreateHandler(data: z.infer<typeof CreateCustomerSchema>) {
  const body = {
    full_name: data.full_name,
    gender: data.gender,
    email: data.email,
    phone: data.phone,
    additional_information: JSON.stringify(data.additional_info),
  };
  return systemAxiosInstance
    .post(`/setting/customers`, body)
    .then((res) => res.data as { code: number; message: string });
}

export default function Page() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(CreateCustomerSchema),
    defaultValues: {
      full_name: "",
      gender: "u" as "u" | "m" | "f",
      email: "",
      phone: "",
      additional_info: {},
    },
  });
  return (
    <main className="relative grid h-full grid-rows-[auto,auto,1fr] gap-2 p-4">
      <h1 className="text-2xl font-bold">Create Customer</h1>
      <p className="max-w-[65ch] text-gray-500">
        This is where you can create a new customer. Please fill in the form
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
                    title: "Customer created",
                    description: "Customer has been successfully created.",
                  });
                }

                form.reset();
                router.push("/setting/customers");
              });
            },
            () => {
              toast({
                title: "Failed to create customer",
                description: "Please check the form and try again.",
                variant: "destructive",
              });
            },
          )}
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
