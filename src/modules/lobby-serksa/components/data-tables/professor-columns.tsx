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
import { axiosInstance } from "@modules/lobby-serksa/fetch";
import { Professor } from "@modules/lobby-serksa/models";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

export const professorColumns: ColumnDef<Professor>[] = [
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
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "full_name",
    header: "Name",
  },
  {
    header: "Subjects",
    cell: ({ row }) => {
      const professor = row.original;

      return (
        <div className="flex items-center gap-2">
          {professor.subjects.map((subject) => (
            <p
              key={subject.id}
              className="inline rounded bg-gray-300 px-2 py-1 dark:bg-gray-700"
            >
              {subject.id} - {subject.name}
            </p>
          ))}
        </div>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row, table }) => {
      const professor = row.original;
      const meta = table.options.meta as { refetch: () => void } | undefined;

      return <ActionProfessor professor={professor} meta={meta} />;
    },
  },
];

function ActionProfessor({
  professor,
  meta,
}: {
  professor: Professor;
  meta?: { refetch: () => void };
}) {
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="cursor-pointer text-red-400 focus:text-red-500">
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            professor record.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              axiosInstance
                .delete(`/admin/professors`, {
                  data: [{ id: professor.id }],
                })
                .then((res) => {
                  toast({
                    title: "Success",
                    description: res.data.message,
                  });
                  if (meta) meta.refetch();
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
    </AlertDialog>
  );
}
