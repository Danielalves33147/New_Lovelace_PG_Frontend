import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Carregar variáveis do .env
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      host: true, // Permite acesso externo
      port: env.VITE_PORT || 3000, // Garante que use a porta correta
      strictPort: true,
    },
    preview: {
      host: true,
      port: env.VITE_PORT || 3000,
      strictPort: true,
    },
    define: {
      "process.env": env, // Define as variáveis para o ambiente do Vite
    },
  };
});
