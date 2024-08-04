import { booleanInString, RoleSchema } from "@models";
import * as z from "zod";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: RoleSchema,
  deleted: booleanInString.or(z.boolean()),
});

export const UserUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  role: RoleSchema.optional(),
  deleted: booleanInString.or(z.boolean()).optional(),
  password: z.string().optional(),
});

export const UserCreateSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: RoleSchema,
  password: z.string(),
});
