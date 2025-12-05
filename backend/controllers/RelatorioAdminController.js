// controllers/relatoriosController.js
import { readRaw } from "../config/database.js";
import { listarDespesas } from "../models/Despesas.js";
import { listarItensVenda } from "../models/ItensVenda.js";
import { listarProdutos } from "../models/Produto.js";
import { gerarRelatorioFinanceiroGerente } from "../models/Relatorio.js";
import { listarVendas } from "../models/Venda.js";

/**
 * Relatório de Vendas — exclusivo para ADMIN
 * - resumo geral
 * - vendas por dia
 * - vendas por filial
 * - últimas vendas
 * - top 10 produtos
 */
export const relatorioVendas = async (req, res) => {
  try {
    const { dataInicio, dataFim, filialId } = req.query;

    // -----------------------------
    // 1 — Datas padrão (últimos 30 dias)
    // -----------------------------
    const end = dataFim ? new Date(dataFim) : new Date();
    const start = dataInicio
      ? new Date(dataInicio)
      : new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);

    const startISO = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    )
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const endISO = new Date(
      end.getFullYear(),
      end.getMonth(),
      end.getDate() + 1
    )
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // -----------------------------
    // 2 — Filtro manual de filial (opcional)
    // -----------------------------
    let filialFilter = "";
    const params = [startISO, endISO];

    if (filialId) {
      filialFilter = "AND v.id_empresa = ?";
      params.push(filialId);
    }

    // -----------------------------
    // 3 — Resumo geral
    // -----------------------------
    const resumoSql = `
      SELECT
        COUNT(*) AS total_vendas,
        COALESCE(SUM(v.total), 0) AS faturamento,
        COALESCE(AVG(v.total), 0) AS ticket_medio
      FROM vendas v
      WHERE v.data_venda BETWEEN ? AND ?
      ${filialFilter};
    `;
    const [resResumo] = await readRaw(resumoSql, params);
    const resumo = resResumo || {
      total_vendas: 0,
      faturamento: 0,
      ticket_medio: 0,
    };

    // -----------------------------
    // 4 — Vendas agrupadas por dia
    // -----------------------------
    const porDiaSql = `
      SELECT
        DATE(v.data_venda) AS dia,
        COUNT(*) AS total_vendas,
        SUM(v.total) AS valor_total
      FROM vendas v
      WHERE v.data_venda BETWEEN ? AND ?
      ${filialFilter}
      GROUP BY DATE(v.data_venda)
      ORDER BY dia ASC;
    `;
    const vendasPorDia = await readRaw(porDiaSql, params);

    // -----------------------------
    // 5 — Resumo por filial (ranking)
    // -----------------------------
    const porFilialSql = `
      SELECT
        e.id_empresa,
        e.nome AS nome_filial,
        COUNT(v.id_venda) AS total_vendas,
        COALESCE(SUM(v.total), 0) AS faturamento
      FROM empresas e
      LEFT JOIN vendas v
        ON v.id_empresa = e.id_empresa
       AND v.data_venda BETWEEN ? AND ?
      WHERE e.tipo = 'filial'
      GROUP BY e.id_empresa, e.nome
      ORDER BY faturamento DESC;
    `;
    const vendasPorFilial = await readRaw(porFilialSql, [startISO, endISO]);

    // -----------------------------
    // 6 — Últimas 20 vendas
    // -----------------------------
    const ultimasSql = `
      SELECT
        v.id_venda,
        v.total,
        v.tipo_pagamento,
        v.data_venda,
        v.id_empresa
      FROM vendas v
      WHERE v.data_venda BETWEEN ? AND ?
      ${filialFilter}
      ORDER BY v.data_venda DESC
      LIMIT 20;
    `;
    const ultimasVendas = await readRaw(ultimasSql, params);

    // -----------------------------
    // 7 — Top 10 produtos vendidos
    // -----------------------------
    const topProdutosParams = [startISO, endISO];
    if (filialId) topProdutosParams.push(filialId);

    const topProdutosSql = `
      SELECT
        p.id_produto,
        p.nome,
        SUM(i.quantidade) AS quantidade_vendida,
        SUM(i.quantidade * i.preco_unitario) AS faturamento_produto
      FROM venda_itens i
      JOIN vendas v ON v.id_venda = i.id_venda
      JOIN produtos p ON p.id_produto = i.id_produto
      WHERE v.data_venda BETWEEN ? AND ?
      ${filialId ? "AND v.id_empresa = ?" : ""}
      GROUP BY p.id_produto, p.nome
      ORDER BY quantidade_vendida DESC
      LIMIT 10;
    `;

    let topProdutos = [];
    try {
      topProdutos = await readRaw(topProdutosSql, topProdutosParams);
    } catch {
      topProdutos = [];
    }

    // -----------------------------
    // 8 — Resposta final
    // -----------------------------
    return res.status(200).json({
      mensagem: "Relatório de vendas gerado com sucesso",
      periodo: { dataInicio: startISO, dataFim: endISO },

      resumo: {
        totalVendas: Number(resumo.total_vendas),
        totalFaturamento: Number(resumo.faturamento),
        ticketMedio: Number(resumo.ticket_medio),
      },

      porDia: vendasPorDia,
      porFilial: vendasPorFilial,
      ultimasVendas,
      topProdutos,
    });
  } catch (error) {
    console.error("Erro relatorioVendas:", error);
    return res.status(500).json({
      mensagem: "Erro ao gerar relatório de vendas",
      erro: error.message,
    });
  }
}

export const relatorioFinanceiro = async (req, res) => {
  try {
    const { dataInicio, dataFim, filialId } = req.query;

    // -----------------------------------
    // 1 — Datas (padrão: últimos 30 dias)
    // -----------------------------------
    const end = dataFim ? new Date(dataFim) : new Date();
    const start = dataInicio
      ? new Date(dataInicio)
      : new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);

    const startISO = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    )
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const endISO = new Date(
      end.getFullYear(),
      end.getMonth(),
      end.getDate() + 1
    )
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // -----------------------------------
    // 2 — Filtro opcional de filial
    // -----------------------------------
    let filialFilter = "";
    const params = [startISO, endISO];

    if (filialId) {
      filialFilter = "AND v.id_empresa = ?";
      params.push(filialId);
    }

    // -----------------------------------
    // 3 — Total de ENTRADAS (vendas)
    // -----------------------------------
    const entradasSql = `
      SELECT
        COALESCE(SUM(v.total), 0) AS total_entradas,
        SUM(CASE WHEN v.tipo_pagamento = 'pix' THEN v.total ELSE 0 END) AS total_pix,
        SUM(CASE WHEN v.tipo_pagamento = 'dinheiro' THEN v.total ELSE 0 END) AS total_dinheiro,
        SUM(CASE WHEN v.tipo_pagamento = 'cartão' THEN v.total ELSE 0 END) AS total_cartao
      FROM vendas v
      WHERE v.data_venda BETWEEN ? AND ?
      ${filialFilter};
    `;
    const [entradas] = await readRaw(entradasSql, params);

    // -----------------------------------
    // 4 — Total de SAÍDAS (despesas)
    // -----------------------------------
    let despesasFilter = "";
    const paramsDespesas = [startISO, endISO];

    if (filialId) {
      despesasFilter = "AND d.id_empresa = ?";
      paramsDespesas.push(filialId);
    }

    const despesasSql = `
      SELECT COALESCE(SUM(d.valor), 0) AS total_saidas
      FROM despesas d
      WHERE d.data_despesa BETWEEN ? AND ?
      ${despesasFilter};
    `;
    const [despesas] = await readRaw(despesasSql, paramsDespesas);

    // -----------------------------------
    // 5 — Lucro líquido
    // -----------------------------------
    const lucroLiquido =
      (entradas?.total_entradas || 0) - (despesas?.total_saidas || 0);

    // -----------------------------------
    // 6 — Entradas por dia (gráfico)
    // -----------------------------------
    const entradasDiaSql = `
      SELECT
        DATE(v.data_venda) AS dia,
        SUM(v.total) AS total
      FROM vendas v
      WHERE v.data_venda BETWEEN ? AND ?
      ${filialFilter}
      GROUP BY DATE(v.data_venda)
      ORDER BY dia;
    `;
    const entradasPorDia = await readRaw(entradasDiaSql, params);

    // -----------------------------------
    // 7 — Resumo por filial
    // -----------------------------------
    const porFilialSql = `
      SELECT
        e.id_empresa,
        e.nome AS nome_filial,
        COALESCE(SUM(v.total), 0) AS total_entradas,
        (
          SELECT COALESCE(SUM(valor), 0)
          FROM despesas d
          WHERE d.id_empresa = e.id_empresa
            AND d.data_despesa BETWEEN ? AND ?
        ) AS total_saidas
      FROM empresas e
      LEFT JOIN vendas v
        ON v.id_empresa = e.id_empresa
       AND v.data_venda BETWEEN ? AND ?
      WHERE e.tipo = 'filial'
      GROUP BY e.id_empresa, e.nome
      ORDER BY total_entradas DESC;
    `;
    const porFilial = await readRaw(porFilialSql, [
      startISO,
      endISO, // despesas
      startISO,
      endISO, // vendas
    ]);

    // -----------------------------------
    // 8 — Top 10 despesas
    // -----------------------------------
    const topDespesasSql = `
      SELECT
        id_despesa,
        descricao,
        valor,
        data_despesa
      FROM despesas
      WHERE data_despesa BETWEEN ? AND ?
      ${despesasFilter}
      ORDER BY valor DESC
      LIMIT 10;
    `;
    const topDespesas = await readRaw(topDespesasSql, paramsDespesas);

    // -----------------------------------
    // 9 — Últimas despesas
    // -----------------------------------
    const ultimasDespesasSql = `
      SELECT
        id_despesa,
        descricao,
        valor,
        data_despesa
      FROM despesas
      WHERE data_despesa BETWEEN ? AND ?
      ${despesasFilter}
      ORDER ORDER BY data_despesa DESC
      LIMIT 15;
    `;
    const ultimasDespesas = await readRaw(
      ultimasDespesasSql,
      paramsDespesas
    );

    // -----------------------------------
    // 10 — Enviar resposta
    // -----------------------------------
    return res.status(200).json({
      mensagem: "Relatório financeiro consolidado gerado com sucesso",
      periodo: { dataInicio: startISO, dataFim: endISO },

      consolidado: {
        totalEntradas: Number(entradas?.total_entradas),
        totalSaidas: Number(despesas?.total_saidas),
        lucroLiquido: Number(lucroLiquido),

        pix: Number(entradas?.total_pix),
        dinheiro: Number(entradas?.total_dinheiro),
        cartao: Number(entradas?.total_cartao),
      },

      entradasPorDia,
      porFilial,
      topDespesas,
      ultimasDespesas,
    });
  } catch (error) {
    console.error("Erro relatorioFinanceiro:", error);
    return res.status(500).json({
      mensagem: "Erro ao gerar relatório financeiro",
      erro: error.message,
    });
  }
};


export const relatorioPorFilial = async (req, res) => {
  try {
    const { id_empresa, dataInicio, dataFim } = req.query;

    if (!id_empresa) {
      return res.status(400).json({
        mensagem: "É necessário informar id_empresa (filialId).",
      });
    }

    // -----------------------------------
    // 1 — Datas padrão (últimos 30 dias)
    // -----------------------------------
    const end = dataFim ? new Date(dataFim) : new Date();
    const start = dataInicio
      ? new Date(dataInicio)
      : new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);

    const startISO = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    )
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const endISO = new Date(
      end.getFullYear(),
      end.getMonth(),
      end.getDate() + 1
    )
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const params = [startISO, endISO, id_empresa];

    // -----------------------------------
    // 2 — Dados básicos da Filial
    // -----------------------------------
    const filialSql = `
      SELECT id_empresa, nome, status, cidade, estado
      FROM empresas
      WHERE id_empresa = ?;
    `;
    const [filial] = await readRaw(filialSql, [id_empresa]);

    if (!filial) {
      return res.status(404).json({ mensagem: "Filial não encontrada." });
    }

    // -----------------------------------
    // 3 — Resumo Financeiro
    // -----------------------------------
    const financeiroSql = `
      SELECT
        COUNT(*) AS total_vendas,
        COALESCE(SUM(v.total),0) AS faturamento,
        COALESCE(AVG(v.total),0) AS ticket_medio,
        SUM(CASE WHEN v.tipo_pagamento='pix' THEN v.total ELSE 0 END) AS total_pix,
        SUM(CASE WHEN v.tipo_pagamento='dinheiro' THEN v.total ELSE 0 END) AS total_dinheiro,
        SUM(CASE WHEN v.tipo_pagamento='cartão' THEN v.total ELSE 0 END) AS total_cartao
      FROM vendas v
      WHERE v.data_venda BETWEEN ? AND ?
        AND v.id_empresa = ?;
    `;
    const [financeiro] = await readRaw(financeiroSql, params);

    // -----------------------------------
    // 4 — Total de Saídas (Despesas)
    // -----------------------------------
    const despesasSql = `
      SELECT COALESCE(SUM(valor),0) AS total_saidas
      FROM despesas
      WHERE data_despesa BETWEEN ? AND ?
        AND id_empresa = ?;
    `;
    const [despesas] = await readRaw(despesasSql, params);

    // -----------------------------------
    // 5 — Vendas por Dia
    // -----------------------------------
    const vendasDiaSql = `
      SELECT
        DATE(v.data_venda) AS dia,
        COUNT(*) AS total_vendas,
        SUM(v.total) AS total
      FROM vendas v
      WHERE v.data_venda BETWEEN ? AND ?
        AND v.id_empresa = ?
      GROUP BY DATE(v.data_venda)
      ORDER BY dia ASC;
    `;
    const vendasPorDia = await readRaw(vendasDiaSql, params);

    // -----------------------------------
    // 6 — Produtos vendidos (Top 20)
    // -----------------------------------
    const produtosSql = `
      SELECT
        p.id_produto,
        p.nome,
        SUM(i.quantidade) AS quantidade_vendida,
        SUM(i.quantidade * i.preco_unitario) AS faturamento_produto
      FROM venda_itens i
      JOIN vendas v ON v.id_venda = i.id_venda
      JOIN produtos p ON p.id_produto = i.id_produto
      WHERE v.data_venda BETWEEN ? AND ?
        AND v.id_empresa = ?
      GROUP BY p.id_produto, p.nome
      ORDER BY quantidade_vendida DESC
      LIMIT 20;
    `;
    const produtosVendidos = await readRaw(produtosSql, params);

    // -----------------------------------
    // 7 — Estoque Resumido
    // -----------------------------------
    const estoqueSql = `
      SELECT
        COUNT(*) AS total_produtos,
        SUM(CASE WHEN quantidade <= 3 THEN 1 ELSE 0 END) AS produtos_baixos,
        SUM(CASE WHEN quantidade = 0 THEN 1 ELSE 0 END) AS ruptura
      FROM produtos
      WHERE id_empresa = ?;
    `;
    const [estoque] = await readRaw(estoqueSql, [id_empresa]);

    // -----------------------------------
    // 8 — Últimas vendas (limit 20)
    // -----------------------------------
    const ultimasVendasSql = `
      SELECT
        id_venda,
        total,
        tipo_pagamento,
        data_venda
      FROM vendas
      WHERE id_empresa = ?
      ORDER BY data_venda DESC
      LIMIT 20;
    `;
    const ultimasVendas = await readRaw(ultimasVendasSql, [id_empresa]);

    // -----------------------------------
    // 9 — Resposta final
    // -----------------------------------
    return res.status(200).json({
      mensagem: "Relatório da filial carregado com sucesso",
      periodo: { dataInicio: startISO, dataFim: endISO },

      filial,

      financeiro: {
        totalVendas: Number(financeiro.total_vendas),
        faturamento: Number(financeiro.faturamento),
        ticketMedio: Number(financeiro.ticket_medio),

        pagamentos: {
          pix: Number(financeiro.total_pix),
          dinheiro: Number(financeiro.total_dinheiro),
          cartao: Number(financeiro.total_cartao),
        },
      },

      despesas: {
        totalSaidas: Number(despesas.total_saidas),
        lucroLiquido:
          Number(financeiro.faturamento) - Number(despesas.total_saidas),
      },

      vendasPorDia,
      produtosVendidos,
      estoque,
      ultimasVendas,
    });
  } catch (error) {
    console.error("Erro relatorioPorFilial:", error);
    return res.status(500).json({
      mensagem: "Erro ao gerar relatório da filial",
      erro: error.message,
    });
  }
};


export const relatorioGeral = async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;

    // -----------------------------------
    // 1 — Datas padrão
    // -----------------------------------
    const end = dataFim ? new Date(dataFim) : new Date();
    const start = dataInicio
      ? new Date(dataInicio)
      : new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);

    const startISO = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    )
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const endISO = new Date(
      end.getFullYear(),
      end.getMonth(),
      end.getDate() + 1
    )
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const params = [startISO, endISO];

    // -----------------------------------
    // 2 — Dados gerais de empresas/filiais
    // -----------------------------------
    const empresasSql = `
      SELECT
        COUNT(*) AS total_filiais,
        SUM(CASE WHEN status = 'ativo' THEN 1 ELSE 0 END) AS filiais_ativas,
        SUM(CASE WHEN status = 'inativo' THEN 1 ELSE 0 END) AS filiais_inativas
      FROM empresas
      WHERE tipo = 'filial';
    `;
    const [empresasInfo] = await readRaw(empresasSql);

    // -----------------------------------
    // 3 — Resumo financeiro geral
    // -----------------------------------
    const financeiroSql = `
      SELECT
        COUNT(*) AS total_vendas,
        COALESCE(SUM(v.total),0) AS faturamento,
        COALESCE(AVG(v.total),0) AS ticket_medio
      FROM vendas v
      WHERE v.data_venda BETWEEN ? AND ?;
    `;
    const [financeiro] = await readRaw(financeiroSql, params);

    // Despesas gerais
    const despesasSql = `
      SELECT COALESCE(SUM(valor),0) AS total_saidas
      FROM despesas
      WHERE data_despesa BETWEEN ? AND ?;
    `;
    const [despesas] = await readRaw(despesasSql, params);

    const lucroGeral =
      Number(financeiro.faturamento) - Number(despesas.total_saidas);

    // -----------------------------------
    // 4 — Vendas por dia (para gráficos)
    // -----------------------------------
    const vendasDiaSql = `
      SELECT
        DATE(v.data_venda) AS dia,
        COUNT(*) AS total_vendas,
        SUM(v.total) AS total
      FROM vendas v
      WHERE v.data_venda BETWEEN ? AND ?
      GROUP BY DATE(v.data_venda)
      ORDER BY dia ASC;
    `;
    const vendasPorDia = await readRaw(vendasDiaSql, params);

    // -----------------------------------
    // 5 — Ranking por filial
    // -----------------------------------
    const rankingSql = `
      SELECT
        e.id_empresa,
        e.nome AS nome_filial,
        COUNT(v.id_venda) AS total_vendas,
        COALESCE(SUM(v.total),0) AS faturamento
      FROM empresas e
      LEFT JOIN vendas v
        ON v.id_empresa = e.id_empresa
       AND v.data_venda BETWEEN ? AND ?
      WHERE e.tipo = 'filial'
      GROUP BY e.id_empresa, e.nome
      ORDER BY faturamento DESC;
    `;
    const rankingFiliais = await readRaw(rankingSql, params);

    // -----------------------------------
    // 6 — Top produtos (global)
    // -----------------------------------
    const topProdutosSql = `
      SELECT
        p.id_produto,
        p.nome,
        SUM(i.quantidade) AS quantidade_vendida,
        SUM(i.quantidade * i.preco_unitario) AS faturamento_produto
      FROM venda_itens i
      JOIN vendas v ON v.id_venda = i.id_venda
      JOIN produtos p ON p.id_produto = i.id_produto
      WHERE v.data_venda BETWEEN ? AND ?
      GROUP BY p.id_produto, p.nome
      ORDER BY quantidade_vendida DESC
      LIMIT 10;
    `;
    const topProdutos = await readRaw(topProdutosSql, params);

    // -----------------------------------
    // 7 — Estoque global
    // -----------------------------------
    const estoqueSql = `
      SELECT
        COUNT(*) AS total_produtos,
        SUM(CASE WHEN quantidade <= 3 THEN 1 ELSE 0 END) AS produtos_baixos,
        SUM(CASE WHEN quantidade = 0 THEN 1 ELSE 0 END) AS ruptura
      FROM produtos;
    `;
    const [estoque] = await readRaw(estoqueSql);

    // -----------------------------------
    // 8 — Últimas vendas (global)
    // -----------------------------------
    const ultimasVendasSql = `
      SELECT
        id_venda,
        id_empresa,
        total,
        tipo_pagamento,
        data_venda
      FROM vendas
      ORDER BY data_venda DESC
      LIMIT 20;
    `;
    const ultimasVendas = await readRaw(ultimasVendasSql);

    // -----------------------------------
    // 9 — Top 10 despesas (global)
    // -----------------------------------
    const topDespesasSql = `
      SELECT
        id_despesa,
        descricao,
        valor,
        data_despesa
      FROM despesas
      WHERE data_despesa BETWEEN ? AND ?
      ORDER BY valor DESC
      LIMIT 10;
    `;
    const topDespesas = await readRaw(topDespesasSql, params);

    // -----------------------------------
    // 10 — Últimas despesas
    // -----------------------------------
    const ultimasDespesasSql = `
      SELECT
        id_despesa,
        descricao,
        valor,
        data_despesa
      FROM despesas
      ORDER BY data_despesa DESC
      LIMIT 15;
    `;
    const ultimasDespesas = await readRaw(ultimasDespesasSql);

    // -----------------------------------
    // 11 — RESPOSTA FINAL
    // -----------------------------------
    return res.status(200).json({
      mensagem: "Relatório geral carregado com sucesso.",
      periodo: { dataInicio: startISO, dataFim: endISO },

      empresas: empresasInfo,

      financeiro: {
        totalVendas: Number(financeiro.total_vendas),
        faturamento: Number(financeiro.faturamento),
        totalSaidas: Number(despesas.total_saidas),
        ticketMedio: Number(financeiro.ticket_medio),
        lucroGeral,
      },

      vendasPorDia,
      rankingFiliais,
      estoque,
      topProdutos,

      ultimasVendas,
      topDespesas,
      ultimasDespesas,
    });
  } catch (error) {
    console.error("Erro relatorioGeral:", error);
    return res.status(500).json({
      mensagem: "Erro ao gerar relatório geral",
      erro: error.message,
    });
  }
};

export const relatorioProdutos = async (req, res) => {
  try {
    const { dataInicio, dataFim, filialId } = req.query;

    // -----------------------------------
    // 1 — Datas padrão (últimos 30 dias)
    // -----------------------------------
    const end = dataFim ? new Date(dataFim) : new Date();
    const start = dataInicio
      ? new Date(dataInicio)
      : new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);

    const startISO = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    )
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const endISO = new Date(
      end.getFullYear(),
      end.getMonth(),
      end.getDate() + 1
    )
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    let filtroFilial = "";
    const params = [startISO, endISO];

    if (filialId) {
      filtroFilial = "AND v.id_empresa = ?";
      params.push(filialId);
    }

    // -----------------------------------
    // 2 — Resumo geral de produtos
    // -----------------------------------
    const resumoSql = `
      SELECT
        COUNT(*) AS total_produtos,
        SUM(CASE WHEN quantidade <= 3 THEN 1 ELSE 0 END) AS estoque_baixo,
        SUM(CASE WHEN quantidade = 0 THEN 1 ELSE 0 END) AS ruptura
      FROM produtos;
    `;
    const [resumo] = await readRaw(resumoSql);

    // -----------------------------------
    // 3 — Top 20 produtos mais vendidos
    // -----------------------------------
    const topProdutosSql = `
      SELECT
        p.id_produto,
        p.nome,
        SUM(i.quantidade) AS quantidade_vendida,
        SUM(i.quantidade * i.preco_unitario) AS faturamento_produto
      FROM venda_itens i
      JOIN vendas v ON v.id_venda = i.id_venda
      JOIN produtos p ON p.id_produto = i.id_produto
      WHERE v.data_venda BETWEEN ? AND ?
      ${filtroFilial}
      GROUP BY p.id_produto, p.nome
      ORDER BY quantidade_vendida DESC
      LIMIT 20;
    `;
    const topProdutos = await readRaw(topProdutosSql, params);

    // -----------------------------------
    // 4 — Produtos com estoque baixo
    // -----------------------------------
    const estoqueBaixoSql = `
      SELECT id_produto, nome, quantidade
      FROM produtos
      WHERE quantidade <= 3
      ORDER BY quantidade ASC;
    `;
    const produtosBaixoEstoque = await readRaw(estoqueBaixoSql);

    // -----------------------------------
    // 5 — Produtos em ruptura (zerados)
    // -----------------------------------
    const rupturaSql = `
      SELECT id_produto, nome, quantidade
      FROM produtos
      WHERE quantidade = 0;
    `;
    const produtosRuptura = await readRaw(rupturaSql);

    // -----------------------------------
    // 6 — Produtos que NÃO venderam no período
    // -----------------------------------
    const semVendaSql = `
      SELECT 
        p.id_produto,
        p.nome,
        p.quantidade
      FROM produtos p
      LEFT JOIN (
        SELECT DISTINCT i.id_produto
        FROM venda_itens i
        JOIN vendas v ON v.id_venda = i.id_venda
        WHERE v.data_venda BETWEEN ? AND ?
        ${filtroFilial}
      ) AS vendidos ON vendidos.id_produto = p.id_produto
      WHERE vendidos.id_produto IS NULL;
    `;
    const produtosSemVenda = await readRaw(semVendaSql, params);

    // -----------------------------------
    // 7 — Estoque por filial (resumo)
    // -----------------------------------
    const estoqueFilialSql = `
      SELECT
        e.id_empresa,
        e.nome AS nome_filial,
        COUNT(p.id_produto) AS total_produtos,
        SUM(CASE WHEN p.quantidade <= 3 THEN 1 ELSE 0 END) AS estoque_baixo,
        SUM(CASE WHEN p.quantidade = 0 THEN 1 ELSE 0 END) AS ruptura
      FROM empresas e
      LEFT JOIN produtos p ON p.id_empresa = e.id_empresa
      WHERE e.tipo = 'filial'
      GROUP BY e.id_empresa, e.nome
      ORDER BY e.nome ASC;
    `;

    const estoquePorFilial = await readRaw(estoqueFilialSql);

    // -----------------------------------
    // 8 — Gráfico geral por produto (total vendido por dia)
    // -----------------------------------
    const vendasPorProdutoDiaSql = `
      SELECT
        p.id_produto,
        p.nome,
        DATE(v.data_venda) AS dia,
        SUM(i.quantidade) AS quantidade_vendida
      FROM venda_itens i
      JOIN produtos p ON p.id_produto = i.id_produto
      JOIN vendas v ON v.id_venda = i.id_venda
      WHERE v.data_venda BETWEEN ? AND ?
      ${filtroFilial}
      GROUP BY p.id_produto, DATE(v.data_venda)
      ORDER BY p.id_produto, dia;
    `;

    const vendasPorProdutoDia = await readRaw(vendasPorProdutoDiaSql, params);

    // -----------------------------------
    // 9 — Resposta final
    // -----------------------------------
    return res.status(200).json({
      mensagem: "Relatório de produtos gerado com sucesso.",
      periodo: { dataInicio: startISO, dataFim: endISO },

      resumo: {
        totalProdutos: Number(resumo.total_produtos),
        estoqueBaixo: Number(resumo.estoque_baixo),
        ruptura: Number(resumo.ruptura),
      },

      topProdutos,
      produtosBaixoEstoque,
      produtosRuptura,
      produtosSemVenda,
      estoquePorFilial,
      vendasPorProdutoDia,
    });
  } catch (error) {
    console.error("Erro relatorioProdutos:", error);
    return res.status(500).json({
      mensagem: "Erro ao gerar relatório de produtos",
      erro: error.message,
    });
  }
};