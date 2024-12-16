import { z } from "zod";

export const basicResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
});

export const numberInString = z.any().transform((val, ctx) => {
  const parsed = Number(val);
  if (isNaN(parsed)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Value is not a number",
    });
    return z.NEVER;
  }
  return parsed;
});
