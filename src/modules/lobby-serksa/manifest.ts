import { routes } from "./routes";
import { Manifest } from "@modules/inteface";

export const manifest: Manifest = {
  name: "lobby-serksa",
  displayName: "Lobby Serksa",
  description: "",
  rootPath: "/lobby-serksa",
  icon: "/modules/lobby-serksa.jpg",
  routes: routes,
  dataProvider: null,
  pages: [
    {
      key: "/lobby-serksa",
      path: require("./pages/page").default,
    },
  ],
};
