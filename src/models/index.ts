import * as z from "zod";

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
