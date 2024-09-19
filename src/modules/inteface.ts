import { DataProvider, ResourceProps } from "@refinedev/core";

export interface Manifest {
  name: string;
  displayName: string;
  description: string;
  rootPath: string;
  icon: string;
  routes: ResourceProps[];
  dataProvider: DataProvider | null;
  pages: {
    key: string;
    path: React.LazyExoticComponent<React.ComponentType<any>>;
  }[];
}
