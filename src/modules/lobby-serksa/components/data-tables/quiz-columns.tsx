import { Checkbox } from "@components/ui/checkbox";
import { Quiz } from "@modules/lobby-serksa/models";
import { ColumnDef } from "@tanstack/react-table";

export const quizColumns: ColumnDef<Quiz>[] = [
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
    accessorKey: "question",
    header: "Question",
  },
  {
    header: "Answer",
    cell: ({ row }) => {
      const quiz = row.original;
      const answer = quiz.options.find(
        (option) => option.id === quiz.answer_id,
      );

      return (
        <div className="flex items-center gap-2">
          <p className="inline rounded bg-gray-300 px-2 py-1 dark:bg-gray-700">
            {answer?.id}
          </p>
          <p>{answer?.label}</p>
        </div>
      );
    },
  },
  {
    header: "Professor",
    cell: ({ row }) => {
      const quiz = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="inline rounded bg-gray-300 px-2 py-1 dark:bg-gray-700">
            {quiz.professor.id}
          </p>
          <p>
            {quiz.professor.title} {quiz.professor.full_name}
          </p>
        </div>
      );
    },
  },
  {
    header: "Subject",
    cell: ({ row }) => {
      const quiz = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className="inline rounded bg-gray-300 px-2 py-1 dark:bg-gray-700">
            {quiz.subject.id}
          </p>
          <p>{quiz.subject.name}</p>
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
