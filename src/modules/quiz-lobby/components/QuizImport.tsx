"use client";

import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { CreateQuizSchema } from "../models";
import React from "react";
import { z } from "zod";

interface QuizImportProps extends React.HTMLAttributes<HTMLDivElement> {
  meta: ParseMeta;
  data: Array<{ [key in string]: any }>;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onImport: (data: z.infer<typeof CreateQuizSchema>[]) => void;
}

export function QuizImport({
  meta,
  data,
  isOpen,
  setIsOpen,
  children,
  onImport,
}: QuizImportProps) {
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
              const mappedData: z.infer<typeof CreateQuizSchema>[] = [];
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
