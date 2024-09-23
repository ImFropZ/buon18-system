import { Professor } from "./professor";
import { Subject } from "./subject";

export interface Quiz {
  id: number;
  question: string;
  image_url: string;
  professor: Professor;
  subject: Subject;
  options: QuizOption[];
  answer_id: number;
}

export interface QuizOption {
  id: number;
  label: string;
}
