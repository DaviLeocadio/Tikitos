import { listarDespesas } from "../models/Despesas.js";
import {
  gerarRelatorioFinanceiroGerente,
  gerarRelatorioVendasAdmin,
} from "../models/Relatorio.js";
import { listarVendas } from "../models/Venda.js";
import { listarEmpresas } from "../models/Empresa.js";
import { listarItensVenda } from "../models/ItensVenda.js";
import { listarProdutos } from "../models/Produto.js";

const gerarRelatorioGerenteController = async (req, res) => {
  try {
    const { inicio, fim, idCaixa, pagamento, detalhado } = req.query;
    const idEmpresa = req.usuarioEmpresa;

    let relatorio = await gerarRelatorioFinanceiroGerente(
      idEmpresa,
      inicio || null,
      fim || null,
      idCaixa || null
    );

    // Filtrar gastos pelo intervalo de datas, se informado
    let gastosWhere = `id_empresa = ${idEmpresa}`;
    if (inicio && fim) {
      // Usamos >= inicio e < fim (o frontend já costuma enviar fim+1 quando necessário)
      gastosWhere += ` AND DATE(data_adicionado) >= '${inicio}' AND DATE(data_adicionado) < '${fim}'`;
    }
    const gastos = await listarDespesas(gastosWhere);

    if (pagamento) {
      const filtroQuantidade = `quantidade_${pagamento}`;
      const filtroValor = `valor_${pagamento}`;

      relatorio = relatorio.map((linha) => ({
        data: linha.data,
        total_vendas: linha[filtroQuantidade],
        saldo_total: linha[filtroValor],
        media_por_venda:
          linha[filtroQuantidade] > 0
            ? linha[filtroValor] / linha[filtroQuantidade]
            : 0,
      }));
    }

    let vendas = null;

    if (detalhado) {
      let conditions = [];
      conditions.push(`id_empresa = ${idEmpresa}`);
      if (inicio && fim) {
        // Use >= inicio e < fim para evitar problemas com inclusividade
        conditions.push(
          `DATE(data_venda) >= '${inicio}' AND DATE(data_venda) < '${fim}'`
        );
      }
      if (pagamento) conditions.push(`tipo_pagamento = '${pagamento}'`);

      const query = conditions.join(" AND ");

      vendas = await listarVendas(query + " ORDER BY data_venda DESC");

      // Se detalhado, anexar itens de cada venda e enriquecer com dados do produto
      try {
        const produtosListados = await listarProdutos();

        const vendasComItens = await Promise.all(
          vendas.map(async (v) => {
            const itens = await listarItensVenda(`id_venda = ${v.id_venda}`);
            const itensEnriquecidos = (itens || []).map((it) => {
              const produto = produtosListados.find(
                (p) => p.id_produto == it.id_produto
              );
              return {
                ...it,
                produto: produto || null,
              };
            });
            return {
              ...v,
              itens: itensEnriquecidos,
            };
          })
        );

        vendas = vendasComItens;
      } catch (errEnriq) {
        console.error("[RELATORIO] erro ao enriquecer vendas com itens/produtos:", errEnriq);
        // Em caso de erro, mantemos `vendas` sem itens para não quebrar a resposta
      }
    }

    relatorio = relatorio.filter(
      (linha) => parseFloat(linha.total_vendas) !== 0
    );

    relatorio = relatorio.map((linha) => {
      const mediaPorVenda = parseFloat(linha.media_por_venda).toFixed(2);
      return {
        ...linha,
        media_por_venda: mediaPorVenda,
      };
    });

    // Calcular totais no backend: total vendas, faturamento (saldo_total), total gastos e saldo líquido
    const totalVendas = relatorio.reduce((acc, l) => {
      const val = Number(l.total_vendas);
      if (Number.isNaN(val)) {
        console.log("[RELATORIO DEBUG] total_vendas NaN for entry:", l);
      }
      return acc + (Number(l.total_vendas) || 0);
    }, 0);

    const totalFaturamento = relatorio.reduce((acc, l) => {
      const val = Number(l.saldo_total);
      if (Number.isNaN(val)) {
        console.log("[RELATORIO DEBUG] saldo_total NaN for entry:", l);
      }
      return acc + (Number(l.saldo_total) || 0);
    }, 0);

    const totalGastos = gastos.reduce((acc, g) => {
      const val = Number(g.preco);
      if (Number.isNaN(val)) {
        console.log("[RELATORIO DEBUG] gasto.preco NaN for entry:", g);
      }
      return acc + (Number(g.preco) || 0);
    }, 0);

    const saldoLiquido = totalFaturamento - totalGastos;

    let retorno = {};
    retorno.totais = {
      totalVendas,
      totalFaturamento,
      totalGastos,
      saldoLiquido,
    };
    retorno.resumo = relatorio;
    retorno.gastos = gastos;
    if (vendas) retorno.vendas = vendas;

    return res.status(200).json({
      mensagem: "Relatório financeiro para gerente realizado com sucesso",
      retorno,
    });
  } catch (err) {
    console.error("Erro ao gerar relatório para gerente: ", err);
    res.status(500).json({ mensagem: "Erro ao gerar relatório para gerente" });
  }
};

const gerarRelatorioFiliaisController = async (req, res) => {
  try {
    const empresasListadas = await listarEmpresas();
    const vendasListadas = await listarVendas();
    const itensListados = await listarItensVenda();
    const produtosListados = await listarProdutos();

    const retorno = empresasListadas.map((empresa) => {
      const vendasEmpresa = vendasListadas.filter(
        (venda) => venda.id_empresa == empresa.id_empresa
      );

      const totalValorVendas = vendasEmpresa.reduce(
        (acumulador, venda) => parseFloat(acumulador) + parseFloat(venda.total),
        0
      );

      const produtosVendidos = vendasEmpresa.flatMap((venda) =>
        itensListados.filter((produto) => produto.id_venda === venda.id_venda)
      );

      const produtos = produtosVendidos.flatMap((produtoVenda) =>
        produtosListados.filter(
          (produto) => produto.id_produto === produtoVenda.id_produto
        )
      );

      return {
        empresaId: empresa.id_empresa,
        totalVendas: vendasEmpresa.length,
        totalProdutosVendidos: produtosVendidos.length,
        vendas: vendasEmpresa,
        total: totalValorVendas.toFixed(2),
        produtos: produtos,
        status: empresa.status,
      };
    });

    res
      .status(200)
      .json({ mensagem: "Relatorio das filiais gerado com sucesso", retorno });
  } catch (err) {
    console.error("Erro ao gerar relatório sobre as filiais: ", err);
    return res
      .status(500)
      .json({ mensagem: "Erro ao gerar relatório sobre filiais" });
  }
};

const relatorioVendasGeralController = async (req, res) => {
  try {
    const { inicio, fim, idEmpresa, idVendedor } = req.query;

    if (!inicio || !fim)
      return res
        .status(404)
        .json({ error: "Data de início e fim são parâmetros obrigatórios" });

    let whereClause = `data_venda BETWEEN '${inicio}' AND '${fim}'`;
    if (idEmpresa) whereClause += ` AND id_empresa = ${idEmpresa}`;
    if (idVendedor) whereClause += ` AND id_usuario = ${idVendedor}`;

    const vendas = await listarVendas(whereClause);

    const relatorio = await gerarRelatorioVendasAdmin(
      inicio,
      fim,
      idEmpresa,
      idVendedor
    );

    const relatorioVendas = {
      relatorio,
      vendas,
    };

    return res.status(200).json({
      mensagem: "Relatório de vendas gerado com sucesso",
      relatorioVendas,
    });
  } catch (err) {
    console.error("Erro ao gerar relatório de vendas: ", err);
    return res
      .status(500)
      .json({ mensagem: "Erro ao gerar relatório de vendas" });
  }
};

export {
  gerarRelatorioGerenteController,
  gerarRelatorioFiliaisController,
  relatorioVendasGeralController,
};