import express from "express";
import {
  listarVendedoresController,
  obterVendedorPorIdController,
  criarVendedorController,
  atualizarVendedorController,
  desativarVendedorController,
} from "../controllers/VendedorController.js";

import {
  listarProdutosController,
  obterProdutoPorIdController,
  criarProdutoController,
  atualizarProdutoController,
} from "../controllers/ProdutoController.js";

import {
  atualizarProdutoLojaController,
  estoqueBaixoController,
} from "../controllers/ProdutoLojaController.js";
import {
  fluxoCaixaDiarioController,
  obterResumoCaixaController,
} from "../controllers/CaixaController.js";
import { listarVendasGerenteController } from "../controllers/VendaController.js";
import { gerarRelatorioGerenteController } from "../controllers/RelatorioController.js";
import {
  adicionarGastoController,
  atualizarGastoController,
  excluirGastoController,
  listarGastosController,
} from "../controllers/GastoController.js";
import { dashboardGerenteController } from "../controllers/DashboardGerenteController.js";

const router = express.Router();

/* ===================== ROTAS GERENTE ===================== */

/* Dashboard */
router.get("/dashboard", dashboardGerenteController)

/* ===== Vendedores ===== */

// Adiciona um funcionário (vendedor)
router.post("/vendedores", criarVendedorController);

// Visualiza todos os vendedores
router.get("/vendedores", listarVendedoresController);

// Altera informações de um vendedor específico
router.put("/vendedores/:vendedorId", atualizarVendedorController);

// Status do vendedor inativo
router.delete("/vendedores/:vendedorId/desativar", desativarVendedorController);

/* ===== Produtos e Estoque ===== */

// Lista todos os produtos
router.get("/produtos", listarProdutosController);

// Informações específicas de um produto
router.get("/produtos/:idProduto", obterProdutoPorIdController);

// Edita estoque e/ou desconto de um produto (na filial)
router.put("/produtos/:idProduto", atualizarProdutoLojaController);

// Fazer pedido de produto pro fornecedor
// router.post("/produtos/:idProduto", pedidoProdutoController)

// Lista produtos com estoque abaixo do mínimo (alerta)
router.get("/estoque-baixo", estoqueBaixoController);

/* ======== Despesas ======== */

// Informações de gastos da filial
router.get("/gastos", listarGastosController);

// Adiciona um gasto
router.post("/gastos", adicionarGastoController);

// Edita informações de um gasto
router.put("/gastos/:idGasto", atualizarGastoController);

// Exclui um gasto
router.delete("/gastos/:idGasto", excluirGastoController);

/* ===== Caixa, Vendas e Relatórios ===== */

// Visualiza valores obtidos do fluxo de caixa de cada dia
router.get("/caixa", fluxoCaixaDiarioController);

// Resumo de um caixa específico
router.get("/caixa/:idCaixa", obterResumoCaixaController);

// Relatório financeiro com parâmetros de consulta
router.get("/relatorio", gerarRelatorioGerenteController);

// Lista vendas da filial (filtros: data, vendedor, forma de pagamento)
router.get("/vendas", listarVendasGerenteController);

export default router;
