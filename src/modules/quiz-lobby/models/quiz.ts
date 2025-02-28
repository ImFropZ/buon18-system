import { z } from "zod";
import { professorSchema } from "./professor";
import { subjectSchema } from "./subject";
import { generateSystemDefaultResponseSchema } from "@modules/shared/model";

export const quizOptionSchema = z.object({
  id: z.number(),
  label: z.string(),
  is_correct: z.boolean(),
});

export const quizSchema = z.object({
  id: z.number(),
  question: z.string(),
  image_url: z.string(),
  archived: z.boolean(),
  professor: professorSchema.omit({ subjects: true }),
  subject: subjectSchema.omit({ major: true }),
  options: z.array(quizOptionSchema),
  answer_id: z.number(),
});

export const quizzesResponseSchema = generateSystemDefaultResponseSchema(
  z.object({ quizzes: z.array(quizSchema) }),
);

export const createQuizOptionSchema = z.object({
  label: z.string().min(1),
  is_correct: z.boolean(),
});

export const createQuizSchema = z.object({
  question: z.string().min(1),
  image_url: z.string(),
  options: z.array(createQuizOptionSchema),
});

export const createQuizzesSchema = z
  .object({
    professor: professorSchema.omit({ subjects: true }),
    subject: subjectSchema.omit({ major: true }),
    quizzes: z.array(createQuizSchema),
  })
  .superRefine((data, ctx) => {
    // Check if there is at least one correct option
    data.quizzes.forEach((quiz, i) => {
      const correctOption = quiz.options.find((option) => option.is_correct);
      if (!correctOption) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["quizzes"],
          message: `At question ${i + 1}, there must be at least one correct option`,
        });

        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["quizzes", i, "options"],
          message: "There must be at least one correct option",
        });
      }
    });
  });

export const updateQuizOptionSchema = z.object({
  id: z.number(),
  label: z.string().min(1),
  is_correct: z.boolean(),
});

export const updateQuizSchema = z
  .object({
    question: z.string().min(1),
    image_url: z.string().optional(),
    archived: z.boolean(),
    professor: professorSchema.omit({ subjects: true }),
    subject: subjectSchema.omit({ major: true }),
    options: z.array(z.union([createQuizOptionSchema, updateQuizOptionSchema])),
  })
  .superRefine((data, ctx) => {
    // Check if there is at least one correct option
    const correctOption = data.options.find((option) => option.is_correct);
    if (!correctOption) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: "There must be at least one correct option",
      });
    }
  });

export const createUploadQuizzesSchema = z.object({
  professor: professorSchema.omit({ subjects: true }),
  subject: subjectSchema.omit({ major: true }),
});
