"use client";

import { InputFormField, SearchSelectFormField } from "@components/form";
import { Button } from "@components/ui/button";
import { Form, FormField } from "@components/ui/form";
import { Label } from "@components/ui/label";
import { toast } from "@components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateRoleSchema, Permission } from "@modules/setting/models";
import { systemAxiosInstance } from "@modules/shared";
import { useRouter } from "next/navigation";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

async function onCreateHandler(data: z.infer<typeof CreateRoleSchema>) {
  const body = {
    name: data.name,
    description: data.description,
    permission_ids: data.permissions.map((permission) => permission.id),
  };

  return await systemAxiosInstance
    .post("/setting/roles", body)
    .then((res) => res.data as { code: number; message: string });
}

export default function Page() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(CreateRoleSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [
        {
          id: 0,
          name: "",
        },
      ],
    },
  });

  const permissionFieldArray = useFieldArray({
    control: form.control,
    name: "permissions",
    keyName: "key",
  });

  return (
    <main className="relative grid h-full grid-rows-[auto,auto,1fr] gap-2 p-4">
      <h1 className="text-2xl font-bold">Create role</h1>
      <p className="max-w-[65ch] text-gray-500">
        This is where you can create a new role. Please fill in the form below.
      </p>
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(
            (d) => {
              onCreateHandler(d).then((res) => {
                if (res.code === 201) {
                  toast({
                    title: "Role created",
                    description: "Role has been successfully created.",
                  });
                }

                form.reset();
                router.push("/setting/roles");
              });
            },
            () => {
              toast({
                title: "Failed to create role",
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
            <Label>Description</Label>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => {
                return (
                  <InputFormField
                    field={field}
                    errorField={form.formState.errors.description}
                    placeholder="Description"
                  />
                );
              }}
            />
          </div>

          <Label>Permissions</Label>
          <div className="relative h-full space-y-2">
            <div className="absolute inset-0 flex flex-col gap-2 overflow-y-auto p-1">
              {permissionFieldArray.fields.map((permission, i) => {
                return (
                  <FormField
                    key={permission.key}
                    control={form.control}
                    name={`permissions.${i}`}
                    render={({ field }) => (
                      <SearchSelectFormField
                        id="subject"
                        field={field}
                        errorField={
                          form.formState.errors
                            ? form.formState.errors.permissions?.[i]
                            : undefined
                        }
                        placeholder="Select Permission"
                        fetchResource={async (searchPhase) => {
                          return systemAxiosInstance
                            .get(`/setting/permissions`, {
                              params: { ["name:ilike"]: searchPhase },
                            })
                            .then((res) => {
                              return res.data.data.permissions;
                            });
                        }}
                        optionLabel="name"
                        optionValue="id"
                        onSelected={function (value: Permission) {
                          field.onChange({
                            id: value.id,
                            name: value.name,
                          });
                        }}
                      />
                    )}
                  />
                );
              })}
            </div>
          </div>
          <div className="my-2 flex justify-end gap-4">
            {permissionFieldArray.fields.length > 1 ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  permissionFieldArray.remove(
                    permissionFieldArray.fields.length - 1,
                  );
                }}
              >
                Remove Last Permission
              </Button>
            ) : null}

            <Button
              type="button"
              onClick={() => {
                permissionFieldArray.append({ id: 0, name: "" });
              }}
            >
              Add Permission
            </Button>
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
