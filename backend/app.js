import express from "express";
import dotenv from 'dotenv'

dotenv.config();

const app = express();
const port = process.env.PORT;
import livroRotas from "./routes/livroRotas.js";
import authRotas from "./routes/authRotas.js";
import cors from 'cors';

app.use(cors());
app.use(express.json());


app.use("/livros", livroRotas);
app.use('/auth', authRotas);

app.get("/", (req, res) => {
  res.status(200).send("API de Biblioteca");
});

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
