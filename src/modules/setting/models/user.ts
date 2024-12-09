import { z } from "zod";
import { roleSchema } from "./role";
import { generateSystemDefaultResponseSchema } from "@modules/shared/model";

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  type: z.string(),
  role: roleSchema,
});

export const userResponseSchema = generateSystemDefaultResponseSchema(
  z.object({ user: userSchema }),
);

export const usersResponseSchema = generateSystemDefaultResponseSchema(
  z.object({ users: z.array(userSchema) }),
);

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  role: roleSchema.omit({ permissions: true }),
});

export const updateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  password: z.string(),
  role: roleSchema,
});
