import express from "express";

/* ===================== CONTROLLERS ===================== */

/* ==== Filiais ==== */
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
  metaFiliaisController,
} from "../controllers/FilialController.js";

/* ==== Gerentes ==== */
import {
  atualizarGerenteController,
  criarGerenteController,
  desativarGerenteController,
  listarGerentesController,
  ativarGerenteController,
} from "../controllers/GerenteController.js";

/* ==== Produtos ==== */
import {
  listarProdutosController,
  obterProdutoPorIdController,
  criarProdutoController,
  atualizarProdutoController,
  desativarProdutoController,
  ativarProdutoController,
} from "../controllers/ProdutoController.js";

/* ==== Despesas ==== */
import {
  despesasPagasController,
  despesasPendentesController,
  criarDespesaController,
  listarDespesasController,
  pagarDespesaController,
  deletarDespesaController,
} from "../controllers/DespesasController.js";

/* ==== Fornecedores ==== */
import {
  criarFornecedorController,
  listarFornecedoresController,
  obterFornecedorPorIdController,
  atualizarFornecedorController,
  deletarFornecedorController,
} from "../controllers/FornecedorController.js";

/* ==== Produto Loja ==== */
import {
  atualizarProdutoLojaController,
  estoqueBaixoController,
  pedidoProdutoController,
} from "../controllers/ProdutoLojaController.js";

/* ==== Vendedores ==== */
import {
  listarVendedoresController,
  obterVendedorPorIdController,
  criarVendedorController,
  atualizarVendedorController,
  desativarVendedorController,
} from "../controllers/VendedorController.js";

/* ==== Dashboard ==== */
import { AdminDashboardController } from "../controllers/DashboardAdminController.js";

/* ==== Vendas ==== */
import { listarVendasController } from "../controllers/VendaController.js";

/* ==== ADMIN (meta/admin) ==== */
import { metaAdminController } from "../controllers/AdminController.js";

/* ==== RELATÓRIOS (NOVOS) ==== */
import {
  // relatorioFiliais,          // Relatório 1 — Todas as filiais consolidadas
  relatorioVendas,           // Relatório 2 — Vendas por filial / período
  relatorioPorFilial,        // Relatório 3 — Relatório COMPLETO da filial
  relatorioGeral,            // Relatório 4 — Master (de tudo)
  relatorioProdutos,         // Relatório 5 — Produtos
} from "../controllers/RelatorioAdminController.js";

/* ==== VENDAS ==== */
import {
  obterVendaController
} from "../controllers/VendaController.js"

import{
  listarCaixaController
} from "../controllers/CaixaController.js"

/* ===================== CONFIG UPLOAD ===================== */

import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../frontend/public/img/produtos"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

/* ===================== ROTAS ADMINISTRATIVAS ===================== */

/* ===== DASHBOARD ===== */
router.get("/dashboard", AdminDashboardController);

/* ===================== FILIAIS ===================== */

router.get("/filiais", listarEmpresasController);
router.get("/filiais/meta", metaFiliaisController);
router.get("/filiais/:empresaId", obterEmpresaPorIdController);
router.post("/filiais", criarEmpresaController);
router.put("/filiais/:empresaId", atualizarEmpresaController);
router.delete("/filiais/:empresaId/desativar", desativarFilialController);
router.post("/filiais/:empresaId/reativar", reativarFilialController);

router.post(
  "/filiais/:empresaId/transferir-funcionario",
  transferirFuncionarioController
);

router.get("/filiais/:empresaId/estoque", estoqueFilialController);
router.get("/estoque/filiais", estoqueTodasFiliaisController);

/* ===================== VENDEDORES ===================== */

router.get("/vendedores", listarVendedoresController);
router.get("/vendedores/:vendedorId", obterVendedorPorIdController);

/* ===================== GERENTES ===================== */

router.get("/gerentes", listarGerentesController);
router.get("/gerentes/:gerenteId", obterVendedorPorIdController);
router.post("/filiais/:idEmpresa/gerentes", criarGerenteController);
router.put("/gerentes/:gerenteId", atualizarGerenteController);
router.delete("/gerentes/:gerenteId/desativar", desativarGerenteController);
router.post("/gerentes/:gerenteId/ativar", ativarGerenteController);

/* ===================== DESPESAS ===================== */

router.get("/despesas-pagas", despesasPagasController);
router.get("/despesas-pendentes", despesasPendentesController);
router.post("/despesas", criarDespesaController);
router.get("/despesas", listarDespesasController);
router.put("/despesas/:despesaId", pagarDespesaController)
router.delete("/despesas/:despesaId", deletarDespesaController);

/* ===================== PRODUTOS ===================== */

router.get("/produtos", listarProdutosController);
router.get("/produtos/:idProduto", obterProdutoPorIdController);
router.post("/produtos", upload.single("imagem"), criarProdutoController);
router.put("/produtos/:idProduto", upload.single("imagem"), atualizarProdutoController);
router.delete("/produtos/:idProduto/desativar", desativarProdutoController);
router.post("/produtos/:idProduto/ativar", ativarProdutoController);

/* ===================== FORNECEDORES ===================== */

router.post("/fornecedores", criarFornecedorController);
router.get("/fornecedores", listarFornecedoresController);
router.get("/fornecedores/:id", obterFornecedorPorIdController);
router.put("/fornecedores/:id", atualizarFornecedorController);
router.delete("/fornecedores/:id", deletarFornecedorController);

/* ===================== VENDAS ===================== */

router.get("/vendas", listarVendasController);
router.get("/vendasTotais", obterVendaController);

/* ===================== CAIXA ===================== */
router.get("/caixa", listarCaixaController);

/* ===================== RELATÓRIOS (ADMIN) ===================== */

// 1 — Filiais consolidadas
// router.get("/relatorios/filiais", relatorioFiliais);

// 2 — Vendas geral / por filial
router.get("/relatorios/vendas", relatorioVendas);

// 3 — Relatório completo da filial
router.get("/relatorios/filial", relatorioPorFilial);

// 4 — Relatório master (financeiro + vendas + estoque)
router.get("/relatorios/geral", relatorioGeral);

// 5 — Relatório de produtos
router.get("/relatorios/produtos", relatorioProdutos);

/* ===================== META ADMIN ===================== */

router.get("/meta", metaAdminController);

export default router;
