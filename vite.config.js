import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite configuration for React + ES Modules
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0"
  }
});
