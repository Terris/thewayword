import type { Config } from "tailwindcss";
import sharedConfig from "@config/tailwind-config";

const config: Pick<Config, "presets" | "content" | "important"> = {
  content: ["./src/**/*.tsx"],
  presets: [sharedConfig],
};

export default config;
