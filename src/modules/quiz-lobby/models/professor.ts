import { Subject } from "./subject";
import { z } from "zod";

export interface Professor {
  id: number;
  title: string;
  full_name: string;
  subjects: Subject[];
}

export const CreateProfessorSchema = z.object({
  title: z.enum(["Dr.", "Prof.", "Assoc. Prof.", "Asst. Prof."]),
  full_name: z.string(),
  subjects: z.array(z.object({ id: z.number(), name: z.string() })),
});

export const CreateProfessorsSchema = z.object({
  professors: z.array(CreateProfessorSchema),
});

export const UpdateProfessorSchema = z.object({
  title: z.enum(["Dr.", "Prof.", "Assoc. Prof.", "Asst. Prof."]),
  full_name: z.string(),
  subjects: z.array(z.object({ id: z.number(), name: z.string() })),
  add_subjects: z.array(z.object({ id: z.number(), name: z.string() })),
  remove_subjects: z.array(z.object({ id: z.number(), name: z.string() })),
});
