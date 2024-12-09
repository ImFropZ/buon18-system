"use client";

import { InputFormField } from "@components/form";
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
import { Dialog, DialogContent, DialogTrigger } from "@components/ui/dialog";
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
import { schoolSchema, updateSchoolSchema } from "@modules/quiz-lobby/models";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const schoolColumns: ColumnDef<z.infer<typeof schoolSchema>>[] = [
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
    cell: ({ row }) => {
      const school = row.original;
      return (
        <div className="flex items-center justify-between gap-2">
          <p>{school.name}</p>
          {school.image_url ? (
            <ImageDialog src={school.image_url}>
              <Eye className="cursor-pointer rounded-lg px-1 outline outline-2 outline-gray-400" />
            </ImageDialog>
          ) : null}
        </div>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row, table }) => {
      const school = row.original;
      // NOTE: This is a hack to get the refetch function from the table options. Seems like the table meta is not being passed to the header component.
      const meta = table.options.meta as { refetch: () => void } | undefined;

      return <ActionSchool school={school} meta={meta} />;
    },
  },
];

function ActionSchool({
  school,
  meta,
}: {
  school: z.infer<typeof schoolSchema>;
  meta: { refetch: () => void } | undefined;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(updateSchoolSchema),
    defaultValues: {
      name: school.name,
      image_url: school.image_url,
    },
  });

  React.useEffect(() => {
    form.reset({
      name: school.name,
      image_url: school.image_url,
    });
  }, [form, school]);

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
              school record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                axiosInstance
                  .delete(`/admin/schools`, {
                    data: [{ id: school.id }],
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
                .patch("/admin/schools", [{ ...d, id: school.id }])
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
              <SheetTitle>Update school</SheetTitle>
              <SheetDescription>
                Make changes to school here. Click update when you&apos;re done.
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
            </div>
            <div className="my-2 flex flex-col gap-2">
              <Label>Image URL</Label>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`image_url`}
                  render={({ field }) => (
                    <InputFormField
                      className="flex-1"
                      field={field}
                      errorField={form.formState.errors?.image_url}
                      placeholder="https://placehold.co/200x200"
                    />
                  )}
                />
                <div className="grid aspect-square h-52 w-52 place-items-center border p-2">
                  <img src={form.watch(`image_url`)} alt="Preview" />
                </div>
              </div>
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

function ImageDialog({
  children,
  src,
}: {
  children: React.ReactNode;
  src: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex justify-center">
        <img src={src} alt="quiz image" />
      </DialogContent>
    </Dialog>
  );
}
