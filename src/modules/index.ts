import { Manifest } from "./inteface";

export const installedModules = [{ module: require("./lobby-serksa") }] as {
  module: { manifest: Manifest };
}[];
