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
import { toast } from "@components/ui/use-toast";
import { Table } from "@tanstack/react-table";
import React from "react";

interface DeleteSelectButtonProps {
  isHidden: boolean;
  onDeleteSelectedHandler: (ids: number[]) => Promise<any>;
  title?: string;
  description?: string;
  refetch: () => void;
  table: Table<any>;
}

export function DeleteSelectButton({
  isHidden,
  onDeleteSelectedHandler,
  title,
  description,
  refetch,
  table,
}: DeleteSelectButtonProps) {
  return (
    <AlertDialog>
      {isHidden ? null : (
        <>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="text-red-400 hover:text-red-500"
            >
              Delete Selected
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {title ?? "Are you absolutely sure?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {description ??
                  "This action cannot be undone. This will permanently delete the records."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  const ids = table
                    .getSelectedRowModel()
                    .rows.flatMap((r) => r.original.id);
                  if (ids.length === 0) return;
                  onDeleteSelectedHandler(ids)
                    .then((res) => {
                      toast({
                        title: "Success",
                        description: res.data.message,
                      });
                      refetch();
                      table.resetRowSelection(false);
                    })
                    .catch((errRes) => {
                      toast({
                        title: "Error",
                        description: errRes.response.data.message,
                        variant: "destructive",
                      });
                    });
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </>
      )}
    </AlertDialog>
  );
}
