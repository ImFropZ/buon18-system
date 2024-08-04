import {
  Book,
  Building,
  FileText,
  LucideIcon,
  UserCog,
  Users,
} from "lucide-react";

export const NAVIGATIONS_ICON: { [_ in string]: LucideIcon } = {
  accounts: Users,
  clients: Building,
  quotes: Book,
  "sales-orders": FileText,
  users: UserCog,
};
