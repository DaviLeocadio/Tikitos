import express from "express";
import {
  listarVendedoresController,
  obterVendedorPorIdController,
  criarVendedorController,
  atualizarVendedorController,
  excluirVendedorController,
} from "../controllers/VendedorController.js";

import {
  listarProdutosController,
  obterProdutoPorIdController,
  criarProdutoController,
  atualizarProdutoController,
} from "../controllers/ProdutoController.js";

import { atualizarProdutoLojaController, estoqueBaixoController } from "../controllers/ProdutoLojaController.js";

// const ProdutoController = require('../controllers/ProdutoController');
// const RelatorioController = require('../controllers/RelatorioController');
// const CaixaController = require('../controllers/CaixaController');
// const VendaController = require('../controllers/VendaController');

const router = express.Router();

/* ===================== ROTAS GERENTE ===================== */

/* ===== Vendedores ===== */

// Adiciona um funcionário (vendedor)
router.post("/vendedores", criarVendedorController);

// Visualiza todos os vendedores
router.get("/vendedores", listarVendedoresController);

// // Altera informações de um vendedor específico
router.put("/vendedores/:vendedorId", atualizarVendedorController);

/* ===== Produtos e Estoque ===== */

// Lista todos os produtos
router.get('/produtos', listarProdutosController);

// Informações específicas de um produto
router.get('/produtos/:idProduto', obterProdutoPorIdController);

// Edita estoque e/ou desconto de um produto (na filial)
router.put('/produtos/:id', atualizarProdutoLojaController);

// Lista produtos com estoque abaixo do mínimo (alerta)
router.get('/estoque-baixo', estoqueBaixoController);

/* ===== Despesas ===== */

// // Informações de gastos da filial
// router.get('/gastos', GastoController.listarGastos);

// // Adiciona um gasto
// router.post('/gastos', GastoController.adicionarGasto);

// // Edita informações de um gasto
// router.put('/gastos/:id',GastoController.editarGasto);

// // Exclui um gasto
// router.delete('/gastos/:id', GastoController.excluirGasto);

/* ===== Caixa, Vendas e relatórios ===== */

// // Visualiza valores obtidos do fluxo de caixa de cada dia
// router.get('/caixa', CaixaController.fluxoCaixaDiario);

// // Resumo de um caixa específico
// router.get('/caixa/:id', CaixaController.resumoCaixa);

// // Relatório financeiro com parâmetros de consulta
// router.get('/relatorio', RelatorioController.gerarRelatorio);

// // Lista vendas da filial (filtros: data, vendedor, forma de pagamento)
// router.get('/vendas', VendaController.listarVendas);

export default router;
