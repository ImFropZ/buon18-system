"use client";

import { CustomTooltip } from "@components";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@components/ui/dropdown-menu";
import { orderSchema } from "@modules/sales/models";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import React from "react";
import { z } from "zod";

export const orderColumns: ColumnDef<z.infer<typeof orderSchema>>[] = [
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
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href={`/sales/orders/edit/${row.original.id}`}>Edit</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
