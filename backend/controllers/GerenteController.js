// import express from "express";
// import {
//   listarVendedoresController,
//   obterVendedorPorIdController,
//   criarVendedorController,
//   atualizarVendedorController,
//   excluirVendedorController,
// } from "./VendedorController.js"; 

// import {
//   listarProdutosController,
//   obterProdutoPorIdController,
//   atualizarProdutoController,
//   listarEstoqueBaixoController,
// } from "./ProdutoController.js"; 

// import {
//   listarGastosController,
//   adicionarGastoController,
//   atualizarGastoController,
//   excluirGastoController,
// } from "./GastoController.js";

// import {
//   fluxoCaixaDiarioController,
//   resumoCaixaController,
// } from "./CaixaController.js"; 

// import {
//   gerarRelatorioController,
// } from "./RelatorioController.js"; 

// import {
//   listarVendasController,
// } from "./VendaController.js"; 


// const router = express.Router();

// /* ===================== ROTAS GERENTE ===================== */

// /* ===== Vendedores ===== */

// // Adiciona um funcionário (vendedor)
// router.post('/vendedores', criarVendedorController);

// // Visualiza todos os vendedores
// router.get('/vendedores', listarVendedoresController);

// // Altera informações de um vendedor específico
// router.put('/vendedores/:id', atualizarVendedorController);

// // Exclui um vendedor (Adicionado, pois é uma funcionalidade comum para gerentes)
// router.delete('/vendedores/:id', excluirVendedorController);


// /* ===== Produtos e Estoque ===== */

// // Lista todos os produtos
// router.get('/produtos', listarProdutosController);

// // Informações específicas de um produto
// router.get('/produtos/:id', obterProdutoPorIdController);

// // Edita estoque e/ou desconto de um produto (na filial)
// router.put('/produtos/:id', atualizarProdutoController);

// // Lista produtos com estoque abaixo do mínimo (alerta)
// router.get('/estoque-baixo', listarEstoqueBaixoController);


// /* ======== Despesas ======== */

// // Informações de gastos da filial
// router.get('/gastos', listarGastosController);

// // Adiciona um gasto
// router.post('/gastos', adicionarGastoController);

// // Edita informações de um gasto
// router.put('/gastos/:id', atualizarGastoController);

// // Exclui um gasto
// router.delete('/gastos/:id', excluirGastoController);


// /* ===== Caixa, Vendas e relatórios ===== */

// // Visualiza valores obtidos do fluxo de caixa de cada dia
// router.get('/caixa', fluxoCaixaDiarioController);

// // Resumo de um caixa específico
// router.get('/caixa/:id', resumoCaixaController);

// // Relatório financeiro com parâmetros de consulta
// router.get('/relatorio', gerarRelatorioController);

// // Lista vendas da filial (filtros: data, vendedor, forma de pagamento)
// router.get('/vendas', listarVendasController);

// export default router;