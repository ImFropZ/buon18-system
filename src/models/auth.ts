import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().min(1, {
    message: "Email is required.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export const updatePasswordSchema = z
  .object({
    current_password: z.string().min(1, {
      message: "Current password is required.",
    }),
    new_password: z.string().min(8, {
      message: "New password must be at least 8 character.",
    }),
    confirm_password: z.string().min(8, {
      message: "Confirm password must be at least 8 character.",
    }),
  })
  .superRefine((v, ctx) => {
    if (v.new_password !== v.confirm_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "New password and confirm password must be same.",
        path: ["confirm_password"],
      });
      return z.NEVER;
    }
    return v;
  });

export const updateProfileSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  email: z.string().email().min(1, {
    message: "Email is required.",
  }),
});

export type LoginForm = z.infer<typeof loginFormSchema>;

export const permissionSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const roleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  permissions: z.array(permissionSchema),
});

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  type: z.enum(["user", "bot"]),
  role: roleSchema,
});
