import { ResourceProps } from "@refinedev/core";
import {
  Award,
  Book,
  CreditCard,
  LayoutDashboard,
  School,
  StickyNote,
  User,
} from "lucide-react";

export const routes: ResourceProps[] = [
  {
    name: "quiz-lobby",
    list: "/quiz-lobby",
    meta: {
      displayName: "Quiz Lobby",
      icon: <LayoutDashboard />,
    },
  },
  {
    name: "quiz-lobby/schools",
    list: "/quiz-lobby/schools",
    meta: {
      displayName: "Schools",
      icon: <School />,
    },
  },
  {
    name: "quiz-lobby/majors",
    list: "/quiz-lobby/majors",
    meta: {
      displayName: "Majors",
      icon: <Award />,
    },
  },
  {
    name: "quiz-lobby/subjects",
    list: "/quiz-lobby/subjects",
    meta: {
      displayName: "Subjects",
      icon: <Book />,
    },
  },
  {
    name: "quiz-lobby/professors",
    list: "/quiz-lobby/professors",
    meta: {
      displayName: "Professors",
      icon: <User />,
    },
  },
  {
    name: "quiz-lobby/quizzes",
    list: "/quiz-lobby/quizzes",
    meta: {
      displayName: "Quizzes",
      icon: <StickyNote />,
    },
  },
  {
    name: "quiz-lobby/transactions",
    list: "/quiz-lobby/transactions",
    meta: {
      displayName: "Transactions",
      icon: <CreditCard />,
    },
  },
];
