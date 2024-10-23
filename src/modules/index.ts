import { Manifest } from "./inteface";

export const installedModules: {
  module: { manifest: Manifest };
}[] = [
  { module: require("./quiz-lobby") },
  { module: require("./accounting") },
  { module: require("./sales") },
  { module: require("./setting") },
];
