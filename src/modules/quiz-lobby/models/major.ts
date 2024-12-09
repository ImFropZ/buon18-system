import { z } from "zod";
import { schoolSchema } from "./school";
import { generateSystemDefaultResponseSchema } from "@modules/shared/model";

export const majorSchema = z.object({
  id: z.number(),
  name: z.string(),
  school: schoolSchema,
});

export const majorsResponseSchema = generateSystemDefaultResponseSchema(
  z.object({ majors: z.array(majorSchema) }),
);

export const createMajorSchema = z.object({
  name: z.string().min(1),
  school: schoolSchema,
});

export const createMajorsSchema = z.object({
  majors: z.array(createMajorSchema),
});

export const updateMajorSchema = z.object({
  name: z.string().min(1),
  school: schoolSchema,
});
