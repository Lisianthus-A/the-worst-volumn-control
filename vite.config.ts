import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.join(__dirname, "./src"),
    },
  },
  esbuild: {
    pure: ["console.log"],
    // drop: ["debugger"],
  },
  server: {
    port: 3000,
  },
});
