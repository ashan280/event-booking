import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const base = process.env.VITE_BASE_PATH || "/";
const outDir = process.env.VITE_OUT_DIR || "dist";

export default defineConfig({
  base,
  build: {
    emptyOutDir: true,
    outDir
  },
  plugins: [react()],
  server: {
    port: 5173
  }
});
