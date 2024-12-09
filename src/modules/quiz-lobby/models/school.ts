import { generateSystemDefaultResponseSchema } from "@modules/shared/model";
import { z } from "zod";

export const schoolSchema = z.object({
  id: z.number(),
  name: z.string(),
  image_url: z.string().optional(),
});

export const schoolsResponseSchema = generateSystemDefaultResponseSchema(
  z.object({ schools: z.array(schoolSchema) }),
);

export const createSchoolSchema = z.object({
  name: z.string(),
  image_url: z.string(),
});

export const createSchoolsSchema = z.object({
  schools: z.array(createSchoolSchema),
});

export const updateSchoolSchema = z.object({
  name: z.string().optional(),
  image_url: z.string(),
});
