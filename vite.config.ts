import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import {configDefaults} from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, 
    setupFiles: "./src/setupTests.ts", 
    environment: "jsdom",
    exclude: [...configDefaults.exclude],
    base: "./" 
  },
});
