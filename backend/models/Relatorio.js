import { readRaw } from "../config/database.js";

const gerarRelatorioFinanceiroGerente = async (
  idEmpresa,
  dataInicio = null,
  dataFim = null,
  idCaixa = null
) => {
  try {
    let sql = `
    SELECT 
	    DATE(data_venda) AS data,
	    COUNT(*) AS total_vendas,
        SUM(total) AS saldo_total,
        AVG(total) AS media_por_venda,
        SUM(CASE WHEN tipo_pagamento = 'pix' THEN 1 ELSE 0 END) AS quantidade_pix,
	    SUM(CASE WHEN tipo_pagamento = 'dinheiro' THEN 1 ELSE 0 END) AS quantidade_dinheiro,
	    SUM(CASE WHEN tipo_pagamento = 'cartao' THEN 1 ELSE 0 END) AS quantidade_cartao,
	    SUM(CASE WHEN tipo_pagamento = 'pix' THEN total ELSE 0 END) AS valor_pix,
	    SUM(CASE WHEN tipo_pagamento = 'dinheiro' THEN total ELSE 0 END) AS valor_dinheiro,
	    SUM(CASE WHEN tipo_pagamento = 'cartao' THEN total ELSE 0 END) AS valor_cartao
    FROM vendas
    WHERE id_empresa = ?
    `;
    let params = [idEmpresa];

    if (dataInicio && dataFim) {
      sql += ` AND DATE(data_venda) BETWEEN ? AND ? `;
      params.push(dataInicio, dataFim);
    }

    if (idCaixa) {
      sql += ` AND id_caixa = ? `;
      params.push(idCaixa);
    }

    sql += ` GROUP BY DATE(data_venda) ORDER BY DATE(data_venda);
    `;

    return await readRaw(sql, params);
  } catch (err) {
    console.error("Erro ao gerar relatório financeiro: ", err);
    throw err;
  }
};

const gerarRelatorioVendasAdmin = async (
  dataInicio,
  dataFim,
  idEmpresa = null,
  idVendedor = null
) => {
  try {
    let sql = `
    SELECT 
	    DATE(data_venda) AS data,
	    COUNT(*) AS total_vendas,
        SUM(total) AS saldo_total,
        AVG(total) AS media_por_venda,
        SUM(CASE WHEN tipo_pagamento = 'pix' THEN 1 ELSE 0 END) AS quantidade_pix,
	    SUM(CASE WHEN tipo_pagamento = 'dinheiro' THEN 1 ELSE 0 END) AS quantidade_dinheiro,
	    SUM(CASE WHEN tipo_pagamento = 'cartao' THEN 1 ELSE 0 END) AS quantidade_cartao,
	    SUM(CASE WHEN tipo_pagamento = 'pix' THEN total ELSE 0 END) AS valor_pix,
	    SUM(CASE WHEN tipo_pagamento = 'dinheiro' THEN total ELSE 0 END) AS valor_dinheiro,
	    SUM(CASE WHEN tipo_pagamento = 'cartao' THEN total ELSE 0 END) AS valor_cartao
    FROM vendas
    WHERE DATE(data_venda) BETWEEN ? AND ? 
    `;
    let params = [dataInicio, dataFim];

    if (idEmpresa) {
      sql += ` AND id_empresa = ? `;
      params.push(idEmpresa);
    }

    if (idVendedor) {
      sql += ` AND id_usuario = ? `;
      params.push(idVendedor);
    }


    sql += ` GROUP BY DATE(data_venda) ORDER BY DATE(data_venda);`;

    return await readRaw(sql, params);
  } catch (error) {
    console.error("Erro ao gerar relatório de vendas: ", err);
    throw err;
  }
};

export { gerarRelatorioFinanceiroGerente, gerarRelatorioVendasAdmin };
