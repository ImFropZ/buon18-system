import { z } from "zod";
import { numberInString } from "@models";
import { majorSchema } from "./major";
import { generateSystemDefaultResponseSchema } from "@modules/shared/model";

export const subjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  semester: z.number(),
  year: z.number(),
  major: majorSchema.omit({ school: true }),
});

export const subjectsResponseSchema = generateSystemDefaultResponseSchema(
  z.object({
    subjects: z.array(subjectSchema),
  }),
);

export const createSubjectSchema = z.object({
  name: z.string().min(1),
  semester: numberInString.pipe(z.number()),
  year: numberInString.pipe(z.number()),
  major: majorSchema.omit({ school: true }),
});

export const createSubjectsSchema = z.object({
  subjects: z.array(createSubjectSchema),
});

export const updateSubjectSchema = z.object({
  name: z.string().min(1),
  semester: numberInString.pipe(z.number()),
  year: numberInString.pipe(z.number()),
  major: majorSchema.omit({ school: true }),
});
