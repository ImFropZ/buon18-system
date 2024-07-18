/* eslint-disable react-hooks/rules-of-hooks */
// NOTE: Disable eslint rules for this file because react-hooks/rules-of-hooks eslint doesn't like the use of hooks inside the cell function

"use client";

import { CustomTooltip } from "@components/CustomTooltip";
import { User } from "@components/modal/User";
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
import { Dialog, DialogTrigger } from "@components/ui/dialog";
import { cn } from "@lib/utils";
import { UserSchema, UserUpdateSchema } from "@models/user";
import { axiosInstance } from "@providers/data-provider";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import React from "react";
import * as z from "zod";

interface UserColumnProps {
  _delete?: (id: string | number) => void;
  onRefresh?: () => void;
}

export function columns({ _delete, onRefresh }: UserColumnProps) {
  return [
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "deleted",
      header: "Status",
      cell: ({ row }) => {
        const { deleted } = row.original;
        return (
          <p
            className={cn(
              "rounded-lg bg-primary text-center font-bold text-secondary",
              deleted ? "bg-red-600 text-primary" : "",
            )}
          >
            {deleted ? "Deactivate" : "Activate"}
          </p>
        );
      },
    },
    {
      accessorKey: "action",
      header: () => {
        return <div className="w-full text-center">Action</div>;
      },
      cell: ({ row }) => {
        const [dialogOpen, setDialogOpen] = React.useState(false);
        const data = row.original;

        const updateUserData = async (
          id: string,
          data: z.infer<typeof UserUpdateSchema>,
        ) => {
          const result = UserUpdateSchema.safeParse(data);
          if (result.success) {
            return await axiosInstance
              .patch(`/users/${id}`, result.data)
              .then((res) => res.data)
              .catch((err) => err.response.data);
          }
        };

        return (
          <div className="flex justify-center gap-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <CustomTooltip content="Edit">
                <DialogTrigger asChild>
                  <button
                    onClick={() => {}}
                    className="group/button h-auto rounded px-2 py-[1px] outline outline-[1px] outline-primary/50 hover:outline-primary"
                  >
                    <Edit
                      size={18}
                      className="text-primary/50 group-hover/button:text-primary"
                    />
                  </button>
                </DialogTrigger>
              </CustomTooltip>
              <User
                onSubmit={(d) => {
                  updateUserData(data.id, d).then(({ code }) => {
                    if (code === 200) {
                      onRefresh ? onRefresh() : null;
                      setDialogOpen(false);
                    }
                  });
                }}
                defaultValue={data}
              />
            </Dialog>
            {_delete ? (
              <AlertDialog>
                <CustomTooltip content="Delete">
                  <AlertDialogTrigger asChild>
                    <button className="group/button h-auto rounded bg-destructive px-2 py-[1px] outline outline-[1px] outline-destructive/50 hover:outline-destructive">
                      <Trash2
                        size={18}
                        className="text-primary/50 group-hover/button:text-primary"
                      />
                    </button>
                  </AlertDialogTrigger>
                </CustomTooltip>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      and remove this data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => _delete(data.id)}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : null}
          </div>
        );
      },
    },
  ] satisfies ColumnDef<z.infer<typeof UserSchema>>[];
}
