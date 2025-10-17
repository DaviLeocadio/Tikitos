import express from "express";
import dotenv from "dotenv";
import {
  AbrirCaixaController,
  FecharCaixaController,
  ResumoCaixaController
} from "../controllers/CaixaController.js";
import {
  listarVendasController,
  criarVendaController,
  excluirVendaController
} from "../controllers/VendaController.js";
import { listarProdutosController, obterProdutoPorIdController } from "../controllers/ProdutoController.js";


dotenv.config();

const router = express.Router();

//Rota para abrir caixa
router.post("/caixa/:idVendedor", AbrirCaixaController);

//Rota para fechar caixa
router.put("/caixa/:idVendedor", FecharCaixaController);

//Rota para a criação de vendas
router.post("/vendas", criarVendaController);

//Rota para listar as vendas
router.get("/vendas", listarVendasController);

// Listar produtos
router.get("/produtos", listarProdutosController);

// Detalhes de uma unidade de produto
router.get("/produtos/:idProduto", obterProdutoPorIdController);
  
// Resumo do caixa (Total de vendas, pagamento, saldo)
router.get("/caixa/:idCaixa/resumo", ResumoCaixaController);

// Cancelar uma venda (pode exigir validação de gerente
router.delete("/vendas/:idVenda", excluirVendaController);


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
