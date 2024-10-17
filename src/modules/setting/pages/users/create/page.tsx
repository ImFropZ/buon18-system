"use client";

import { InputFormField, SearchSelectFormField } from "@components/form";
import { Button } from "@components/ui/button";
import { Form, FormField } from "@components/ui/form";
import { Label } from "@components/ui/label";
import { toast } from "@components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserSchema, Role } from "@modules/setting/models";
import { systemAxiosInstance } from "@modules/shared";
import { User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

async function onCreateHandler(data: z.infer<typeof CreateUserSchema>) {
  const body = {
    name: data.name,
    email: data.email,
    role_id: data.role.id,
  };
  return await systemAxiosInstance
    .post(`/setting/users`, body)
    .then((res) => res.data as { code: number; message: string });
}

export default function Page() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: {
        id: 0,
        name: "",
      },
    },
  });

  return (
    <main className="relative grid h-full grid-rows-[auto,auto,1fr] gap-2 p-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Create User</h1>
        <User className="rounded p-1 outline outline-2 outline-gray-400" />
      </div>
      <p className="max-w-[65ch] text-gray-500">
        This is where you can create a new user. Please fill in the form below.
        After user is created, you can update the user&apos;s password by login
        into the user&apos;s account with any password and update the password.
      </p>
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(
            (d) => {
              onCreateHandler(d).then((res) => {
                if (res.code === 201) {
                  toast({
                    title: "User created",
                    description: "User has been successfully created.",
                  });
                }

                form.reset();
                router.push("/setting/users");
              });
            },
            () => {
              toast({
                title: "Failed to create user",
                description: "Please check the form and try again.",
                variant: "destructive",
              });
            },
          )}
        >
          <div className="flex flex-col gap-2">
            <Label>Name</Label>
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
            <Label>Role</Label>
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => {
                return (
                  <SearchSelectFormField
                    id="role"
                    field={field}
                    errorField={
                      form.formState.errors
                        ? form.formState.errors.role
                        : undefined
                    }
                    placeholder="Select Role"
                    fetchResource={async (searchPhase) => {
                      return systemAxiosInstance
                        .get(`/setting/roles`, {
                          params: { ["name:ilike"]: searchPhase },
                        })
                        .then((res) => {
                          return res.data.data.roles;
                        });
                    }}
                    optionLabel="name"
                    optionValue="id"
                    onSelected={function (value: Role) {
                      field.onChange({ id: value.id, name: value.name });
                    }}
                  />
                );
              }}
            />
          </div>

          <div className="mt-auto flex gap-2">
            <Link href="/setting/roles">
              <Button type="button" variant="outline">
                View roles
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
