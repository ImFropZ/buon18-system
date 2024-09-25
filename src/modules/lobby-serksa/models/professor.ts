import { Subject } from "./subject";
import * as z from "zod";

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
