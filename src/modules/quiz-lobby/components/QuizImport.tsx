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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { ParseMeta } from "papaparse";
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

interface QuizImportCSVProps extends React.HTMLAttributes<HTMLDivElement> {
  meta: ParseMeta;
  data: Array<{ [key in string]: any }>;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onImport: (data: z.infer<typeof createQuizSchema>[]) => void;
}

export function QuizImportCSV({
  meta,
  data,
  isOpen,
  setIsOpen,
  children,
  onImport,
}: QuizImportCSVProps) {
  // NOTED: from is the field in the CSV file, to is the field in the form
  const [matchFields, setMatchFields] = React.useState<
    { from: string; to: string }[]
  >([]);

  React.useEffect(() => {
    setMatchFields([
      {
        from: meta.fields?.[0] ?? "",
        to: "id",
      },
      {
        from: meta.fields?.[1] ?? "",
        to: "question",
      },
      {
        from: meta.fields?.[2] ?? "",
        to: "image_url",
      },
      {
        from: meta.fields?.[3] ?? "",
        to: "label",
      },
      {
        from: meta.fields?.[4] ?? "",
        to: "is_correct",
      },
    ]);
  }, [meta.fields]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Quiz Configuration</DialogTitle>
          <DialogDescription>
            Make any adjustment here before import into form on the website.
            Make sure the id field is unique. The id field is used to identify
            the quiz. Make sure the fields are matched correctly before import.
            This is a one-time operation.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {matchFields.map((f, i) => {
            return (
              <div key={i} className="flex items-center gap-4">
                <Select
                  defaultValue={meta.fields?.[i]}
                  onValueChange={(value) => {
                    const newMatchFields = [...matchFields];
                    newMatchFields[i].from = value;
                    setMatchFields(newMatchFields);
                  }}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select your perfer field" />
                  </SelectTrigger>
                  <SelectContent>
                    {meta.fields?.map((field, i) => {
                      return (
                        <SelectItem key={i} value={field}>
                          {field}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <p> = </p>
                <Label className="flex-1">{f.to}</Label>
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <Button variant="secondary">Cancel</Button>
          <Button
            onClick={() => {
              const mappedData: z.infer<typeof createQuizSchema>[] = [];
              let prevId = "";
              data.forEach((d) => {
                if (Object.keys(d).length !== matchFields.length) return;
                const quiz = {
                  id: d[matchFields[0].from],
                  question: d[matchFields[1].from],
                  image_url: d[matchFields[2].from],
                  options: [
                    {
                      label: d[matchFields[3].from],
                      is_correct:
                        d[matchFields[4].from].toLowerCase() === "true",
                    },
                  ],
                };

                if (prevId === quiz.id) {
                  mappedData[mappedData.length - 1].options.push({
                    label: d[matchFields[3].from],
                    is_correct: d[matchFields[4].from].toLowerCase() === "true",
                  });
                  return;
                }

                prevId = quiz.id;
                mappedData.push(quiz);
              });
              onImport(mappedData);
              setIsOpen(false);
            }}
          >
            Import
          </Button>
        </DialogFooter>
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
