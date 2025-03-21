"use client";

import { DateFormField, InputFormField } from "@components/form";
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
  redeemCodeSchema,
  updateRedeemCodeSchema,
} from "@modules/quiz-lobby/models";
import { ColumnDef } from "@tanstack/react-table";
import { compareAsc, format } from "date-fns";
import { Copy, MoreHorizontal } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const redeemCodeColumns: ColumnDef<z.infer<typeof redeemCodeSchema>>[] =
  [
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
      header: "Code",
      cell: ({ row }) => {
        const redeemCode = row.original;
        return (
          <p className="flex justify-between gap-2">
            <span className="select-none rounded-lg bg-blue-500 px-4 text-gray-100">
              {redeemCode.code}
            </span>
            <Copy
              size={20}
              className="cursor-pointer rounded-lg p-1 outline outline-2 outline-gray-400 hover:text-blue-800 hover:outline-blue-500"
              onClick={() => {
                navigator.clipboard.writeText(redeemCode.code);
                toast({ description: "Copied to clipboard" });
              }}
            />
          </p>
        );
      },
    },
    {
      header: "Days",
      cell: ({ row }) => {
        const redeemCode = row.original;
        return <p className="text-center">{redeemCode.days}</p>;
      },
    },
    {
      header: "Used / Total",
      cell: ({ row }) => {
        const redeemCode = row.original;
        return (
          <p>
            {redeemCode.amount - redeemCode.amount_left} / {redeemCode.amount}
          </p>
        );
      },
    },
    {
      header: "Start Date",
      cell: ({ row }) => {
        const redeemCode = row.original;
        const startFrom = new Date(redeemCode.start_from);
        const now = new Date();

        return (
          <p
            className="data-[isnotstart='true']:text-yellow-500"
            data-isnotstart={compareAsc(now, startFrom) === -1}
          >
            {format(startFrom, "yyyy-MM-dd")}
          </p>
        );
      },
    },
    {
      header: "Expiry Date",
      cell: ({ row }) => {
        const redeemCode = row.original;
        const expiredDate = new Date(redeemCode.expired_at);
        const now = new Date();

        return (
          <p
            className="data-[isexpired='true']:text-red-500"
            data-isexpired={compareAsc(now, expiredDate) === 1}
          >
            {format(expiredDate, "yyyy-MM-dd")}
          </p>
        );
      },
    },
    {
      header: "Actions",
      cell: ({ row, table }) => {
        const redeemCode = row.original;
        // NOTE: This is a hack to get the refetch function from the table options. Seems like the table meta is not being passed to the header component.
        const meta = table.options.meta as { refetch: () => void } | undefined;

        return <ActionSchool redeemCode={redeemCode} meta={meta} />;
      },
    },
  ];

function ActionSchool({
  redeemCode,
  meta,
}: {
  redeemCode: z.infer<typeof redeemCodeSchema>;
  meta: { refetch: () => void } | undefined;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(updateRedeemCodeSchema),
    defaultValues: {
      ...redeemCode,
      start_from: new Date(redeemCode.start_from),
      expired_at: new Date(redeemCode.expired_at),
    },
  });

  React.useEffect(() => {
    form.reset({
      ...redeemCode,
      start_from: new Date(redeemCode.start_from),
      expired_at: new Date(redeemCode.expired_at),
    });
  }, [form, redeemCode]);

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
              redeem code records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                axiosInstance
                  .delete(`/admin/redeem-codes`, {
                    data: { ids: [redeemCode.id] },
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
        <SheetContent className="lg:max-w-4xl">
          <form
            onSubmit={form.handleSubmit((d) => {
              axiosInstance
                .put("/admin/redeem-codes", [
                  {
                    id: redeemCode.id,
                    code: d.code,
                    days: d.days,
                    amount: d.amount,
                    start_from: d.start_from,
                    expired_at: d.expired_at,
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
              <SheetTitle>Update redeem code</SheetTitle>
              <SheetDescription>
                Make changes to redeem code here. Click update when you&apos;re
                done.
              </SheetDescription>
            </SheetHeader>
            <div className="my-2">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label>Code</Label>
                  <FormField
                    control={form.control}
                    name={`code`}
                    render={({ field }) => (
                      <InputFormField
                        field={field}
                        errorField={form.formState.errors.code}
                        placeholder="Code"
                      />
                    )}
                  />
                </div>

                <div className="flex-1">
                  <Label>Days</Label>
                  <FormField
                    control={form.control}
                    name={`days`}
                    render={({ field }) => (
                      <InputFormField
                        className="flex-1"
                        field={field}
                        errorField={form.formState.errors.days}
                        placeholder="Number of days"
                      />
                    )}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="min-w-44">
                  <Label>Start From</Label>
                  <FormField
                    control={form.control}
                    name={`start_from`}
                    render={({ field }) => (
                      <DateFormField
                        className="flex-1"
                        field={field}
                        errorField={form.formState.errors.start_from}
                        placeholder="Start From"
                      />
                    )}
                  />
                </div>

                <div className="min-w-44">
                  <Label>Expired At</Label>
                  <FormField
                    control={form.control}
                    name={`expired_at`}
                    render={({ field }) => (
                      <DateFormField
                        className="flex-1"
                        field={field}
                        errorField={form.formState.errors.expired_at}
                        placeholder="Expired At"
                      />
                    )}
                  />
                </div>

                <div className="flex-1">
                  <Label>Amount</Label>
                  <FormField
                    control={form.control}
                    name={`amount`}
                    render={({ field }) => (
                      <InputFormField
                        className="flex-1"
                        field={field}
                        errorField={form.formState.errors.amount}
                        placeholder="Amount"
                      />
                    )}
                  />
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
