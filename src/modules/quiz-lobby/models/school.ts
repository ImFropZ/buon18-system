import { generateSystemDefaultResponseSchema } from "@modules/shared/model";
import { z } from "zod";

export const schoolSchema = z.object({
  id: z.number(),
  name: z.string(),
  image_url: z.string().url().optional(),
});

export const schoolsResponseSchema = generateSystemDefaultResponseSchema(
  z.object({ schools: z.array(schoolSchema) }),
);

export const createSchoolSchema = z.object({
  name: z.string().min(1),
  image_url: z.string().url(),
});

export const createSchoolsSchema = z.object({
  schools: z.array(createSchoolSchema),
});

export const updateSchoolSchema = z.object({
  name: z.string().min(1).optional(),
  image_url: z.string().url(),
});
