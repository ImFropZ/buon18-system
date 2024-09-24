import * as z from "zod";
import { School } from "./school";

export interface Major {
  id: number;
  name: string;
  school: School;
}

export const CreateMajorSchema = z.object({
  name: z.string(),
  school: z.object({ id: z.number(), name: z.string() }),
});

export const CreateMajorsSchema = z.object({
  majors: z.array(CreateMajorSchema),
});
