"use client";

import { InputFormField, SearchSelectFormField } from "@components/form";
import { Button } from "@components/ui/button";
import { Form, FormField } from "@components/ui/form";
import { Label } from "@components/ui/label";
import { toast } from "@components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  permissionsResponseSchema,
  permissionSchema,
  roleSchema,
  updateRoleSchema,
} from "@modules/setting/models";
import { systemAxiosInstance } from "@modules/shared";
import { Trash, Undo } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

async function onEditHandler(
  id: number,
  data: z.infer<typeof updateRoleSchema>,
) {
  const body = {
    name: data.name,
    description: data.description,
    ...(data.add_permissions.length > 0
      ? { add_permission_ids: data.add_permissions.map((p) => p.id) }
      : {}),
    ...(data.remove_permission_ids.length > 0
      ? { remove_permission_ids: data.remove_permission_ids }
      : {}),
  };

  return await systemAxiosInstance
    .patch(`/setting/roles/${id}`, body)
    .then((res) => res.data as { code: number; message: string });
}

interface UpdateRoleFormProps {
  data: z.infer<typeof roleSchema>;
}

export function UpdateRoleForm({ data }: UpdateRoleFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof updateRoleSchema>>({
    resolver: zodResolver(updateRoleSchema),
    defaultValues: {
      ...data,
      add_permissions: [],
      remove_permission_ids: [],
    },
  });

  const permissionFieldArray = useFieldArray({
    control: form.control,
    name: "permissions",
    keyName: "key",
  });

  const addPermissionFieldArray = useFieldArray({
    control: form.control,
    name: "add_permissions",
    keyName: "key",
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
                    title: "Role updated successfully",
                    description: "Role has been updated successfully",
                  });
                }

                form.reset();
                router.push("/setting/roles");
              })
              .catch(() => {
                toast({
                  title: "Failed to update role",
                  description: "Please check the form and try again.",
                  variant: "destructive",
                });
              });
          },
          () => {
            toast({
              title: "Failed to update role",
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
          <Label>Description</Label>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <InputFormField
                field={field}
                errorField={form.formState.errors.description}
                placeholder="Description"
              />
            )}
          />
        </div>

        <Label>Permissions</Label>
        <div className="relative h-full space-y-2">
          <div className="absolute inset-0 flex flex-col gap-2 overflow-y-auto p-1">
            {permissionFieldArray.fields.map((permission, _) => {
              return (
                <div className="flex items-center gap-4" key={permission.id}>
                  <span className="flex aspect-square h-full items-center justify-center rounded-lg border-2 text-lg font-bold">
                    {permission.id}
                  </span>
                  <span className="flex h-full w-full items-center rounded bg-gray-600 px-2 font-bold text-secondary">
                    {permission.name}
                  </span>
                  {form
                    .getValues()
                    .remove_permission_ids.some(
                      (rp) => rp === permission.id,
                    ) ? (
                    <Button
                      type="button"
                      className="ml-auto"
                      variant="secondary"
                      onClick={() => {
                        const permission_ids =
                          form.getValues().remove_permission_ids;

                        form.setValue(
                          "remove_permission_ids",
                          permission_ids.filter((rp) => rp !== permission.id),
                          {
                            shouldValidate: true,
                          },
                        );
                      }}
                    >
                      <Undo />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      className="ml-auto"
                      variant="destructive"
                      onClick={() => {
                        const permission_ids =
                          form.getValues().remove_permission_ids;

                        permission_ids.push(permission.id);

                        form.setValue("remove_permission_ids", permission_ids, {
                          shouldValidate: true,
                        });
                      }}
                    >
                      <Trash />
                    </Button>
                  )}
                </div>
              );
            })}
            {addPermissionFieldArray.fields.map((permission, i) => {
              return (
                <FormField
                  key={permission.key}
                  control={form.control}
                  name={`add_permissions.${i}`}
                  render={({ field }) => (
                    <SearchSelectFormField<z.infer<typeof permissionSchema>>
                      ids={["permissions"]}
                      field={field}
                      errorField={form.formState.errors.add_permissions?.[i]}
                      placeholder="Select Permission"
                      fetchResource={async (searchPhase) => {
                        return systemAxiosInstance
                          .get(`/setting/permissions`, {
                            params: { ["name:ilike"]: searchPhase },
                          })
                          .then((res) => {
                            const result = permissionsResponseSchema.safeParse(
                              res.data,
                            );

                            if (!result.success) {
                              console.error(result.error.errors);
                              return [];
                            }

                            return result.data.data.permissions;
                          });
                      }}
                      onSelected={field.onChange}
                      getLabel={(permission) =>
                        !permission.id
                          ? ""
                          : `${permission.id} - ${permission.name}`
                      }
                      isSelectedData={(permission) =>
                        permission.id === field.value.id
                      }
                    />
                  )}
                />
              );
            })}
          </div>
        </div>
        <div className="my-2 flex justify-end gap-4">
          {addPermissionFieldArray.fields.length > 0 ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                addPermissionFieldArray.remove(
                  addPermissionFieldArray.fields.length - 1,
                );
              }}
            >
              Remove Last Permission
            </Button>
          ) : null}

          <Button
            type="button"
            onClick={() => {
              addPermissionFieldArray.append({ id: 0, name: "" });
            }}
          >
            Add Permission
          </Button>
        </div>

        <div className="mt-auto flex gap-2">
          <Link href="/setting/roles" className="ml-auto">
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
