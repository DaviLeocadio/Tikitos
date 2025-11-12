import { listarDespesas } from "../models/Despesas.js";
import {
  gerarRelatorioFinanceiroGerente,
  gerarRelatorioVendasAdmin,
} from "../models/Relatorio.js";
import { listarVendas } from "../models/Venda.js";
import { listarEmpresas } from "../models/Empresa.js";
import { listarItensVenda } from "../models/ItensVenda.js";

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

    const gastos = await listarDespesas(`id_empresa = ${idEmpresa}`);

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
      if (inicio && fim)
        conditions.push(`DATE(data_venda) BETWEEN '${inicio}' AND ${fim}`);
      if (pagamento) conditions.push(`tipo_pagamento = '${pagamento}'`);

      const query = conditions.join(" AND ");

      vendas = await listarVendas(query);

      console.log(vendas);
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

    let retorno = {};
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

    const retorno = empresasListadas.map((empresa) => {
      const vendasEmpresa = vendasListadas.filter(
        (venda) => venda.id_empresa == empresa.id_empresa
      );

      const produtosVendidos = vendasEmpresa.flatMap((venda) =>
        itensListados.filter((produto) => produto.id_venda === venda.id_venda)
      );
      return {
        empresaId: empresa.id_empresa,
        totalVendas: vendasEmpresa.length,
        totalProdutosVendidos: produtosVendidos.length,
        vendas: vendasEmpresa,
        produtos: produtosVendidos,
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

    if(!inicio || !fim) return res.status(404).json({error: 'Data de início e fim são parâmetros obrigatórios'})

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
