import { z } from "zod";

export interface School {
  id: number;
  name: string;
  image_url: string;
}

export const CreateSchoolSchema = z.object({
  name: z.string(),
  image_url: z.string(),
});

export const CreateSchoolsSchema = z.object({
  schools: z.array(CreateSchoolSchema),
});

export const UpdateSchoolSchema = z.object({
  name: z.string().optional(),
  image_url: z.string(),
});
