import express from "express";
import {
  listarEmpresasController,
  obterEmpresaPorIdController,
  criarEmpresaController,
  atualizarEmpresaController,
  desativarFilialController,
  estoqueFilialController,
  estoqueTodasFiliaisController,
} from "../controllers/FilialController.js";

import {} from "../controllers/GerenteController.js";

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
  listarVendedoresController,
  obterVendedorPorIdController,
  criarVendedorController,
  atualizarVendedorController,
  desativarVendedorController
} from "../controllers/VendedorController.js"

// import {} from "../controllers/RelatorioController";

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

// Informações de estoque de uma filial
router.get("/filiais/:empresaId/estoque", estoqueFilialController);

// Informações de estoque de todas as filiais
router.get("/estoque/filiais", estoqueTodasFiliaisController);

/* ===================== VENDEDORES ===================== */

// Listar todos os vendedores
router.get("/vendedores", listarVendedoresController);

// Listar um vendedor específico
router.get("/vendedores/:vendedorId", obterVendedorPorIdController);

// Adicionar um vendedor a partir do id da filial
router.post("/filiais/:vendedorId/vendedores", criarVendedorController);

// Alterar informações de um vendedor
router.put("/vendedores/:vendedorId", atualizarVendedorController);

// Status do vendedor inativo
router.put("/vendedoresDesativar/:vendedorId", desativarVendedorController);

/* ===================== GERENTES ===================== */

// Listar todos os gerentes
router.get("/gerentes", listarVendedoresController);

// Listar um gerente específico
router.get("/gerentes/:gerenteId", obterVendedorPorIdController);

// Adicionar um gerente a partir do id da filial
router.post("/filiais/:gerenteId/gerentes", criarVendedorController);

// Alterar informações de um gerente
router.put("/gerentes/:gerenteId", atualizarVendedorController);

// Status do gerente inativo
router.put("/gerentesDesativar/:gerenteId", desativarVendedorController);

/* ===================== PRODUTOS ===================== */

// Listar todos os produtos disponíveis
router.get("/produtos", listarProdutosController);

// Listar um produto específico
router.get("/produtos/:id", obterProdutoPorIdController);

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

// // Relatório financeiro consolidado de todas as filiais
// router.get(
//   "/relatorios/financeiro",
//   RelatorioController.relatorioFinanceiroConsolidado
// );

// // Relatório geral de vendas (por período, filial, vendedor, etc.)
// router.get("/relatorios/vendas", RelatorioController.relatorioVendasGeral);

export default router;
