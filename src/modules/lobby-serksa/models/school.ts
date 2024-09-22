import * as z from "zod";

export interface School {
  id: number;
  name: string;
}

export const CreateSchoolSchema = z.object({
  name: z.string(),
});

export const CreateSchoolsSchema = z.object({
  schools: z.array(CreateSchoolSchema),
});

export const UpdateSchoolSchema = z.object({
  name: z.string(),
});
