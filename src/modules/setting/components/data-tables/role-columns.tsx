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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { toast } from "@components/ui/use-toast";
import { Role } from "@modules/setting/models";
import { systemAxiosInstance } from "@modules/shared";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import React from "react";

export const roleColumns: ColumnDef<Role>[] = [
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
    accessorKey: "description",
    header: "Description",
  },
  {
    header: "Permissions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          {row.original.permissions.slice(0, 3).map((p) => (
            <span
              key={p.id}
              className="rounded border-[2px] border-gray-700 p-1 px-2"
            >
              {p.name}
            </span>
          ))}
          {row.original.permissions.length > 3 ? (
            <span className="rounded border-[2px] border-gray-700 p-1">
              ...
            </span>
          ) : null}
        </div>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row, table }) => {
      if (row.original.id === 1) {
        return <></>;
      }

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
                <Link href={`/setting/roles/edit/${row.original.id}`}>
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
                    .delete(`/setting/roles`, {
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
