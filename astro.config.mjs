import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

const site = process.env.SITE_URL ?? "https://pixel-walk-journey-2026.free-fish.chatgpt.site";
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  site,
  base,
  output: "static",
  build: {
    format: "directory",
    assets: "assets",
  },
  integrations: [react(), mdx(), sitemap()],
  vite: {
    build: {
      target: "es2022",
    },
  },
});
