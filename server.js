import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 8080;

// Corrigir caminho do diretório __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir os arquivos estáticos do build do Vite
app.use(express.static(path.join(__dirname, "dist")));

// Rota para servir o index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servindo o frontend em http://localhost:${PORT}`);
});
