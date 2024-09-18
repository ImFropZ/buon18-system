import { DataProvider, ResourceProps } from "@refinedev/core";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export interface Manifest {
  name: string;
  displayName: string;
  description: string;
  rootPath: string;
  icon: string;
  routes: ResourceProps[];
  dataProvider: DataProvider | null;
  pages: [
    {
      key: string;
      path: ForwardRefExoticComponent<RefAttributes<HTMLElement>> | null;
    },
  ];
}
