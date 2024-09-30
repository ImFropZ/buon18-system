import { Professor } from "./professor";
import { Subject } from "./subject";
import * as z from "zod";

export interface Quiz {
  id: number;
  question: string;
  image_url: string;
  archived: boolean;
  professor: Professor;
  subject: Subject;
  options: QuizOption[];
  answer_id: number;
}

export interface QuizOption {
  id: number;
  label: string;
}

export const CreateQuizSchema = z.object({
  question: z.string(),
  image_url: z.string(),
  options: z.array(
    z.object({
      label: z.string(),
      is_correct: z.boolean(),
    }),
  ),
});

export const CreateQuizzesSchema = z.object({
  professor: z.object({
    id: z.number(),
    full_name: z.string(),
  }),
  subject: z.object({
    id: z.number(),
    name: z.string(),
  }),
  quizzes: z.array(CreateQuizSchema),
});

export const UpdateQuizOptionSchema = z.object({
  id: z.number(),
  label: z.string(),
  is_correct: z.boolean(),
});

export const UpdateQuizSchema = z.object({
  question: z.string(),
  image_url: z.string(),
  archived: z.boolean(),
  professor: z.object({
    id: z.number(),
    full_name: z.string(),
  }),
  subject: z.object({
    id: z.number(),
    name: z.string(),
  }),
  add_options: z.array(
    z.object({
      label: z.string(),
      is_correct: z.boolean(),
    }),
  ),
  update_options: z.array(UpdateQuizOptionSchema),
  remove_option_ids: z.array(z.number()),
});
