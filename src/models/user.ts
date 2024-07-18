import { RoleSchema } from "@models";
import * as z from "zod";

export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    role: RoleSchema,
    deleted: z.boolean(),
})