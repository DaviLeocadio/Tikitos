import express from "express";
import dotenv from "dotenv";
import {
  AbrirCaixaController,
  FecharCaixaController,
} from "../controllers/CaixaController.js";
import {
  listarVendasController,
  criarVendaController,
} from "../controllers/VendaController.js";

dotenv.config();

const router = express.Router();

//Rota para abrir caixa
router.post("/caixa/:idVendedor", AbrirCaixaController);

//Rota para fechar caixa
router.put("/caixa/:idVendedor", FecharCaixaController);

//Rota para listar as vendas
router.get("/venda", listarVendasController);

//Rota para a criação de vendas
router.post("/venda", criarVendaController);

router.options("/caixa/:idVendedor", (req, res) => {
  res.setHeader("Allow", "POST, OPTIONS");
  res.status(204).send();
});

router.options("/caixa/:idVendedor", (req, res) => {
  res.setHeader("Allow", "PUT, OPTIONS");
  res.status(204).send();
});

router.options("/venda", (req, res) => {
  res.setHeader("Allow", "GET, OPTIONS");
  res.status(204).send();
});

router.options("/venda", (req, res) => {
  res.setHeader("Allow", "GET, OPTIONS");
  res.status(204).send();
});

export default router;
