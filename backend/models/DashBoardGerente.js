import { readRaw } from "../config/database.js";

// Obter resumo de vendas do período
const obterResumoVendas = async (idEmpresa, periodo) => {
  try {
    let whereData = "";
    const hoje = new Date();
    
    switch (periodo) {
      case "hoje":
        whereData = `DATE(data_venda) = CURDATE()`;
        break;
      case "semana":
        whereData = `YEARWEEK(data_venda, 1) = YEARWEEK(CURDATE(), 1)`;
        break;
      case "mes":
        whereData = `MONTH(data_venda) = MONTH(CURDATE()) AND YEAR(data_venda) = YEAR(CURDATE())`;
        break;
      case "ano":
        whereData = `YEAR(data_venda) = YEAR(CURDATE())`;
        break;
      default:
        whereData = `MONTH(data_venda) = MONTH(CURDATE()) AND YEAR(data_venda) = YEAR(CURDATE())`;
    }

    const sql = `
      SELECT 
        COUNT(*) as total_vendas,
        COALESCE(SUM(total), 0) as valor_total,
        COALESCE(SUM(CASE WHEN tipo_pagamento = 'pix' THEN total ELSE 0 END), 0) as total_pix,
        COALESCE(SUM(CASE WHEN tipo_pagamento = 'dinheiro' THEN total ELSE 0 END), 0) as total_dinheiro,
        COALESCE(SUM(CASE WHEN tipo_pagamento = 'cartao' THEN total ELSE 0 END), 0) as total_cartao
      FROM vendas
      WHERE id_empresa = ? AND ${whereData}
    `;

    const resultado = await readRaw(sql, [idEmpresa]);
    return resultado[0];
  } catch (err) {
    console.error("Erro ao obter resumo de vendas:", err);
    throw err;
  }
};

// Obter total de produtos vendidos no período
const obterProdutosVendidos = async (idEmpresa, periodo) => {
  try {
    let whereData = "";
    
    switch (periodo) {
      case "hoje":
        whereData = `DATE(v.data_venda) = CURDATE()`;
        break;
      case "semana":
        whereData = `YEARWEEK(v.data_venda, 1) = YEARWEEK(CURDATE(), 1)`;
        break;
      case "mes":
        whereData = `MONTH(v.data_venda) = MONTH(CURDATE()) AND YEAR(v.data_venda) = YEAR(CURDATE())`;
        break;
      case "ano":
        whereData = `YEAR(v.data_venda) = YEAR(CURDATE())`;
        break;
      default:
        whereData = `MONTH(v.data_venda) = MONTH(CURDATE()) AND YEAR(v.data_venda) = YEAR(CURDATE())`;
    }

    const sql = `
      SELECT 
        COALESCE(SUM(vi.quantidade), 0) as quantidade_total
      FROM venda_itens vi
      INNER JOIN vendas v ON vi.id_venda = v.id_venda
      WHERE v.id_empresa = ? AND ${whereData}
    `;

    const resultado = await readRaw(sql, [idEmpresa]);
    return resultado[0];
  } catch (err) {
    console.error("Erro ao obter produtos vendidos:", err);
    throw err;
  }
};

// Obter vendedores ativos
const obterVendedoresAtivos = async (idEmpresa) => {
  try {
    const sql = `
      SELECT COUNT(DISTINCT id_usuario) as total_ativos
      FROM usuarios
      WHERE id_empresa = ? AND perfil = 'vendedor' AND status = 'ativo'
    `;

    const resultado = await readRaw(sql, [idEmpresa]);
    return resultado[0];
  } catch (err) {
    console.error("Erro ao obter vendedores ativos:", err);
    throw err;
  }
};

// Obter melhor vendedor do período
const obterMelhorVendedor = async (idEmpresa, periodo) => {
  try {
    let whereData = "";
    
    switch (periodo) {
      case "hoje":
        whereData = `DATE(v.data_venda) = CURDATE()`;
        break;
      case "semana":
        whereData = `YEARWEEK(v.data_venda, 1) = YEARWEEK(CURDATE(), 1)`;
        break;
      case "mes":
        whereData = `MONTH(v.data_venda) = MONTH(CURDATE()) AND YEAR(v.data_venda) = YEAR(CURDATE())`;
        break;
      case "ano":
        whereData = `YEAR(v.data_venda) = YEAR(CURDATE())`;
        break;
      default:
        whereData = `MONTH(v.data_venda) = MONTH(CURDATE()) AND YEAR(v.data_venda) = YEAR(CURDATE())`;
    }

    const sql = `
      SELECT 
        u.nome,
        COUNT(v.id_venda) as total_vendas,
        SUM(v.total) as valor_total
      FROM vendas v
      INNER JOIN usuarios u ON v.id_usuario = u.id_usuario
      WHERE v.id_empresa = ? AND ${whereData}
      GROUP BY v.id_usuario, u.nome
      ORDER BY valor_total DESC
      LIMIT 1
    `;

    const resultado = await readRaw(sql, [idEmpresa]);
    return resultado[0] || { nome: "Nenhum", total_vendas: 0, valor_total: 0 };
  } catch (err) {
    console.error("Erro ao obter melhor vendedor:", err);
    throw err;
  }
};

// Obter fluxo de caixa do período
const obterFluxoCaixa = async (idEmpresa, periodo) => {
  try {
    let whereDataVendas = "";
    let whereDataDespesas = "";
    
    switch (periodo) {
      case "hoje":
        whereDataVendas = `DATE(data_venda) = CURDATE()`;
        whereDataDespesas = `DATE(data_pag) = CURDATE()`;
        break;
      case "semana":
        whereDataVendas = `YEARWEEK(data_venda, 1) = YEARWEEK(CURDATE(), 1)`;
        whereDataDespesas = `YEARWEEK(data_pag, 1) = YEARWEEK(CURDATE(), 1)`;
        break;
      case "mes":
        whereDataVendas = `MONTH(data_venda) = MONTH(CURDATE()) AND YEAR(data_venda) = YEAR(CURDATE())`;
        whereDataDespesas = `MONTH(data_pag) = MONTH(CURDATE()) AND YEAR(data_pag) = YEAR(CURDATE())`;
        break;
      case "ano":
        whereDataVendas = `YEAR(data_venda) = YEAR(CURDATE())`;
        whereDataDespesas = `YEAR(data_pag) = YEAR(CURDATE())`;
        break;
      default:
        whereDataVendas = `MONTH(data_venda) = MONTH(CURDATE()) AND YEAR(data_venda) = YEAR(CURDATE())`;
        whereDataDespesas = `MONTH(data_pag) = MONTH(CURDATE()) AND YEAR(data_pag) = YEAR(CURDATE())`;
    }

    // Entradas (vendas)
    const sqlEntradas = `
      SELECT COALESCE(SUM(total), 0) as entradas
      FROM vendas
      WHERE id_empresa = ? AND ${whereDataVendas}
    `;

    // Saídas (despesas) - coluna correta é 'preco'
    const sqlSaidas = `
      SELECT COALESCE(SUM(preco), 0) as saidas
      FROM despesas
      WHERE id_empresa = ? AND ${whereDataDespesas} AND status = 'pago'
    `;

    const entradas = await readRaw(sqlEntradas, [idEmpresa]);
    const saidas = await readRaw(sqlSaidas, [idEmpresa]);

    return {
      entradas: entradas[0].entradas,
      saidas: saidas[0].saidas,
      saldo: entradas[0].entradas - saidas[0].saidas
    };
  } catch (err) {
    console.error("Erro ao obter fluxo de caixa:", err);
    throw err;
  }
};

// Calcular trend comparando com período anterior
const calcularTrend = async (idEmpresa, periodo) => {
  try {
    let wherePeriodoAtual = "";
    let wherePeriodoAnterior = "";
    
    switch (periodo) {
      case "hoje":
        wherePeriodoAtual = `DATE(data_venda) = CURDATE()`;
        wherePeriodoAnterior = `DATE(data_venda) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)`;
        break;
      case "semana":
        wherePeriodoAtual = `YEARWEEK(data_venda, 1) = YEARWEEK(CURDATE(), 1)`;
        wherePeriodoAnterior = `YEARWEEK(data_venda, 1) = YEARWEEK(DATE_SUB(CURDATE(), INTERVAL 1 WEEK), 1)`;
        break;
      case "mes":
        wherePeriodoAtual = `MONTH(data_venda) = MONTH(CURDATE()) AND YEAR(data_venda) = YEAR(CURDATE())`;
        wherePeriodoAnterior = `MONTH(data_venda) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) AND YEAR(data_venda) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))`;
        break;
      case "ano":
        wherePeriodoAtual = `YEAR(data_venda) = YEAR(CURDATE())`;
        wherePeriodoAnterior = `YEAR(data_venda) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 YEAR))`;
        break;
      default:
        wherePeriodoAtual = `MONTH(data_venda) = MONTH(CURDATE()) AND YEAR(data_venda) = YEAR(CURDATE())`;
        wherePeriodoAnterior = `MONTH(data_venda) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) AND YEAR(data_venda) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))`;
    }

    const sql = `
      SELECT 
        SUM(CASE WHEN ${wherePeriodoAtual} THEN total ELSE 0 END) as atual,
        SUM(CASE WHEN ${wherePeriodoAnterior} THEN total ELSE 0 END) as anterior
      FROM vendas
      WHERE id_empresa = ?
    `;

    const resultado = await readRaw(sql, [idEmpresa]);
    const { atual, anterior } = resultado[0];

    if (anterior === 0) return { direction: "up", percentage: 0 };

    const percentual = ((atual - anterior) / anterior) * 100;
    
    return {
      direction: percentual >= 0 ? "up" : "down",
      percentage: Math.abs(percentual).toFixed(1)
    };
  } catch (err) {
    console.error("Erro ao calcular trend:", err);
    throw err;
  }
};

export {
  obterResumoVendas,
  obterProdutosVendidos,
  obterVendedoresAtivos,
  obterMelhorVendedor,
  obterFluxoCaixa,
  calcularTrend
};