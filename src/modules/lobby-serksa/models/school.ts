import * as z from "zod";

export const CreateSchoolSchema = z.object({
  name: z.string(),
});

export const CreateSchoolsSchema = z.object({
  schools: z.array(CreateSchoolSchema),
});
