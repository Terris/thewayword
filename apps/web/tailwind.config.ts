// tailwind config is required for editor support

import type { Config } from "tailwindcss";
import sharedConfig from "@config/tailwind-config";

const config: Pick<Config, "content" | "presets" | "important"> = {
  content: ["./app/**/*.tsx", "./lib/**/*.tsx"],
  presets: [sharedConfig],
  important: true,
};

export default config;
