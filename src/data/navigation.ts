import { Book, Building, FileText, LucideIcon, Users } from "lucide-react";

export const NAVIGATIONS_ICON: { [_ in string]: LucideIcon } = {
    'accounts': Users,
    'clients': Building,
    'quotes': Book,
    'sales-orders': FileText,
}