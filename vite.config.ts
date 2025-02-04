import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import {configDefaults} from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // ✅ Enables Jest-like functions (describe, test, expect)
    setupFiles: "./src/setupTests.ts", // ✅ Ensures setup runs before tests
    environment: "jsdom", // ✅ Simulates a browser environment
    exclude: [...configDefaults.exclude],
  },
});
