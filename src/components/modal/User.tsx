import { DialogContent, DialogTitle } from "@components/ui/dialog";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormLabel } from "@components/ui/form";
import { InputFormField, SelectFormField } from "@components/form";
import { Button } from "@components/ui/button";
import * as z from "zod";
import { UserUpdateSchema, UserCreateSchema, UserSchema } from "@models/user";
import { cn } from "@lib/utils";

interface QuoteItemProps {
  placeholderValue?: z.infer<typeof UserSchema>;
  defaultValue?: z.infer<typeof UserSchema>;
  isCreate?: boolean;
  onSubmit(_data: any): void;
}

export function User({
  placeholderValue,
  defaultValue,
  onSubmit,
  isCreate = false,
}: QuoteItemProps) {
  const form = useForm<any>({
    resolver: zodResolver(isCreate ? UserCreateSchema : UserUpdateSchema),
    defaultValues: {
      ...(isCreate ? { role: "User" } : {}),
    },
  });

  return (
    <DialogContent>
      <DialogTitle className="text-2xl font-bold">User</DialogTitle>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            form.reset();
            onSubmit(data);
          }, console.error)}
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <FormLabel>Name</FormLabel>
              <FormField
                name="name"
                render={({ field }) => {
                  return (
                    <InputFormField
                      field={field}
                      errorField={form.formState.errors.name}
                      placeholder={placeholderValue?.name || "Name"}
                      defaultValue={defaultValue?.name}
                    />
                  );
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <FormLabel>Role</FormLabel>
              <FormField
                name="role"
                render={({ field }) => {
                  return (
                    <SelectFormField
                      field={field}
                      errorField={form.formState.errors.role}
                      options={[
                        {
                          label: "Admin",
                          value: "Admin",
                        },
                        {
                          label: "Editor",
                          value: "Editor",
                        },
                        {
                          label: "User",
                          value: "User",
                        },
                      ]}
                      defaultSelectedValue={defaultValue?.role || "User"}
                    />
                  );
                }}
              />
            </div>
            <div className="col-span-2 flex flex-col gap-2">
              <FormLabel>Email</FormLabel>
              <FormField
                name="email"
                render={({ field }) => {
                  return (
                    <InputFormField
                      field={field}
                      errorField={form.formState.errors.email}
                      placeholder={placeholderValue?.email || "Email"}
                      defaultValue={defaultValue?.email}
                    />
                  );
                }}
              />
            </div>
            <div className={cn(isCreate ? "col-span-2" : "")}>
              <FormLabel>Password</FormLabel>
              <FormField
                name="password"
                render={({ field }) => {
                  return (
                    <InputFormField
                      type="password"
                      field={field}
                      errorField={form.formState.errors.password}
                      placeholder="*****"
                    />
                  );
                }}
              />
            </div>
            {isCreate ? null : (
              <div>
                <FormLabel>Account Status</FormLabel>
                <FormField
                  name="deleted"
                  render={({ field }) => {
                    return (
                      <SelectFormField
                        field={field}
                        errorField={form.formState.errors.deleted}
                        options={[
                          {
                            label: "Activate",
                            value: "false",
                          },
                          {
                            label: "Deactivate",
                            value: "true",
                          },
                        ]}
                        defaultSelectedValue={
                          defaultValue?.deleted ? "true" : "false"
                        }
                      />
                    );
                  }}
                />
              </div>
            )}
            <Button className="col-span-2">Submit</Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
