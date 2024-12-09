import { z } from "zod";
import { subjectSchema } from "./subject";
import { generateSystemDefaultResponseSchema } from "@modules/shared/model";

export const professorSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  full_name: z.string().min(1),
  subjects: z.array(subjectSchema.omit({ major: true })),
});

export const professorsResponseSchema = generateSystemDefaultResponseSchema(
  z.object({ professors: z.array(professorSchema) }),
);

export const createProfessorSchema = z.object({
  title: z.enum(["Dr.", "Prof.", "Assoc. Prof.", "Asst. Prof."]).or(z.string().min(1)),
  full_name: z.string().min(1),
  subjects: z.array(subjectSchema.omit({ major: true })),
});

export const createProfessorsSchema = z.object({
  professors: z.array(createProfessorSchema),
});

export const updateProfessorSchema = z.object({
  title: z.enum(["Dr.", "Prof.", "Assoc. Prof.", "Asst. Prof."]).or(z.string().min(1)),
  full_name: z.string().min(1),
  subjects: z.array(subjectSchema.omit({ major: true })),
  add_subjects: z.array(subjectSchema.omit({ major: true })),
  remove_subject_ids: z.array(z.number()),
});
