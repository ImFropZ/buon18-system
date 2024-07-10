import { Building, LucideProps, Users } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";


export const NAVIGATIONS_ICON: { [key in string]: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>> } = {
    'accounts': Users,
    'clients': Building,
}