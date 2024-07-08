"use client";

import { CustomTooltip } from "@components/CustomTooltip";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui/tooltip";
import { Account } from "@models/account";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye } from "lucide-react";

interface AccountColumnProps {
  show?: (id: string | number) => void;
  edit?: (id: string | number) => void;
}

export function columns({ show, edit }: AccountColumnProps) {
  return [
    {
      accessorKey: "code",
      header: "Code",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "phone",
      header: "Phone",
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
            <CustomTooltip content={<p>View Details</p>}>
              <button
                onClick={show ? () => show(id) : () => {}}
                className="group/button h-auto rounded px-2 py-[1px] outline outline-[1px] outline-primary/50 hover:outline-primary"
              >
                <Eye
                  size={18}
                  className="text-primary/50 group-hover/button:text-primary"
                />
              </button>
            </CustomTooltip>
            <CustomTooltip content={<p>Edit</p>}>
              <button
                onClick={edit ? () => edit(id) : () => {}}
                className="group/button h-auto rounded px-2 py-[1px] outline outline-[1px] outline-primary/50 hover:outline-primary"
              >
                <Edit
                  size={18}
                  className="text-primary/50 group-hover/button:text-primary"
                />
              </button>
            </CustomTooltip>
          </div>
        );
      },
    },
  ] satisfies ColumnDef<Account>[];
}
