import { Role } from "./role";
import * as z from "zod";

export interface User {
  id: number;
  name: string;
  email: string;
  type: "bot" | "user";
  role: Role;
}

export const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  role: z.object({
    id: z.number().min(1),
    name: z.string(),
  }),
});
