"use client";

import { InputFormField, SelectFormField } from "@components/form";
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
  transactionSchema,
  updateTransactionSchema,
} from "@modules/quiz-lobby/models";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const transactionColumns: ColumnDef<
  z.infer<typeof transactionSchema>
>[] = [
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      switch (row.original.status) {
        case "manually_pending":
          return (
            <span className="rounded-lg bg-yellow-600 px-2 py-1 text-secondary">
              Manually pending
            </span>
          );
        case "pending":
          return (
            <span className="rounded-lg bg-yellow-600 px-2 py-1 text-secondary">
              Pending
            </span>
          );
        case "completed":
          return (
            <span className="rounded-lg bg-green-600 px-2 py-1 text-secondary">
              Completed
            </span>
          );
        case "failed":
          return (
            <span className="rounded-lg bg-red-600 px-2 py-1 text-secondary">
              Failed
            </span>
          );
      }
    },
  },
  {
    header: "ID",
    cell: ({ row }) => {
      return <div className="min-w-28 text-primary">{row.original.id}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    header: "Actions",
    cell: ({ row, table }) => {
      const transaction = row.original;
      const meta = table.options.meta as { refetch: () => void } | undefined;
      return <ActionTransaction transaction={transaction} meta={meta} />;
    },
  },
];

function ActionTransaction({
  transaction,
  meta,
}: {
  transaction: z.infer<typeof transactionSchema>;
  meta?: { refetch: () => void };
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<z.infer<typeof updateTransactionSchema>>({
    resolver: zodResolver(updateTransactionSchema),
  });

  React.useEffect(() => {
    form.reset({
      ...transaction,
      status:
        transaction.status === "completed" || transaction.status === "failed"
          ? transaction.status
          : undefined,
    });
  }, [form, transaction]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="cursor-pointer"
              disabled={!transaction.user_uuid}
              onClick={() => {
                navigator.clipboard.writeText(transaction.user_uuid);
                toast({
                  title: "Copied",
                  description: "UUID copied to clipboard",
                });
              }}
            >
              Copy UUID
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              disabled={transaction.status !== "manually_pending"}
              onClick={() => {
                if (
                  !process.env
                    .NEXT_PUBLIC_CLIENT_QUIZ_LOBBY_TOP_UP_VALIDATION_URL
                ) {
                  toast({
                    title: "Error",
                    description: "Validation URL not found",
                    variant: "destructive",
                  });
                  return;
                }

                const url = new URL(
                  process.env.NEXT_PUBLIC_CLIENT_QUIZ_LOBBY_TOP_UP_VALIDATION_URL,
                );
                url.searchParams.set("tx-id", transaction.id);
                url.searchParams.set("amount", transaction.amount.toString());

                navigator.clipboard.writeText(
                  url.toString() + "?token=" + transaction.token,
                );
                toast({
                  title: "Copied",
                  description: "URL copied to clipboard",
                });
              }}
            >
              Get Validation Link
            </DropdownMenuItem>
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
                  .delete(`/admin/transactions`, {
                    data: [{ id: transaction.id }],
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
            className="grid h-full grid-rows-[auto,1fr,auto]"
            onSubmit={form.handleSubmit((d) => {
              axiosInstance
                .patch("/admin/transactions", [
                  {
                    id: transaction.id,
                    amount: d.amount,
                    status: d.status,
                  },
                ])
                .then((res) => {
                  toast({
                    title: "Success",
                    description: res.data.message,
                  });
                  setIsOpen(false);
                  form.reset();
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
              <SheetTitle>Update transaction</SheetTitle>
              <SheetDescription>
                Make changes to transaction here. Click update when you&apos;re
                done.
              </SheetDescription>
            </SheetHeader>
            <div className="relative">
              <div className="absolute inset-0 my-2">
                <Label>Status</Label>
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`status`}
                    render={({ field }) => (
                      <SelectFormField
                        field={field}
                        errorField={form.formState.errors.status}
                        options={[
                          { value: "completed", label: "Completed" },
                          { value: "failed", label: "Failed" },
                        ]}
                        defaultSelectedValue={field.value}
                        placeholderSelect="Status"
                        className="flex-1"
                      />
                    )}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      form.setValue(`status`, undefined, {
                        shouldValidate: true,
                      });
                    }}
                  >
                    Clear
                  </Button>
                </div>
                <Label>Transaction ID</Label>
                <FormField
                  control={form.control}
                  name={`id`}
                  render={({ field }) => (
                    <InputFormField
                      field={field}
                      errorField={form.formState.errors.id}
                      placeholder="Transaction ID"
                      readOnly
                      disabled
                    />
                  )}
                />
                <Label>Amount</Label>
                <FormField
                  control={form.control}
                  name={`amount`}
                  render={({ field }) => (
                    <InputFormField
                      field={field}
                      errorField={form.formState.errors.amount}
                      placeholder="Amount"
                      type="number"
                    />
                  )}
                />
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
