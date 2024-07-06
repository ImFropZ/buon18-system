"use client";

import { Button } from "@components/ui/button";
import { Account } from "@models/account";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye } from "lucide-react";

interface AccountColumnProps {
  show?: () => void;
  edit?: () => void;
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
      cell: () => {
        return (
          <div className="flex justify-center gap-2">
            <Button
              variant={"outline"}
              onClick={show}
              className="h-auto px-1 py-1"
            >
              <Eye size={16} />
            </Button>
            <Button
              variant={"outline"}
              onClick={edit}
              className="h-auto px-1 py-1"
            >
              <Edit size={16} />
            </Button>
          </div>
        );
      },
    },
  ] satisfies ColumnDef<Account>[];
}
