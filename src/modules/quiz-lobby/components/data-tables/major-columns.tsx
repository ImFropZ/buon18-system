"use client";

import { InputFormField, SearchSelectFormField } from "@components/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@components/ui/alert-dialog";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Form, FormField } from "@components/ui/form";
import { Label } from "@components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@components/ui/sheet";
import { toast } from "@components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosInstance } from "@modules/quiz-lobby/fetch";
import {
  majorSchema,
  schoolsResponseSchema,
  schoolSchema,
  updateMajorSchema,
} from "@modules/quiz-lobby/models";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const majorColumns: ColumnDef<z.infer<typeof majorSchema>>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    header: "School",
    cell: ({ row }) => {
      const major = row.original;
      const school = major.school;

      return (
        <div className="flex items-center gap-2">
          <p className="inline rounded bg-gray-300 px-2 py-1 dark:bg-gray-700">
            {school.id}
          </p>
          <p>{school.name}</p>
        </div>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row, table }) => {
      const major = row.original;
      // NOTE: This is a hack to get the refetch function from the table options. Seems like the table meta is not being passed to the header component.
      const meta = table.options.meta as { refetch: () => void } | undefined;

      return <ActionMajor major={major} meta={meta} />;
    },
  },
];

function ActionMajor({
  major,
  meta,
}: {
  major: z.infer<typeof majorSchema>;
  meta?: { refetch: () => void };
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(updateMajorSchema),
    defaultValues: {
      ...major,
    },
  });

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <SheetTrigger asChild>
              <DropdownMenuItem className="cursor-pointer">
                Update
              </DropdownMenuItem>
            </SheetTrigger>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="cursor-pointer text-red-400 focus:text-red-500">
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              major record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                axiosInstance
                  .delete(`/admin/majors`, {
                    data: [{ id: major.id }],
                  })
                  .then((res) => {
                    toast({
                      title: "Success",
                      description: res.data.message,
                    });
                    if (meta) meta.refetch();
                  })
                  .catch((errRes) => {
                    toast({
                      title: "Error",
                      description: errRes.response.data.message,
                      variant: "destructive",
                    });
                  });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Form {...form}>
        <SheetContent side={"top"}>
          <form
            onSubmit={form.handleSubmit((d) => {
              axiosInstance
                .patch("/admin/majors", [
                  { name: d.name, school_id: d.school.id, id: major.id },
                ])
                .then((res) => {
                  toast({
                    title: "Success",
                    description: res.data.message,
                  });
                  setIsOpen(false);
                  if (meta) meta.refetch();
                })
                .catch((errRes) => {
                  toast({
                    title: "Error",
                    description: errRes.response.data.message,
                    variant: "destructive",
                  });
                });
            }, console.error)}
          >
            <SheetHeader>
              <SheetTitle>Update major</SheetTitle>
              <SheetDescription>
                Make changes to major here. Click update when you&apos;re done.
              </SheetDescription>
            </SheetHeader>
            <div className="my-2">
              <Label>Name</Label>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <InputFormField
                    field={field}
                    errorField={form.formState.errors?.name}
                    placeholder="Name"
                  />
                )}
              />

              <Label>School</Label>
              <FormField
                control={form.control}
                name={`school`}
                render={({ field }) => (
                  <SearchSelectFormField<z.infer<typeof schoolSchema>>
                    ids={["schools"]}
                    field={field}
                    errorField={form.formState.errors.school}
                    placeholder="Select School"
                    fetchResource={async (searchPhase) => {
                      return axiosInstance
                        .get(`/admin/schools`, {
                          params: { ["name:ilike"]: searchPhase },
                        })
                        .then((res) => {
                          const result = schoolsResponseSchema.safeParse(
                            res.data,
                          );
                          if (!result.success) {
                            console.error(result.error.errors);
                            return [];
                          }
                          return result.data.data.schools;
                        });
                    }}
                    onSelected={field.onChange}
                    getLabel={(school) =>
                      school.id ? "" : `${school.id} - ${school.name}`
                    }
                    isSelectedData={(school) => school.id === field.value.id}
                  />
                )}
              />
            </div>
            <SheetFooter>
              <Button type="submit">Update</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Form>
    </Sheet>
  );
}
