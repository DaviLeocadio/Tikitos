// import express from "express";
// const FilialController = require('../controllers/FilialController');
// const UsuarioController = require('../controllers/UsuarioController');
// const ProdutoController = require('../controllers/ProdutoController');
// const FornecedorController = require('../controllers/FornecedorController');
// const RelatorioController = require('../controllers/RelatorioController');

// const router = express.Router();

// /* ===================== ROTAS ADMINISTRATIVAS ===================== */

// // Listar todas as filiais
// router.get('/filiais', FilialController.listarFiliais);

// // Listar uma filial específica
// router.get('/filiais/:id', FilialController.listarFilial);

// // Criar uma nova filial
// router.post('/filiais', FilialController.criarFilial);

// // Alterar informações de uma filial
// router.put('/filiais/:id', FilialController.editarFilial);

// // Desativar uma filial
// router.delete('/filiais/:id', FilialController.desativarFilial);

// // Informações de estoque de uma filial
// router.get('/filiais/:id/estoque', FilialController.estoqueFilial);

// // Informações de estoque de todas as filiais
// router.get('/filiais/estoque', FilialController.estoqueTodasFiliais);


// /* ===================== ROTA DO USUÁRIO ===================== */

// // Listar todos os usuários
// router.get('/usuarios', UsuarioController.listarUsuarios);

// // Listar um usuário específico
// router.get('/usuarios/:id', UsuarioController.listarUsuario);

// // Adicionar um usuário a partir do id da filial
// router.post('/filiais/:id/usuarios', UsuarioController.adicionarUsuario);

// // Alterar informações de um usuário
// router.put('/usuarios/:id', UsuarioController.editarUsuario);

// /* ===================== ROTAS DO PRODUTOS ===================== */

// // Listar todos os produtos disponíveis
// router.get('/produtos', ProdutoController.listarProdutos);

// // Listar um produto específico
// router.get('/produtos/:id', ProdutoController.listarProduto);

// // Adicionar um produto
// router.post('/produtos', ProdutoController.adicionarProduto);

// // Alterar informações de um produto
// router.put('/produtos/:id', ProdutoController.editarProduto);

// // Desativar um produto
// router.delete('/produtos/:id', ProdutoController.desativarProduto);

// /* ===================== ROTAS DO FORNECEDOR ===================== */

// // Adicionar um fornecedor
// router.post('/fornecedores', FornecedorController.adicionarFornecedor);

// // Listar fornecedores
// router.get('/fornecedores', FornecedorController.listarFornecedores);

// // Editar fornecedor
// router.put('/fornecedores/:id', FornecedorController.editarFornecedor);

// /* ===================== ROTAS DO FINANCEIRO ===================== */

// // Relatório financeiro consolidado de todas as filiais
// router.get('/relatorios/financeiro', RelatorioController.relatorioFinanceiroConsolidado);

// // Relatório geral de vendas (por período, filial, vendedor, etc.)
// router.get('/relatorios/vendas', RelatorioController.relatorioVendasGeral);

// export default router;