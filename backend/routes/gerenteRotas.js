// import express from "express";
// const VendedorController = require('../controllers/VendedorController');
// const ProdutoController = require('../controllers/ProdutoController');
// const GastoController = require('../controllers/GastoController');
// const CaixaController = require('../controllers/CaixaController');
// const RelatorioController = require('../controllers/RelatorioController');
// const VendaController = require('../controllers/VendaController');

// const router = express.Router();

// /* ===================== ROTAS GERENTE ===================== */

// // Adiciona um funcionário (vendedor)
// router.post('/vendedores', VendedorController.adicionarVendedor);

// // Visualiza todos os vendedores
// router.get('/vendedores', VendedorController.listarVendedores);

// // Altera informações de um vendedor específico
// router.put('/vendedores/:id', VendedorController.editarVendedor);

// /* ===================== ROTAS DE PRODUTO E ESTOQUE  ===================== */

// // Lista todos os produtos
// router.get('/produtos', ProdutoController.listarProdutos);

// // Informações específicas de um produto
// router.get('/produtos/:id', ProdutoController.infoProduto);

// // Edita estoque e/ou desconto de um produto (na filial)
// router.put('/produtos/:id', ProdutoController.editarProduto);

// // Lista produtos com estoque abaixo do mínimo (alerta)
// router.get('/estoque-baixo', ProdutoController.estoqueBaixo);

// /* ===================== ROTAS GASTOS ===================== */

// // Informações de gastos da filial
// router.get('/gastos', GastoController.listarGastos);

// // Adiciona um gasto
// router.post('/gastos', GastoController.adicionarGasto);

// // Edita informações de um gasto
// router.put('/gastos/:id',GastoController.editarGasto);

// // Exclui um gasto
// router.delete('/gastos/:id', GastoController.excluirGasto);

// /* ===================== ROTAS DE CAIXA, VENDAS, RELATORIOS ===================== */

// // Visualiza valores obtidos do fluxo de caixa de cada dia
// router.get('/caixa', CaixaController.fluxoCaixaDiario);

// // Resumo de um caixa específico
// router.get('/caixa/:id', CaixaController.resumoCaixa);

// // Relatório financeiro com parâmetros de consulta
// router.get('/relatorio', RelatorioController.gerarRelatorio);

// // Lista vendas da filial (filtros: data, vendedor, forma de pagamento)
// router.get('/vendas', VendaController.listarVendas);


// export default router;

