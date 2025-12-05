import { readAll, read, create, update, readRaw } from "../config/database.js";

const AbrirCaixa = async (caixaData) => {
  try {
    return await create("caixa", caixaData);
  } catch (err) {
    console.error("Erro ao abrir caixa: ", err);
    throw err;
  }
};

const LerCaixaPorVendedor = async (idVendedor) => {
  try {
    return await read(
      "caixa",
      `id_usuario = ${idVendedor} ORDER BY abertura ASC`
    );
  } catch (err) {
    console.error("Erro ao ler caixa por vendedor: ", err);
    throw err;
  }
};

const CaixaAbertoVendedor = async (idVendedor) => {
  try {
    return await read(
      "caixa",
      `id_usuario = ${idVendedor} AND status = 'aberto'`
    );
  } catch (err) {
    console.error("Erro ao ler caixa por vendedor: ", err);
    throw err;
  }
};

const AtualizarCaixa = async (idCaixa, caixaData) => {
  try {
    return await update("caixa", caixaData, `id_caixa = ${idCaixa}`);
  } catch (err) {
    console.error("Erro ao atualizar caixa: ", err);
    throw err;
  }
};

const FecharCaixa = async (caixaData, idCaixa) => {
  try {
    return await update("caixa", caixaData, `id_caixa = ${idCaixa}`);
  } catch (err) {
    console.error("Erro ao fechar caixa: ", err);
    throw err;
  }
};

const ListarCaixasPorEmpresa = async (idEmpresa, dataCaixa = null) => {
  try {
    return await readAll(
      "caixa",
      `id_empresa = ${idEmpresa} ${
        dataCaixa ? `AND DATE(abertura) = '${dataCaixa}'` : ""
      }`
    );
  } catch (err) {
    console.error("Erro ao listar caixas por empresa: ", err);
    throw err;
  }
};

const RelatorioCaixa = async (idEmpresa) => {
  try {
    const sql = `
    SELECT
    DATE(abertura) as data,
      SUM(valor_final - valor_inicial) AS valor_total,
      COUNT(*) AS caixas
      FROM caixa
      WHERE id_empresa = ?
      GROUP BY DATE(abertura)
      ORDER BY data;
    `;
    return await readRaw(sql, [idEmpresa]);
  } catch (err) {
    console.error("Erro ao listar caixas por empresa: ", err);
    throw err;
  }
};

const RelatorioCaixaIntervalo = async (idEmpresa, dataInicio, dataFim) => {
  try {
    // Use full-day datetime range to avoid DATE(...) timezone/truncation issues
    const sql = `
    SELECT
      DATE(abertura) as data,
      SUM(valor_final - valor_inicial) AS valor_total,
      COUNT(*) AS caixas
    FROM caixa
    WHERE id_empresa = ? AND abertura BETWEEN ? AND ?
    GROUP BY DATE(abertura)
    ORDER BY data;
    `;
    const start = `${dataInicio} 00:00:00`;
    const end = `${dataFim} 23:59:59`;
    return await readRaw(sql, [idEmpresa, start, end]);
  } catch (err) {
    console.error("Erro ao listar caixas por intervalo: ", err);
    throw err;
  }
};

const obterCaixaPorId = async (idCaixa) => {
  try {
    return await read("caixa", `id_caixa = ${idCaixa}`);
  } catch (error) {
    console.error("Erro ao obter caixa por ID: ", error);
    throw error;
  }
};

const resumoVendasCaixa = async (idCaixa) => {
  try {
    const sql = `
    SELECT
	    COUNT(*) AS total_vendas,
      SUM(total) AS saldo_total,
      SUM(CASE WHEN tipo_pagamento = 'pix' THEN 1 ELSE 0 END) AS total_pix,
      SUM(CASE WHEN tipo_pagamento = 'dinheiro' THEN 1 ELSE 0 END) AS total_dinheiro,
      SUM(CASE WHEN tipo_pagamento = 'cartao' THEN 1 ELSE 0 END) AS total_cartao
    FROM vendas
    WHERE id_caixa = ?;`;
    return await readRaw(sql, [idCaixa]);
  } catch (err) {
    console.error("Erro ao obter resumo do caixa: ", err);
    throw err;
  }
}

const listarCaixa = async ()=>{
  try {
    return await readAll("caixa");
  } catch (err) {
    console.error("Erro ao obter listagem do caixa: ", err);
    throw err;
  }
}
export {
  AbrirCaixa,
  LerCaixaPorVendedor,
  FecharCaixa,
  AtualizarCaixa,
  ListarCaixasPorEmpresa,
  RelatorioCaixa,
  RelatorioCaixaIntervalo,
  obterCaixaPorId,
  resumoVendasCaixa,
  CaixaAbertoVendedor,
  listarCaixa
}
