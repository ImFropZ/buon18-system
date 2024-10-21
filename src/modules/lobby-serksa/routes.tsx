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
    name: "lobby-serksa",
    list: "/lobby-serksa",
    meta: {
      displayName: "Lobby Serksa",
      icon: <LayoutDashboard />,
    },
  },
  {
    name: "lobby-serksa/schools",
    list: "/lobby-serksa/schools",
    meta: {
      displayName: "Schools",
      icon: <School />,
    },
  },
  {
    name: "lobby-serksa/majors",
    list: "/lobby-serksa/majors",
    meta: {
      displayName: "Majors",
      icon: <Award />,
    },
  },
  {
    name: "lobby-serksa/subjects",
    list: "/lobby-serksa/subjects",
    meta: {
      displayName: "Subjects",
      icon: <Book />,
    },
  },
  {
    name: "lobby-serksa/professors",
    list: "/lobby-serksa/professors",
    meta: {
      displayName: "Professors",
      icon: <User />,
    },
  },
  {
    name: "lobby-serksa/quizzes",
    list: "/lobby-serksa/quizzes",
    meta: {
      displayName: "Quizzes",
      icon: <StickyNote />,
    },
  },
  {
    name: "lobby-serksa/transactions",
    list: "/lobby-serksa/transactions",
    meta: {
      displayName: "Transactions",
      icon: <CreditCard />,
    },
  },
];
