import { Checkbox } from "@components/ui/checkbox";
import { Major } from "@modules/lobby-serksa/models";
import { ColumnDef } from "@tanstack/react-table";

export const majorColumns: ColumnDef<Major>[] = [
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
    header: "School",
    cell: ({ row }) => {
      const major = row.original;
      const school = major.school;

      return (
        <div className="flex items-center gap-2">
          <p className="inline rounded bg-gray-300 px-2 py-1 dark:bg-gray-700">
            {school.id}
          </p>
          <p>{school.name}</p>
        </div>
      );
    },
  },
  {
    header: "Actions",
    cell: ({}) => {
      return <div />;
    },
  },
];
