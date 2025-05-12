import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173, // <-- Porta nova aqui
    strictPort: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 5173, // <-- Mesma aqui
    strictPort: true,
  },
});

