import express from "express";
import {
  listarEmpresasController,
  obterEmpresaPorIdController,
  criarEmpresaController,
  atualizarEmpresaController,
  desativarFilialController,
  estoqueFilialController,
  estoqueTodasFiliaisController,
  transferirFuncionarioController,
  reativarFilialController,
} from "../controllers/FilialController.js";

import {
  atualizarGerenteController,
  criarGerenteController,
  desativarGerenteController,
  listarGerentesController,
} from "../controllers/GerenteController.js";

import {
  listarProdutosController,
  obterProdutoPorIdController,
  criarProdutoController,
  atualizarProdutoController,
  desativarProdutoController,
} from "../controllers/ProdutoController.js";

import {
  criarFornecedorController,
  listarFornecedoresController,
  obterFornecedorPorIdController,
  atualizarFornecedorController,
} from "../controllers/FornecedorController.js";

import {
  atualizarProdutoLojaController,
  estoqueBaixoController,
  pedidoProdutoController
} from "../controllers/ProdutoLojaController.js";

import {
  listarVendedoresController,
  obterVendedorPorIdController,
  criarVendedorController,
  atualizarVendedorController,
  desativarVendedorController,
} from "../controllers/VendedorController.js";

import { AdminDashboardController } from "../controllers/DashboardAdminController.js";

import {
  gerarRelatorioFiliaisController,
  relatorioVendasGeralController,
} from "../controllers/RelatorioController.js";

import multer from "multer";
import path from "path";

import { fileURLToPath } from "url";

const router = express.Router();

/* ===================== ROTAS ADMINISTRATIVAS ===================== */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../frontend/public/img/empresas"));
  },
  filename: (req, file, cb) => {
    const nomeArquivo = `${Date.now()}-${file.originalname}`;
    cb(null, nomeArquivo);
  },
});

const upload = multer({ storage: storage });

/* ===== DASHBOARD ===== */
router.get('/dashboard', AdminDashboardController)

/* ===== FILIAIS ===== */

// Listar todas as filiais
router.get("/filiais", listarEmpresasController);

// Obter uma filial específica
router.get("/filiais/:empresaId", obterEmpresaPorIdController);

// Criar uma nova filial
router.post("/filiais", criarEmpresaController);

// Alterar informações de uma filial
router.put("/filiais/:empresaId", atualizarEmpresaController);

// Desativar uma filial
router.delete("/filiais/:empresaId", desativarFilialController);

// reativar uma filial
router.post("/filiais/:empresaId/reativar", reativarFilialController);

// Trasferir gerente
router.post("/filiais/:empresaId/transferir-funcionario", transferirFuncionarioController);



// Informações de estoque de uma filial
router.get("/filiais/:empresaId/estoque", estoqueFilialController);

// Informações de estoque de todas as filiais
router.get("/estoque/filiais", estoqueTodasFiliaisController);

// Lista de Usuários da filial

/* ===================== VENDEDORES ===================== */

// Listar todos os vendedores
router.get("/vendedores", listarVendedoresController);

// Obter um vendedor específico
router.get("/vendedores/:vendedorId", obterVendedorPorIdController);

// ⚠ Admin (matriz) não tem controle sobre criação ou edição de vendedor.

/* ===================== GERENTES ===================== */

// Listar todos os gerentes
router.get("/gerentes", listarGerentesController);

// Listar um gerente específico
router.get("/gerentes/:gerenteId", obterVendedorPorIdController);

// Adicionar um gerente a partir do id da filial
router.post("/filiais/:idEmpresa/gerentes", criarGerenteController);

// Alterar informações de um gerente
router.put("/gerentes/:gerenteId", atualizarGerenteController);

// Status do gerente inativo
router.delete("/gerentes/:gerenteId/desativar", desativarGerenteController);

/* ===================== PRODUTOS ===================== */

// Listar todos os produtos disponíveis
router.get("/produtos", listarProdutosController);

// Listar um produto específico
router.get("/produtos/:idProduto", obterProdutoPorIdController);

// Adicionar um produto
router.post("/produtos", upload.single("imagem"), criarProdutoController);

// Alterar informações de um produto
router.put(
  "/produtos/:id",
  upload.single("imagem"),
  atualizarProdutoController
);

// Desativar um produto
router.delete("/produtos/:id", desativarProdutoController);

/* ===================== FORNECEDORES ===================== */

// Adicionar um fornecedor
router.post("/fornecedores", criarFornecedorController);

// Listar fornecedores
router.get("/fornecedores", listarFornecedoresController);

// Editar fornecedor
router.put("/fornecedores/:id", atualizarFornecedorController);

/* ===================== FINANCEIRO ===================== */

// Relatório financeiro consolidado de todas as filiais
router.get("/relatorios/financeiro", gerarRelatorioFiliaisController);

// Relatório geral de vendas (por período, filial, vendedor, etc.)
router.get("/relatorios/vendas", relatorioVendasGeralController);

export default router;
