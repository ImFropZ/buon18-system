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
import { Dialog, DialogContent, DialogTrigger } from "@components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { toast } from "@components/ui/use-toast";
import { axiosInstance } from "@modules/lobby-serksa/fetch";
import { Quiz } from "@modules/lobby-serksa/models";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal } from "lucide-react";

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
    cell: ({ row, table }) => {
      const quiz = row.original;
      const meta = table.options.meta as { refetch: () => void } | undefined;

      return <ActionQuiz quiz={quiz} meta={meta} />;
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

function ActionQuiz({
  quiz,
  meta,
}: {
  quiz: Quiz;
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
            This action cannot be undone. This will permanently delete the quiz
            record.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              axiosInstance
                .delete(`/admin/quizzes`, {
                  data: [{ id: quiz.id }],
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
