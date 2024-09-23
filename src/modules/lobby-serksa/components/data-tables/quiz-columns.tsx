import { Checkbox } from "@components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@components/ui/dialog";
import { Quiz } from "@modules/lobby-serksa/models";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

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
    header: "Question (Image)",
    cell: ({ row }) => {
      const quiz = row.original;
      return (
        <div className="flex items-center justify-between gap-2">
          <p>{quiz.question}</p>
          {quiz.image_url !== "" ? (
            <ImageDialog src={quiz.image_url}>
              <Eye className="cursor-pointer rounded-lg px-1 outline outline-2 outline-gray-400" />
            </ImageDialog>
          ) : null}
        </div>
      );
    },
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

function ImageDialog({
  children,
  src,
}: {
  children: React.ReactNode;
  src: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex justify-center">
        <img src={src} alt="quiz image" />
      </DialogContent>
    </Dialog>
  );
}
