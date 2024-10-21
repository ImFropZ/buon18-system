"use client";

import { CustomTooltip } from "@components";
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
import { Checkbox } from "@components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@components/ui/dropdown-menu";
import { toast } from "@components/ui/use-toast";
import { Order } from "@modules/sales/models";
import { systemAxiosInstance } from "@modules/shared";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import React from "react";

export const orderColumns: ColumnDef<Order>[] = [
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
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Commitment date",
    cell: ({ row }) => {
      const order = row.original;
      return format(new Date(order.commitment_date), "yyyy-MM-dd");
    },
  },
  {
    header: "Quotation",
    cell: ({ row }) => {
      const order = row.original;

      return (
        <Link
          href={`/sales/quotations?name:ilike=${order.quotation.name}`}
          className="underline"
        >
          {order.quotation.name}
        </Link>
      );
    },
  },
  {
    header: "Payment term",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <Link href={``} className="underline">
          {order.payment_term.name}
        </Link>
      );
    },
  },
  {
    header: "Note",
    cell: ({ row }) => {
      const order = row.original;

      if (!order.note) {
        return <span className="select-none text-gray-400">None</span>;
      }

      return (
        <CustomTooltip content={order.note}>
          <span className="cursor-help">
            {order.note.length > 30
              ? order.note.slice(0, 30) + "..."
              : order.note}
          </span>
        </CustomTooltip>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row, table }) => {
      // NOTE: This is a hack to get the refetch function from the table options. Seems like the table meta is not being passed to the header component.
      const meta = table.options.meta as { refetch: () => void } | undefined;

      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreHorizontal className="cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href={`/sales/orders/edit/${row.original.id}`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <AlertDialogTrigger asChild>
                  <div className="w-full text-red-400 hover:text-red-500 focus:text-red-500">
                    Delete
                  </div>
                </AlertDialogTrigger>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  const response = await systemAxiosInstance
                    .delete(`/sales/quotations`, {
                      data: { ids: [row.original.id] },
                    })
                    .then((res) => {
                      return res.data as { code: number; message: string };
                    })
                    .catch((err) => {
                      return err.response.data as {
                        code: number;
                        message: string;
                      };
                    });

                  if (response.code === 200) {
                    toast({
                      title: "Success",
                      description: response.message,
                    });

                    meta?.refetch();
                  } else {
                    toast({
                      title: "Error",
                      description: response.message,
                      variant: "destructive",
                    });
                  }
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
