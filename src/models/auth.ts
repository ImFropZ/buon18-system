import * as z from "zod";

export const LoginFormSchema = z.object({
  email: z.string().min(1, {
    message: "Email is required.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export const UpdatePasswordSchema = z.object({
  old_password: z.string().min(8, {
    message: "Old password must be at least 8 character.",
  }),
  new_password: z.string().min(8, {
    message: "New password must be at least 8 character.",
  }),
});

export type LoginForm = z.infer<typeof LoginFormSchema>;
