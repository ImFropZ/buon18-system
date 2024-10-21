import { z } from "zod";

export interface Response<T extends object | null> {
  code: string;
  message: string;
  data: T;
}

export const GenderSchema = z.enum(["M", "F", "U"], {
  message: "You must select either one of the options.",
});

export type Gender = z.infer<typeof GenderSchema>;

export const SocialMediaSchema = z.object({
  id: z.number().or(z.string()).optional(),
  platform: z.string(),
  url: z.string().url({ message: "Invalid URL." }),
});

export type SocialMedia = z.infer<typeof SocialMediaSchema>;

export const RoleSchema = z.enum(["Admin", "Editor", "User"]);

export const dateInString = z.string().transform((val, ctx) => {
  const parsed = new Date(val);
  if (isNaN(parsed.getTime())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid date",
    });

    return z.NEVER;
  }

  return parsed;
});

export const numberInString = z.any().transform((val, ctx) => {
  const parsed = Number(val);
  if (isNaN(parsed)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Not a number",
    });

    return z.NEVER;
  }
  return parsed;
});

export const booleanInString = z.any().transform((val, ctx) => {
  if (val === "true") return true;
  if (val === "false") return false;
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: "Not a boolean",
  });

  return z.NEVER;
});
