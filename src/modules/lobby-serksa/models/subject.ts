import { Major } from "./major";

export interface Subject {
  id: number;
  name: string;
  year: number;
  semester: number;
  major: Major;
}
