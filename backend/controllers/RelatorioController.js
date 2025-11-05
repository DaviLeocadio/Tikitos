import { gerarRelatorioFinanceiroGerente } from "../models/Relatorio.js";
import { listarVendas } from "../models/Venda.js";

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

    //Buscar dados dos gastos

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

      console.log(vendas)
    }
    
    relatorio = relatorio.filter(linha => (parseFloat(linha.total_vendas) !== 0));

    relatorio = relatorio.map((linha) => {
      const mediaPorVenda = parseFloat(linha.media_por_venda).toFixed(2);
      return {
        ...linha,
        media_por_venda: mediaPorVenda
      }
      
    });
    
    let retorno = {};
    retorno.resumo = relatorio;
    if(vendas) retorno.vendas = vendas;

    console.log(retorno)
    return res.status(200).json({
      mensagem: "Relatório financeiro para gerente realizado com sucesso",
      retorno
    });
  } catch (err) {
    console.error("Erro ao gerar relatório para gerente: ", err);
    res.status(500).json({ mensagem: "Erro ao gerar relatório para gerente" });
  }
};

export { gerarRelatorioGerenteController };
