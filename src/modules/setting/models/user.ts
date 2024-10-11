import { Role } from "./role";

export interface User {
  id: number;
  name: string;
  email: string;
  type: "bot" | "user";
  role: Role;
}
