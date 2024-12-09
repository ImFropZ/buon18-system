"use client";

import { InputFormField, SearchSelectFormField } from "@components/form";
import { Button } from "@components/ui/button";
import { Form, FormField } from "@components/ui/form";
import { Label } from "@components/ui/label";
import { toast } from "@components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  rolesResponseSchema,
  roleSchema,
  updateUserSchema,
  userSchema,
} from "@modules/setting/models";
import { systemAxiosInstance } from "@modules/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

async function onEditHandler(
  id: number,
  data: z.infer<typeof updateUserSchema>,
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
  data: z.infer<typeof userSchema>;
}

export function UpdateUserForm({ data }: UpdateUserFormProps) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(updateUserSchema),
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
              <SearchSelectFormField<z.infer<typeof roleSchema>>
                ids={["roles"]}
                field={field}
                errorField={form.formState.errors.role}
                placeholder="Select Role"
                fetchResource={async (searchPhase) => {
                  return systemAxiosInstance
                    .get(`/setting/roles`, {
                      params: { ["name:ilike"]: searchPhase },
                    })
                    .then((res) => {
                      const result = rolesResponseSchema.safeParse(res.data);

                      if (!result.success) {
                        console.error(result.error.errors);
                        return [];
                      }

                      return result.data.data.roles;
                    });
                }}
                onSelected={field.onChange}
                getLabel={(role) =>
                  !role.id ? "" : `${role.id} - ${role.name}`
                }
                isSelectedData={(role) => role.id === field.value.id}
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
