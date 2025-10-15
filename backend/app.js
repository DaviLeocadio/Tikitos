import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT;
import authRotas from "./routes/authRotas.js";
import vendedorRotas from "./routes/vendedorRotas.js";
// import gerenteRotas from "./routes/gerenteRotas.js";
// import adminRotas from "./routes/adminRotas.js";
import authMiddleware from "./middlewares/authMiddleware.js";
import cors from "cors";
import { metaController } from "./controllers/MetaController.js";

app.use(cors());
app.use(express.json());

app.use("/auth", authRotas);

app.use("/vendedor", authMiddleware(["vendedor"]), vendedorRotas);
// app.use('/gerente', authMiddleware(["gerente"]), gerenteRotas);
// app.use('/admin', authMiddleware(["admin"]), adminRotas);

// app.post("/meta", authMiddleware["vendedor", "gerente", "admin"], metaController);

app.options("/", (req, res) => {
  res.setHeader("Allow", "GET, OPTIONS");
  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({ mensagem: "Rota não encontrada" });
});

app.listen(port, () => {
  console.log(`Server running in http://localhost:${port}`);
});
