import { z } from "zod";

export const systemDefaultReponseSchema = z.object({
  code: z.number(),
  messsage: z.string().optional(),
});

export function generateSystemDefaultResponseSchema<T extends z.ZodTypeAny>(
  schema: T,
) {
  return systemDefaultReponseSchema.merge(
    z.object({
      data: schema,
    }),
  );
}
