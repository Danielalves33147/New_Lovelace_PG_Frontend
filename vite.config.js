import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: process.env.PORT || 3000, // Usa a porta que o Railway definir
    strictPort: true,
  },
  preview: {
    host: "0.0.0.0",
    port: process.env.PORT || 3000,
    strictPort: true,
  },
});
