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
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@components/ui/dropdown-menu";
import { toast } from "@components/ui/use-toast";
import { Customer } from "@modules/setting/models";
import { systemAxiosInstance } from "@modules/shared";
import { ColumnDef } from "@tanstack/react-table";
import { Bot, Copy, MoreHorizontal, UserIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export const customerColumns: ColumnDef<Customer>[] = [
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
    accessorKey: "full_name",
    header: "Full name",
  },
  {
    header: "Gender",
    cell: ({ row }) => {
      const user = row.original;
      const gender =
        user.gender === "m"
          ? "Male"
          : user.gender === "f"
            ? "Female"
            : "Unknown";

      return (
        <span className="flex items-center justify-between">{gender}</span>
      );
    },
  },
  {
    header: "Email",
    cell: ({ row }) => {
      const user = row.original;
      const email =
        user.email.length > 20 ? user.email.slice(0, 20) + "..." : user.email;

      return (
        <span className="flex items-center justify-between">
          {email}
          <Copy
            onClick={() => {
              navigator.clipboard.writeText(user.email).then(() => {
                toast({
                  title: "Copied",
                  description: "Email copied to clipboard",
                });
              });
            }}
            className="cursor-pointer rounded p-1 outline outline-2 outline-gray-400 hover:outline-gray-600"
          />
        </span>
      );
    },
  },
  {
    header: "Phone",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <span className="flex items-center justify-between">
          {user.phone}
          <Copy
            onClick={() => {
              navigator.clipboard.writeText(user.phone).then(() => {
                toast({
                  title: "Copied",
                  description: "Phone copied to clipboard",
                });
              });
            }}
            className="cursor-pointer rounded p-1 outline outline-2 outline-gray-400 hover:outline-gray-600"
          />
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
