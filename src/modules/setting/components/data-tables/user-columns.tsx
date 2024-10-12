"use client";

import { toast } from "@components/ui/use-toast";
import { User } from "@modules/setting/models";
import { ColumnDef } from "@tanstack/react-table";
import { Bot, Copy, MoreHorizontal, UserIcon } from "lucide-react";
import React from "react";

export const userColumns: ColumnDef<User>[] = [
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
      // const major = row.original;
      // NOTE: This is a hack to get the refetch function from the table options. Seems like the table meta is not being passed to the header component.
      // const meta = table.options.meta as { refetch: () => void } | undefined;

      return <MoreHorizontal />;
    },
  },
];
