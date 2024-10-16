"use client";

import { Checkbox } from "@components/ui/checkbox";
import { Role } from "@modules/setting/models";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
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
      // NOTE: This is a hack to get the refetch function from the table options. Seems like the table meta is not being passed to the header component.
      // const meta = table.options.meta as { refetch: () => void } | undefined;

      return <MoreHorizontal />;
    },
  },
];
