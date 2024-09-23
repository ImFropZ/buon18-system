import { Checkbox } from "@components/ui/checkbox";
import { Subject } from "@modules/lobby-serksa/models";
import { ColumnDef } from "@tanstack/react-table";

export const subjectColumns: ColumnDef<Subject>[] = [
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
    header: "Semester - Year",
    cell: ({ row }) => {
      const subject = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="inline select-none rounded-lg border px-2 py-1">
            {subject.semester}
          </p>
          <p className="select-none">-</p>
          <p className="inline select-none rounded-lg border px-2 py-1">
            {subject.year}
          </p>
        </div>
      );
    },
  },
  {
    header: "Major",
    cell: ({ row }) => {
      const subject = row.original;
      const major = subject.major;

      return (
        <div className="flex items-center gap-2">
          <p className="inline rounded bg-gray-300 px-2 py-1 dark:bg-gray-700">
            {major.id}
          </p>
          <p>{major.name}</p>
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
