import { Manifest } from "./inteface";

export const installedModules: {
  module: { manifest: Manifest };
}[] = [
  { module: require("./lobby-serksa") },
  { module: require("./setting") },
  { module: require("./sales") },
];
