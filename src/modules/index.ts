import { Manifest } from "./inteface";

export const installedModules: {
  module: { manifest: Manifest };
}[] = [
  { module: require("./quiz-lobby") },
  { module: require("./setting") },
  { module: require("./sales") },
];
