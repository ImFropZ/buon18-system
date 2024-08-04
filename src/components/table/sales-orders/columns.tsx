"use client";

import { CustomTooltip } from "@components/CustomTooltip";
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
import { SalesOrderSchema } from "@models/sales-order";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";
import * as z from "zod";

interface SalesOrderColumnProps {
  show?: (id: string | number) => void;
  edit?: (id: string | number) => void;
  _delete?: (id: string | number) => void;
}

export function columns({ _delete, show, edit }: SalesOrderColumnProps) {
  return [
    {
      accessorKey: "code",
      header: "Code",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const { status } = row.original;
        return <p>{status}</p>;
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const { accept_date, delivery_date } = row.original;
        return (
          <p className="flex gap-2">
            <span>{format(accept_date || new Date(), "PP")}</span>
            <span>-</span>
            <span>{format(delivery_date, "PP")}</span>
          </p>
        );
      },
    },
    {
      accessorKey: "note",
      header: "Note",
      cell: ({ row }) => {
        const { note } = row.original;
        return (
          <p>
            {note ? (
              note.length > 20 ? (
                note.slice(0, 20) + "..."
              ) : (
                note
              )
            ) : (
              <span className="text-muted-foreground">
                &minus; No note &minus;
              </span>
            )}
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
        const { id } = row.original;

        return (
          <div className="flex justify-center gap-2">
            {show ? (
              <CustomTooltip content="View Details">
                <button
                  onClick={() => show(id)}
                  className="group/button h-auto rounded px-2 py-[1px] outline outline-[1px] outline-primary/50 hover:outline-primary"
                >
                  <Eye
                    size={18}
                    className="text-primary/50 group-hover/button:text-primary"
                  />
                </button>
              </CustomTooltip>
            ) : null}
            {edit ? (
              <CustomTooltip content="Edit">
                <button
                  onClick={() => edit(id)}
                  className="group/button h-auto rounded px-2 py-[1px] outline outline-[1px] outline-primary/50 hover:outline-primary"
                >
                  <Edit
                    size={18}
                    className="text-primary/50 group-hover/button:text-primary"
                  />
                </button>
              </CustomTooltip>
            ) : null}
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
                    <AlertDialogAction onClick={() => _delete(id)}>
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
  ] satisfies ColumnDef<z.infer<typeof SalesOrderSchema>>[];
}
