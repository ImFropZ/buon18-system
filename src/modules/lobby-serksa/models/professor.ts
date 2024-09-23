import { Subject } from "./subject";

export interface Professor {
  id: number;
  title: string;
  full_name: string;
  subjects: Subject[];
}
