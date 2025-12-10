// models/adminDashboardModel.js
import { readRaw } from "../config/database.js";

import dotenv from "dotenv";

dotenv.config();

export const AdminDashboardModel = {
  // Faturamento total da rede e transações
  async getVendasConsolidadas(periodo) {
    const { dataInicio, dataFim } = calcularPeriodo(periodo);

    const sql = `
      SELECT 
        COUNT(v.id_venda) as total_transacoes,
        COALESCE(SUM(v.total), 0) as total_faturamento
      FROM vendas v
      WHERE v.data_venda BETWEEN ? AND ?
    `;

    const resultado = await readRaw(sql, [dataInicio, dataFim]);
    return resultado[0] || { total_transacoes: 0, total_faturamento: 0 };
  },

  // Ranking de lojas por desempenho
  async getRankingLojas(periodo) {
    const { dataInicio, dataFim } = calcularPeriodo(periodo);

    const sql = `
      SELECT 
    e.id_empresa,
    e.nome AS nome_loja,
    COUNT(v.id_venda) AS total_vendas,
    COALESCE(SUM(v.total), 0) AS valor_total
  FROM empresas e
LEFT JOIN vendas v 
    ON v.id_empresa = e.id_empresa
    AND v.data_venda BETWEEN ? AND ?
WHERE e.tipo = 'filial' AND e.status = 'ativo'
GROUP BY e.id_empresa, e.nome
ORDER BY valor_total DESC, total_vendas DESC;
    `;

    const lojas = await readRaw(sql, [dataInicio, dataFim]);

    return lojas.map((loja) => ({
      nome: loja.nome_loja,
      totalVendas: loja.total_vendas,
      valorTotal: formatarMoeda(parseFloat(loja.valor_total)),
    }));
  },

  // Melhor vendedor da rede
  async getMelhorVendedor(periodo) {
    const { dataInicio, dataFim } = calcularPeriodo(periodo);

    const sql = `
      SELECT 
        u.nome,
        COUNT(v.id_venda) as total_vendas,
        COALESCE(SUM(v.total), 0) as valor_total
      FROM usuarios u
      INNER JOIN vendas v ON v.id_usuario = u.id_usuario
      WHERE v.data_venda BETWEEN ? AND ?
      GROUP BY u.id_usuario, u.nome
      ORDER BY valor_total DESC
      LIMIT 1
    `;

    const resultado = await readRaw(sql, [dataInicio, dataFim]);
    return resultado[0] || { nome: "N/A", total_vendas: 0, valor_total: 0 };
  },

  // Vendedores ativos na rede
  async getVendedoresAtivos() {
    const sql = `
      SELECT COUNT(DISTINCT id_usuario) as total
      FROM usuarios
      WHERE perfil = 'vendedor' AND status = 'ativo'
    `;

    const resultado = await readRaw(sql);
    return resultado[0]?.total || 0;
  },

  // Produtos vendidos no período
  async getProdutosVendidos(periodo) {
    const { dataInicio, dataFim } = calcularPeriodo(periodo);

    const sql = `
      SELECT COALESCE(SUM(iv.quantidade), 0) as total
      FROM venda_itens iv
      INNER JOIN vendas v ON v.id_venda = iv.id_venda
      WHERE v.data_venda BETWEEN ? AND ?
    `;

    const resultado = await readRaw(sql, [dataInicio, dataFim]);
    return resultado[0]?.total || 0;
  },

  // Produtos com baixo estoque (consolidado)
  async getProdutosBaixoEstoque() {
    const sql = `
      SELECT COUNT(*) AS total
      FROM produto_loja p
      INNER JOIN empresas e 
      ON e.id_empresa = p.id_empresa
      WHERE 
      p.estoque < ${process.env.ESTOQUE_MINIMO}
      AND e.status = 'ativo';
`;

    const resultado = await readRaw(sql);
    return resultado[0]?.total || 0;
  },

  // Fluxo de caixa consolidado
  async getFluxoCaixaConsolidado(periodo) {
    const { dataInicio, dataFim } = calcularPeriodo(periodo);

    // Entradas (vendas)
    const sqlEntradas = `
      SELECT COALESCE(SUM(total), 0) as total_entradas
      FROM vendas
      WHERE data_venda BETWEEN ? AND ?
    `;

    // Saídas (gastos)
    const sqlSaidas = `
      SELECT COALESCE(SUM(preco), 0) as total_saidas
      FROM despesas
      WHERE data_pag BETWEEN ? AND ?
    `;

    // Contas pendentes (total de todas as filiais)
    const sqlPendentes = `
      SELECT COALESCE(SUM(preco), 0) as total_pendentes
      FROM despesas
      WHERE status = 'pendente'
    `;

    const entradas = await readRaw(sqlEntradas, [dataInicio, dataFim]);
    const saidas = await readRaw(sqlSaidas, [dataInicio, dataFim]);
    const pendentes = await readRaw(sqlPendentes);

    const totalEntradas = parseFloat(entradas[0]?.total_entradas || 0);
    const totalSaidas = parseFloat(saidas[0]?.total_saidas || 0);
    const totalPendentes = parseFloat(pendentes[0]?.total_pendentes || 0);
    const saldo = totalEntradas - totalSaidas;

    return {
      entradas: formatarMoeda(totalEntradas),
      saidas: formatarMoeda(totalSaidas),
      saldo: formatarMoeda(saldo),
      contasPendentes: formatarMoeda(totalPendentes),
    };
  },
};

// Funções auxiliares
function calcularPeriodo(periodo) {
  // Usa offsets em dias para evitar problemas com meses de tamanhos diferentes
  const hoje = new Date();
  const dataFim = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()); // hoje (00:00 local)

  let dataInicio = new Date(dataFim);

  switch (periodo) {
    case "hoje":
      // dataInicio já é hoje
      break;
    case "semana":
      dataInicio.setDate(dataInicio.getDate() - 7);
      break;
    case "mes":
      // último 30 dias — mais previsível que reduzir 1 mês e correr risco de "estouro" de dia
      dataInicio.setDate(dataInicio.getDate() - 30);
      break;
    case "ano":
      dataInicio.setFullYear(dataInicio.getFullYear() - 1);
      break;
    default:
      dataInicio.setDate(dataInicio.getDate() - 30);
  }

  const toISODate = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Garantir ordem correta (dataInicio <= dataFim)
  if (dataInicio > dataFim) {
    dataInicio = new Date(dataFim);
  }

  return {
    dataInicio: toISODate(dataInicio),
    dataFim: toISODate(dataFim),
  };
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}
