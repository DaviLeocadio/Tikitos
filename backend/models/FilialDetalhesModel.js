import { readRaw, read } from "../config/database.js";

const getLojaById = async (idEmpresa) => {
  try {
    const loja = await read("empresas", `id_empresa = ${idEmpresa}`);
    return loja;
  } catch (err) {
    console.error("Erro em getLojaById:", err);
    throw err;
  }
};

const getGerenteByLoja = async (idEmpresa) => {
  try {
    const rows = await readRaw(
      `SELECT id_usuario, nome, email, telefone FROM usuarios WHERE perfil = 'gerente' AND id_empresa = ? LIMIT 1`,
      [idEmpresa]
    );
    return rows[0] || null;
  } catch (err) {
    console.error("Erro em getGerenteByLoja:", err);
    throw err;
  }
};

const getVendedoresByLoja = async (idEmpresa) => {
  try {
    const rows = await readRaw(
      `SELECT id_usuario, nome FROM usuarios WHERE perfil = 'vendedor' AND id_empresa = ? ORDER BY nome`,
      [idEmpresa]
    );
    return rows;
  } catch (err) {
    console.error("Erro em getVendedoresByLoja:", err);
    throw err;
  }
};

const getResumoFinanceiro = async (idEmpresa, dataInicio, dataFim) => {
  try {
    const vendasResumo = await readRaw(
      `SELECT COUNT(id_venda) AS total_vendas, COALESCE(SUM(total),0) AS faturamento FROM vendas WHERE id_empresa = ? AND DATE(data_venda) BETWEEN ? AND ?`,
      [idEmpresa, dataInicio, dataFim]
    );

    const ultimaVendaRows = await readRaw(
      `SELECT data_venda FROM vendas WHERE id_empresa = ? ORDER BY data_venda DESC LIMIT 1`,
      [idEmpresa]
    );

    const totalVendas = Number(vendasResumo[0]?.total_vendas || 0);
    const faturamento = Number(vendasResumo[0]?.faturamento || 0);
    const ticketMedio = totalVendas > 0 ? faturamento / totalVendas : 0;

    return {
      faturamento_mes: faturamento,
      total_vendas_mes: totalVendas,
      ticket_medio: ticketMedio,
      ultima_venda: ultimaVendaRows[0]?.data_venda || null,
    };
  } catch (err) {
    console.error("Erro em getResumoFinanceiro:", err);
    throw err;
  }
};

const getEstoqueResumo = async (idEmpresa) => {
  try {
    const resumo = await readRaw(
      `SELECT COUNT(*) AS total_itens, SUM(CASE WHEN estoque <= 5 THEN 1 ELSE 0 END) AS produtos_criticos FROM produto_loja WHERE id_empresa = ?`,
      [idEmpresa]
    );

    const produtos = await readRaw(
      `SELECT pl.id_produto, p.nome, pl.estoque as quantidade FROM produto_loja pl INNER JOIN produtos p ON pl.id_produto = p.id_produto WHERE pl.id_empresa = ? AND pl.estoque <= 5 ORDER BY pl.estoque ASC LIMIT 20`,
      [idEmpresa]
    );

    return {
      estoque_status: resumo[0] && Number(resumo[0].produtos_criticos) > 0 ? "ALERTA" : "OK",
      total_itens: Number(resumo[0]?.total_itens || 0),
      produtos_criticos: Number(resumo[0]?.produtos_criticos || 0),
      produtos: produtos || [],
    };
  } catch (err) {
    console.error("Erro em getEstoqueResumo:", err);
    throw err;
  }
};

const getUltimasVendas = async (idEmpresa, limit = 5) => {
  try {
    const rows = await readRaw(
      `SELECT v.id_venda, v.data_venda, v.total, u.nome AS vendedor FROM vendas v INNER JOIN usuarios u ON v.id_usuario = u.id_usuario WHERE v.id_empresa = ? ORDER BY v.data_venda DESC LIMIT ?`,
      [idEmpresa, Number(limit)]
    );
    return rows || [];
  } catch (err) {
    console.error("Erro em getUltimasVendas:", err);
    throw err;
  }
};

const getCaixaResumo = async (idEmpresa, limit = 5) => {
  try {
    const aberturas = await readRaw(
      `SELECT abertura as data, valor_inicial as valor FROM caixa WHERE id_empresa = ? ORDER BY abertura DESC LIMIT ?`,
      [idEmpresa, Number(limit)]
    );

    const fechamentos = await readRaw(
      `SELECT fechamento as data, valor_final as valor FROM caixa WHERE id_empresa = ? AND fechamento IS NOT NULL ORDER BY fechamento DESC LIMIT ?`,
      [idEmpresa, Number(limit)]
    );

    return { aberturas: aberturas || [], fechamentos: fechamentos || [] };
  } catch (err) {
    console.error("Erro em getCaixaResumo:", err);
    throw err;
  }
};

const getDespesasDaLoja = async (idEmpresa, limit = 10) => {
  try {
    const rows = await readRaw(
      `SELECT descricao, preco as valor, COALESCE(data_pag, data_adicionado) as data FROM despesas WHERE id_empresa = ? ORDER BY COALESCE(data_pag, data_adicionado) DESC LIMIT ?`,
      [idEmpresa, Number(limit)]
    );
    return rows || [];
  } catch (err) {
    console.error("Erro em getDespesasDaLoja:", err);
    throw err;
  }
};

export {
  getLojaById,
  getGerenteByLoja,
  getVendedoresByLoja,
  getResumoFinanceiro,
  getEstoqueResumo,
  getUltimasVendas,
  getCaixaResumo,
  getDespesasDaLoja,
};
