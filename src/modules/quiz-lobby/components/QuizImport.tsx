"use client";

import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { Label } from "@components/ui/label";
import {
  createQuizSchema,
  createUploadQuizzesSchema,
  professorSchema,
  professorsResponseSchema,
  subjectSchema,
  subjectsResponseSchema,
} from "../models";
import React from "react";
import { z } from "zod";
import { Upload } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosInstance } from "../fetch";
import { Form, FormField } from "@components/ui/form";
import { SearchSelectFormField } from "@components/form";
import { toast } from "@components/ui/use-toast";

const onImportHandler = async () => {
  return new Promise((resolve: (f: File) => void, _) => {
    const inputEl = document.createElement("input");
    inputEl.type = "file";
    inputEl.accept = "text/plain";
    inputEl.onchange = (e) => {
      const target = e.currentTarget as HTMLInputElement;
      if (!target || !target.files) return;
      const file = target.files[0];

      resolve(file);
    };

    inputEl.click();
  });
};

interface QuizImportTxtProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onImport: (data: z.infer<typeof createQuizSchema>[]) => void;
}

const FORMAT_TYPE = {
  QUESTION: "[+]",
  IMAGE: "[i]",
  OPTION_INCORRECT: "[-][]",
  OPTION_CORRECT: "[-][x]",
};

export function QuizImportTxt(props: QuizImportTxtProps) {
  return (
    <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button">Import</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Quiz Configuration</DialogTitle>
          <DialogDescription>
            Make any adjustment here before import into form on the website.
            Make sure the format are matched correctly before import. This is a
            one-way operation. Format of Txt file should be as follows:
          </DialogDescription>
          <pre className="text-sm text-muted-foreground">
            [+]: question <br />
            [i]: image (URL) <br />
            [-][]: option incorrect <br />
            [-][x]: option correct
          </pre>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            onClick={() => {
              onImportHandler().then(async (f) => {
                const reader = f.stream().getReader();
                const decoder = new TextDecoder("utf-8");
                let { value } = await reader.read();
                let buffer = "";
                let isError = false;

                const data: z.infer<typeof createQuizSchema>[] = [];

                buffer += decoder.decode(value, { stream: true });
                let lines = buffer.split(/\r\n|\n/);

                let tmp_q: z.infer<typeof createQuizSchema> = {
                  question: "",
                  image_url: "",
                  options: [],
                };
                let options: z.infer<typeof createQuizSchema>["options"] = [];

                let lineCount = 0;
                for (let l of lines) {
                  lineCount++;
                  l = l.trim();
                  if (l === "") continue;

                  if (l.startsWith(FORMAT_TYPE.QUESTION)) {
                    if (tmp_q.question !== "") {
                      tmp_q.options = options;
                      data.push({ ...tmp_q });
                      options = [];
                      tmp_q.image_url = "";
                    }
                    tmp_q.question = l
                      .substring(FORMAT_TYPE.QUESTION.length)
                      .trim();
                    continue;
                  }

                  if (l.startsWith(FORMAT_TYPE.IMAGE)) {
                    tmp_q.image_url = l
                      .substring(FORMAT_TYPE.IMAGE.length)
                      .trim();
                    continue;
                  }

                  if (l.startsWith(FORMAT_TYPE.OPTION_INCORRECT)) {
                    options.push({
                      label: l
                        .substring(FORMAT_TYPE.OPTION_INCORRECT.length)
                        .trim(),
                      is_correct: false,
                    });
                    continue;
                  } else if (l.startsWith(FORMAT_TYPE.OPTION_CORRECT)) {
                    options.forEach((o) => (o.is_correct = false)); // Reset all options to false
                    options.push({
                      label: l
                        .substring(FORMAT_TYPE.OPTION_CORRECT.length)
                        .trim(),
                      is_correct: true,
                    });
                    continue;
                  }

                  isError = true;
                  toast({
                    title: "Error",
                    description: `Invalid format at line: #${lineCount} - ${l}`,
                    variant: "destructive",
                  });
                  break;
                }
                if (tmp_q.question !== "") {
                  tmp_q.options = options;
                  data.push({ ...tmp_q });
                }

                if (!isError) {
                  props.setIsOpen(false);
                  props.onImport(data);
                }
              });
            }}
          >
            Upload File
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface QuizImportTxtFileProps {
  refetch: () => void;
}

export function QuizImportTxtFile(props: QuizImportTxtFileProps) {
  const [open, setOpen] = React.useState(false);
  const [professorId, setProfessorId] = React.useState(0);
  const [file, setFile] = React.useState<File | null>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm({
    resolver: zodResolver(createUploadQuizzesSchema),
    defaultValues: {
      professor: {
        id: 0,
        full_name: "",
        title: "",
      },
      subject: {
        id: 0,
        name: "",
        semester: 0,
        year: 0,
      },
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationKey: ["quiz-import"],
    mutationFn: async (data: z.infer<typeof createUploadQuizzesSchema>) => {
      const formdata = new FormData();
      formdata.append("professor_id", data.professor.id.toString());
      formdata.append("subject_id", data.subject.id.toString());

      if (file === null) {
        setFileError("Please select a txt file to upload");
        return;
      }

      setFileError(null);
      formdata.append("questions", new Blob([file], { type: "text/plain" }));

      axiosInstance
        .post("/admin/quizzes/form", formdata)
        .then((res) => {
          toast({
            title: "Success",
            description: res.data.message,
          });
          props?.refetch();
          form.reset();
          setFile(null);
          setProfessorId(0);
          setOpen(false);
        })
        .catch((errRes) => {
          toast({
            title: "Error",
            description: errRes.response.data.errors
              ? errRes.response.data.errors.join(" ")
              : errRes.response.data.message,
            variant: "destructive",
          });
        });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Upload />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Quiz</DialogTitle>
          <DialogDescription>
            Import quiz from a txt file. Make sure the txt file is in the
            correct format. And the format is as follows:
          </DialogDescription>
          <pre className="text-sm text-muted-foreground">
            [+]: question <br />
            [i]: image (URL) <br />
            [-][]: option incorrect <br />
            [-][x]: option correct
          </pre>
        </DialogHeader>
        <Form {...form}>
          <div>
            <Label>Professor</Label>
            <FormField
              control={form.control}
              name="professor"
              render={({ field }) => (
                <SearchSelectFormField<z.infer<typeof professorSchema>>
                  ids={["professors"]}
                  field={field}
                  errorField={form.formState.errors.professor}
                  placeholder="Select Professor"
                  fetchResource={async (searchPhase) => {
                    return axiosInstance
                      .get(`/admin/professors`, {
                        params: { ["full-name:ilike"]: searchPhase },
                      })
                      .then((res) => {
                        const result = professorsResponseSchema.safeParse(
                          res.data,
                        );

                        if (!result.success) {
                          console.error(result.error.errors);
                          return [];
                        }

                        return result.data.data.professors;
                      });
                  }}
                  onSelected={(v) => {
                    field.onChange(v);
                    setProfessorId(v.id);
                    form.setValue(
                      "subject",
                      {
                        id: 0,
                        name: "",
                        semester: 0,
                        year: 0,
                      },
                      {
                        shouldValidate: true,
                      },
                    );
                  }}
                  getLabel={(professor) =>
                    !professor.id
                      ? ""
                      : `${professor.id} - ${professor.title} ${professor.full_name}`
                  }
                  isSelectedData={(professor) =>
                    professor.id === field.value.id
                  }
                />
              )}
            />
          </div>
          <div>
            <Label>Subject</Label>
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <SearchSelectFormField<z.infer<typeof subjectSchema>>
                  ids={[`subjects`, professorId.toString()]}
                  disabled={professorId === 0}
                  field={field}
                  errorField={form.formState.errors.subject}
                  placeholder="Select Subject"
                  fetchResource={async (searchPhase) => {
                    return axiosInstance
                      .get(`/admin/subjects`, {
                        params: {
                          ["name:ilike"]: searchPhase,
                          ["professor-id:eq"]:
                            form.watch("professor.id") === 0
                              ? undefined
                              : form.watch("professor.id"),
                        },
                      })
                      .then((res) => {
                        const result = subjectsResponseSchema.safeParse(
                          res.data,
                        );

                        if (!result.success) {
                          console.error(result.error.errors);
                          return [];
                        }

                        return result.data.data.subjects;
                      });
                  }}
                  onSelected={field.onChange}
                  getLabel={(subject) =>
                    !subject.id
                      ? ""
                      : `${subject.id} - ${subject.name} (semester${subject.semester}-year:${subject.year})`
                  }
                  isSelectedData={(data) => data.id === field.value.id}
                />
              )}
            />
          </div>
          <input
            type="file"
            accept="text/plain"
            ref={fileInputRef}
            hidden
            onChange={(e) => {
              if (e.target.files === null) return;
              setFile(e.target.files[0]);
            }}
          />
          {fileError ? (
            <p className="text-sm text-destructive">{fileError}</p>
          ) : null}
          <Button
            type="button"
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            {file
              ? `(${file.name}) Click to change`
              : "Select a questions txt file"}
          </Button>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              form.reset();
              setFile(null);
              setProfessorId(0);
            }}
          >
            Reset
          </Button>
          <Button
            disabled={isLoading}
            onClick={() => {
              form.handleSubmit((data) => {
                mutate(data);
              })();
            }}
          >
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
