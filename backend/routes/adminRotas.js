import express from "express";
const filialController = require('../controllers/filialController');
const usuarioController = require('../controllers/usuarioController');
const produtoController = require('../controllers/produtoController');
const fornecedorController = require('../controllers/fornecedorController');
const relatorioController = require('../controllers/relatorioController');

const router = express.Router();

/* ===================== ROTAS ADMINISTRATIVAS ===================== */

// Listar todas as filiais
router.get('/filiais', filialController.listarFiliais);

// Listar uma filial específica
router.get('/filiais/:id', filialController.listarFilial);

// Criar uma nova filial
router.post('/filiais', filialController.criarFilial);

// Alterar informações de uma filial
router.put('/filiais/:id', filialController.editarFilial);

// Desativar uma filial
router.delete('/filiais/:id', filialController.desativarFilial);

// Informações de estoque de uma filial
router.get('/filiais/:id/estoque', filialController.estoqueFilial);

// Informações de estoque de todas as filiais
router.get('/filiais/estoque', filialController.estoqueTodasFiliais);


/* ===================== ROTA DO USUÁRIO ===================== */

// Listar todos os usuários
router.get('/usuarios', usuarioController.listarUsuarios);

// Listar um usuário específico
router.get('/usuarios/:id', usuarioController.listarUsuario);

// Adicionar um usuário a partir do id da filial
router.post('/filiais/:id/usuarios', usuarioController.adicionarUsuario);

// Alterar informações de um usuário
router.put('/usuarios/:id', usuarioController.editarUsuario);

/* ===================== ROTAS DO PRODUTOS ===================== */

// Listar todos os produtos disponíveis
router.get('/produtos', produtoController.listarProdutos);

// Listar um produto específico
router.get('/produtos/:id', produtoController.listarProduto);

// Adicionar um produto
router.post('/produtos', produtoController.adicionarProduto);

// Alterar informações de um produto
router.put('/produtos/:id', produtoController.editarProduto);

// Desativar um produto
router.delete('/produtos/:id', produtoController.desativarProduto);

/* ===================== ROTAS DO FORNECEDOR ===================== */

// Adicionar um fornecedor
router.post('/fornecedores', fornecedorController.adicionarFornecedor);

// Listar fornecedores
router.get('/fornecedores', fornecedorController.listarFornecedores);

// Editar fornecedor
router.put('/fornecedores/:id', fornecedorController.editarFornecedor);

/* ===================== ROTAS DO FINANCEIRO ===================== */

// Relatório financeiro consolidado de todas as filiais
router.get('/relatorios/financeiro', relatorioController.relatorioFinanceiroConsolidado);

// Relatório geral de vendas (por período, filial, vendedor, etc.)
router.get('/relatorios/vendas', relatorioController.relatorioVendasGeral);

module.exports = router;