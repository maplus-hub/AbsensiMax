import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// @ts-expect-error JS plugin alongside the TS Vite config
import { grokPwaPlugin } from "./scripts/grok-pwa-plugin.mjs";

export default defineConfig({
  base: "/AbsensiMax/",
  resolve: { tsconfigPaths: true },
  define: {
    "import.meta.env.VITE_STATIC_SITE": JSON.stringify("true"),
  },
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    grokPwaPlugin(),
    tailwindcss(),
    viteReact(),
  ],
});
