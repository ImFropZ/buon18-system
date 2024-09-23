import { Checkbox } from "@components/ui/checkbox";
import { Professor } from "@modules/lobby-serksa/models";
import { ColumnDef } from "@tanstack/react-table";

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
    cell: ({}) => {
      return <div />;
    },
  },
];
