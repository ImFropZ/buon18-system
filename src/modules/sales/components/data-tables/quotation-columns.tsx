"use client";

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
import { Quotation } from "@modules/sales/models/quotation";
import { systemAxiosInstance } from "@modules/shared";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import React from "react";

export const quotationColumns: ColumnDef<Quotation>[] = [
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
    header: "Customer",
    cell: ({ row }) => {
      const quotation = row.original;
      return (
        <Link
          href={`/setting/customers?full-name:ilike=${quotation.customer.full_name}`}
        >
          {quotation.customer.full_name}
        </Link>
      );
    },
  },
  {
    header: "Creation Date",
    accessorKey: "creation_date",
    cell: ({ row }) => {
      const quotation = row.original;
      return (
        <span>{format(new Date(quotation.creation_date), "yyyy-MM-dd")}</span>
      );
    },
  },
  {
    header: "Validity Date",
    cell: ({ row }) => {
      const quotation = row.original;
      return (
        <span>{format(new Date(quotation.validity_date), "yyyy-MM-dd")}</span>
      );
    },
  },
  {
    header: "Discount",
    accessorKey: "discount",
  },
  {
    header: "Amount Delivery",
    accessorKey: "amount_delivery",
  },
  {
    header: "Total Amount",
    accessorKey: "total_amount",
  },
  {
    header: "Status",
    cell: ({ row }) => {
      const quotation = row.original;
      return (
        <span
          className="block w-full rounded-lg px-2 py-1 text-center text-secondary data-[state='cancelled']:bg-red-500 data-[state='quotation']:bg-slate-600 data-[state='quotation\_sent']:bg-yellow-600 data-[state='sales\_order']:bg-green-600"
          data-state={quotation.status}
        >
          {quotation.status.split("_").join(" ")}
        </span>
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
                <Link href={`/setting/customers/edit/${row.original.id}`}>
                  Edit
                </Link>
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
                    .delete(`/setting/customers`, {
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
