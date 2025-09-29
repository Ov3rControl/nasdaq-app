import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@repo/core": path.resolve(__dirname, "../../packages/core"),
      "@repo/api": path.resolve(__dirname, "../../packages/api"),
      "@repo/data": path.resolve(__dirname, "../../packages/data"),
      "@repo/storage": path.resolve(__dirname, "../../packages/storage"),
      "@": path.resolve(__dirname, "src"),
    },
  },
});
