import * as z from "zod";

export * from "./school";
export * from "./major";
export * from "./subject";
export * from "./professor";
export * from "./quiz";

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
