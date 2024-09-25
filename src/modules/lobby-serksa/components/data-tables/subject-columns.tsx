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
import { axiosInstance } from "@modules/lobby-serksa/fetch";
import {
  Major,
  Subject,
  UpdateSubjectSchema,
} from "@modules/lobby-serksa/models";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

export const subjectColumns: ColumnDef<Subject>[] = [
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
    header: "Semester - Year",
    cell: ({ row }) => {
      const subject = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="inline select-none rounded-lg border px-2 py-1">
            {subject.semester}
          </p>
          <p className="select-none">-</p>
          <p className="inline select-none rounded-lg border px-2 py-1">
            {subject.year}
          </p>
        </div>
      );
    },
  },
  {
    header: "Major",
    cell: ({ row }) => {
      const subject = row.original;
      const major = subject.major;

      return (
        <div className="flex items-center gap-2">
          <p className="inline rounded bg-gray-300 px-2 py-1 dark:bg-gray-700">
            {major.id}
          </p>
          <p>{major.name}</p>
        </div>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row, table }) => {
      const subject = row.original;
      const meta = table.options.meta as { refetch: () => void } | undefined;
      return <ActionSubject subject={subject} meta={meta} />;
    },
  },
];

function ActionSubject({
  subject,
  meta,
}: {
  subject: Subject;
  meta?: { refetch: () => void };
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(UpdateSubjectSchema),
    defaultValues: {
      ...subject,
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
              subject records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                axiosInstance
                  .delete(`/admin/subjects`, {
                    data: [{ id: subject.id }],
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
                .patch("/admin/subjects", [
                  {
                    name: d.name,
                    semester: d.semester,
                    year: d.year,
                    major_id: d.major.id,
                    id: subject.id,
                  },
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
              <SheetTitle>Update subject</SheetTitle>
              <SheetDescription>
                Make changes to subject here. Click update when you&apos;re
                done.
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
                    errorField={
                      form.formState.errors
                        ? form.formState.errors?.name
                        : undefined
                    }
                    placeholder="Name"
                  />
                )}
              />
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label>Semester</Label>
                  <FormField
                    control={form.control}
                    name={`semester`}
                    render={({ field }) => (
                      <InputFormField
                        field={field}
                        errorField={
                          form.formState.errors
                            ? form.formState.errors.semester
                            : undefined
                        }
                        placeholder="Semester"
                      />
                    )}
                  />
                </div>
                <div className="flex-1">
                  <Label>Year</Label>
                  <FormField
                    control={form.control}
                    name={`year`}
                    render={({ field }) => (
                      <InputFormField
                        field={field}
                        errorField={
                          form.formState.errors
                            ? form.formState.errors.year
                            : undefined
                        }
                        placeholder="Year"
                      />
                    )}
                  />
                </div>
              </div>
              <Label>Major</Label>
              <FormField
                control={form.control}
                name={`major`}
                render={({ field }) => (
                  <SearchSelectFormField
                    id="major"
                    field={field}
                    errorField={
                      form.formState.errors
                        ? form.formState.errors.major
                        : undefined
                    }
                    placeholder="Select Major"
                    fetchResource={async (searchPhase) => {
                      return axiosInstance
                        .get(`/admin/majors`, {
                          params: { ["name:ilike"]: searchPhase },
                        })
                        .then((res) => {
                          return res.data.data.majors;
                        });
                    }}
                    optionLabel="name"
                    optionValue="id"
                    onSelected={function (value: Major) {
                      field.onChange({ id: value.id, name: value.name });
                    }}
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
