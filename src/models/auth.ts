import * as z from "zod";

export const LoginFormSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  password: z.string().min(1, {
    message: "Password must be at least 1 character.",
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
