import { numberInString } from "@models";
import { Major } from "./major";
import * as z from "zod";

export interface Subject {
  id: number;
  name: string;
  semester: number;
  year: number;
  major: Major;
}

export const CreateSubjectSchema = z.object({
  name: z.string(),
  semester: numberInString.pipe(z.number()),
  year: numberInString.pipe(z.number()),
  major: z.object({ id: z.number(), name: z.string() }),
});

export const CreateSubjectsSchema = z.object({
  subjects: z.array(CreateSubjectSchema),
});

export const UpdateSubjectSchema = z.object({
  name: z.string(),
  semester: numberInString.pipe(z.number()),
  year: numberInString.pipe(z.number()),
  major: z.object({ id: z.number(), name: z.string() }),
});
