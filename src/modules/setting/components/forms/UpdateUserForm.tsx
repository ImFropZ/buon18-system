"use client";

import { InputFormField, SearchSelectFormField } from "@components/form";
import { Button } from "@components/ui/button";
import { Form, FormField } from "@components/ui/form";
import { Label } from "@components/ui/label";
import { toast } from "@components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role, UpdateUserSchema, User } from "@modules/setting/models";
import { systemAxiosInstance } from "@modules/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

async function onEditHandler(
  id: number,
  data: z.infer<typeof UpdateUserSchema>,
) {
  const body = {
    name: data.name,
    email: data.email,
    ...(data.password === "" ? {} : { password: data.password }),
    role_id: data.role.id,
  };

  return await systemAxiosInstance
    .patch(`/setting/users/${id}`, body)
    .then((res) => res.data as { code: number; message: string });
}

interface UpdateUserFormProps {
  data: User;
}

export function UpdateUserForm({ data }: UpdateUserFormProps) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: { ...data, password: "" },
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
                    title: "User updated successfully",
                    description: "User has been updated successfully",
                  });
                }

                form.reset();
                router.push("/setting/users");
              })
              .catch(() => {
                toast({
                  title: "Failed to update user",
                  description: "Please check the form and try again.",
                  variant: "destructive",
                });
              });
          },
          () => {
            toast({
              title: "Failed to update user",
              description: "Please check the form and try again.",
              variant: "destructive",
            });
          },
        )}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <Label>Name</Label>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <InputFormField
                field={field}
                errorField={form.formState.errors.name}
                placeholder="Name"
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <InputFormField
                field={field}
                errorField={form.formState.errors.email}
                placeholder="Email"
                type="email"
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Password</Label>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <InputFormField
                field={field}
                errorField={form.formState.errors.password}
                placeholder="********"
                type="password"
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Role</Label>
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <SearchSelectFormField
                id="role"
                field={field}
                errorField={
                  form.formState.errors ? form.formState.errors.role : undefined
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
            )}
          />
        </div>

        <div className="mt-auto flex gap-2">
          <Link href="/setting/roles">
            <Button type="button" variant="outline">
              View roles
            </Button>
          </Link>
          <Link href="/setting/users" className="ml-auto">
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
