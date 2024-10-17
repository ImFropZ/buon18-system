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
import { User } from "@modules/setting/models";
import { systemAxiosInstance } from "@modules/shared";
import { ColumnDef } from "@tanstack/react-table";
import { Bot, Copy, MoreHorizontal, UserIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export const userColumns: ColumnDef<User>[] = [
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
    header: "Type",
    cell: ({ row }) => {
      const user = row.original;
      const icon = user.type === "bot" ? <Bot /> : <UserIcon />;

      return (
        <div className="flex w-fit gap-2 rounded px-2 py-1 outline outline-2">
          {icon}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
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
    header: "Role",
    cell: ({ row }) => {
      const user = row.original;
      const description =
        user.role.description.length > 20
          ? user.role.description.slice(0, 20) + "..."
          : user.role.description;

      return (
        <div className="flex gap-2">
          <span>{user.role.name}</span>
          <span className="text-gray-500">{description}</span>
        </div>
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
                <Link href={`/setting/users/edit/${row.original.id}`}>
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
                    .delete(`/setting/users`, {
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
