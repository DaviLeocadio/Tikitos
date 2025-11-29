import { readRaw } from "../config/database.js";

// ==================== DASHBOARD GERAL ====================

// Obter resumo de vendas do período
const obterResumoVendas = async (idEmpresa, periodo, idFilial = null) => {
  try {
    let whereData = "";
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

    let filialFilter = idFilial ? `AND id_filial = ?` : "";
    const params = idFilial ? [idEmpresa, idFilial] : [idEmpresa];

    const sql = `
      SELECT
        COUNT(*) as total_vendas,
        COALESCE(SUM(total), 0) as valor_total,
        COALESCE(SUM(CASE WHEN tipo_pagamento = 'pix' THEN total ELSE 0 END), 0) as total_pix,
        COALESCE(SUM(CASE WHEN tipo_pagamento = 'dinheiro' THEN total ELSE 0 END), 0) as total_dinheiro,
        COALESCE(SUM(CASE WHEN tipo_pagamento = 'cartao' THEN total ELSE 0 END), 0) as total_cartao
      FROM vendas
      WHERE id_empresa = ? ${filialFilter} AND ${whereData}
    `;

    const resultado = await readRaw(sql, params);
    return resultado[0];
  } catch (err) {
    console.error("Erro ao obter resumo de vendas:", err);
    throw err;
  }
};

// Obter vendas por filial (ranking)
const obterVendasPorFilial = async (idEmpresa, periodo) => {
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
        f.id_filial,
        f.nome as nome_filial,
        COUNT(v.id_venda) as total_vendas,
        COALESCE(SUM(v.total), 0) as valor_total
      FROM vendas v
      INNER JOIN filiais f ON v.id_filial = f.id_filial
      WHERE v.id_empresa = ? AND ${whereData}
      GROUP BY f.id_filial, f.nome
      ORDER BY valor_total DESC
    `;

    return await readRaw(sql, [idEmpresa]);
  } catch (err) {
    console.error("Erro ao obter vendas por filial:", err);
    throw err;
  }
};

// Obter contas a pagar da rede
const obterContasAPagar = async (idEmpresa, idFilial = null) => {
  try {
    let filialFilter = idFilial ? `AND d.id_filial = ?` : "";
    const params = idFilial ? [idEmpresa, idFilial] : [idEmpresa];

    const sql = `
      SELECT
        COALESCE(SUM(CASE WHEN d.status = 'pendente' THEN d.preco ELSE 0 END), 0) as total_pendente,
        COALESCE(SUM(CASE WHEN d.status = 'pago' THEN d.preco ELSE 0 END), 0) as total_pago,
        COUNT(*) as total_despesas
      FROM despesas d
      WHERE d.id_empresa = ? ${filialFilter}
    `;

    const resultado = await readRaw(sql, params);
    return resultado[0];
  } catch (err) {
    console.error("Erro ao obter contas a pagar:", err);
    throw err;
  }
};

// Obter saldo consolidado
const obterSaldoConsolidado = async (idEmpresa, idFilial = null) => {
  try {
    let filialFilter = idFilial ? `AND id_filial = ?` : "";
    const params = idFilial ? [idEmpresa, idFilial] : [idEmpresa];

    const sql = `
      SELECT
        COALESCE(SUM(total), 0) as saldo_total
      FROM vendas
      WHERE id_empresa = ? ${filialFilter}
    `;

    const resultado = await readRaw(sql, params);
    return resultado[0];
  } catch (err) {
    console.error("Erro ao obter saldo consolidado:", err);
    throw err;
  }
};

// ==================== GESTÃO DE LOJAS ====================

// Listar todas as filiais
const listarFiliais = async (idEmpresa) => {
  try {
    const sql = `
      SELECT * FROM filiais
      WHERE id_empresa = ? AND status = 'ativa'
      ORDER BY nome
    `;

    return await readRaw(sql, [idEmpresa]);
  } catch (err) {
    console.error("Erro ao listar filiais:", err);
    throw err;
  }
};

// Criar nova filial
const criarFilial = async (idEmpresa, dados) => {
  try {
    const { nome, endereco, telefone, email, cidade, estado } = dados;

    const sql = `
      INSERT INTO filiais (id_empresa, nome, endereco, telefone, email, cidade, estado, status, data_criacao)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'ativa', NOW())
    `;

    return await readRaw(sql, [idEmpresa, nome, endereco, telefone, email, cidade, estado]);
  } catch (err) {
    console.error("Erro ao criar filial:", err);
    throw err;
  }
};

// Atualizar filial
const atualizarFilial = async (idFilial, dados) => {
  try {
    const { nome, endereco, telefone, email, cidade, estado } = dados;

    const sql = `
      UPDATE filiais
      SET nome = ?, endereco = ?, telefone = ?, email = ?, cidade = ?, estado = ?, data_atualizacao = NOW()
      WHERE id_filial = ?
    `;

    return await readRaw(sql, [nome, endereco, telefone, email, cidade, estado, idFilial]);
  } catch (err) {
    console.error("Erro ao atualizar filial:", err);
    throw err;
  }
};

// Desativar filial
const desativarFilial = async (idFilial) => {
  try {
    const sql = `
      UPDATE filiais
      SET status = 'inativa', data_atualizacao = NOW()
      WHERE id_filial = ?
    `;

    return await readRaw(sql, [idFilial]);
  } catch (err) {
    console.error("Erro ao desativar filial:", err);
    throw err;
  }
};

// ==================== GESTÃO DE PRODUTOS ====================

// Listar produtos
const listarProdutos = async (idEmpresa) => {
  try {
    const sql = `
      SELECT * FROM produtos
      WHERE id_empresa = ? AND status = 'ativo'
      ORDER BY nome
    `;

    return await readRaw(sql, [idEmpresa]);
  } catch (err) {
    console.error("Erro ao listar produtos:", err);
    throw err;
  }
};

// Criar produto
const criarProduto = async (idEmpresa, dados) => {
  try {
    const { nome, sku, preco_venda, categoria, descricao } = dados;

    const sql = `
      INSERT INTO produtos (id_empresa, nome, sku, preco_venda, categoria, descricao, status, data_criacao)
      VALUES (?, ?, ?, ?, ?, ?, 'ativo', NOW())
    `;

    return await readRaw(sql, [idEmpresa, nome, sku, preco_venda, categoria, descricao]);
  } catch (err) {
    console.error("Erro ao criar produto:", err);
    throw err;
  }
};

// Atualizar produto
const atualizarProduto = async (idProduto, dados) => {
  try {
    const { nome, sku, preco_venda, categoria, descricao } = dados;

    const sql = `
      UPDATE produtos
      SET nome = ?, sku = ?, preco_venda = ?, categoria = ?, descricao = ?, data_atualizacao = NOW()
      WHERE id_produto = ?
    `;

    return await readRaw(sql, [nome, sku, preco_venda, categoria, descricao, idProduto]);
  } catch (err) {
    console.error("Erro ao atualizar produto:", err);
    throw err;
  }
};

// Desativar produto
const desativarProduto = async (idProduto) => {
  try {
    const sql = `
      UPDATE produtos
      SET status = 'inativo', data_atualizacao = NOW()
      WHERE id_produto = ?
    `;

    return await readRaw(sql, [idProduto]);
  } catch (err) {
    console.error("Erro ao desativar produto:", err);
    throw err;
  }
};

// ==================== GESTÃO DE FORNECEDORES ====================

// Listar fornecedores
const listarFornecedores = async (idEmpresa) => {
  try {
    const sql = `
      SELECT * FROM fornecedores
      WHERE id_empresa = ? AND status = 'ativo'
      ORDER BY nome
    `;

    return await readRaw(sql, [idEmpresa]);
  } catch (err) {
    console.error("Erro ao listar fornecedores:", err);
    throw err;
  }
};

// Criar fornecedor
const criarFornecedor = async (idEmpresa, dados) => {
  try {
    const { nome, cnpj, email, telefone, endereco, cidade, estado } = dados;

    const sql = `
      INSERT INTO fornecedores (id_empresa, nome, cnpj, email, telefone, endereco, cidade, estado, status, data_criacao)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ativo', NOW())
    `;

    return await readRaw(sql, [idEmpresa, nome, cnpj, email, telefone, endereco, cidade, estado]);
  } catch (err) {
    console.error("Erro ao criar fornecedor:", err);
    throw err;
  }
};

// Atualizar fornecedor
const atualizarFornecedor = async (idFornecedor, dados) => {
  try {
    const { nome, cnpj, email, telefone, endereco, cidade, estado } = dados;

    const sql = `
      UPDATE fornecedores
      SET nome = ?, cnpj = ?, email = ?, telefone = ?, endereco = ?, cidade = ?, estado = ?, data_atualizacao = NOW()
      WHERE id_fornecedor = ?
    `;

    return await readRaw(sql, [nome, cnpj, email, telefone, endereco, cidade, estado, idFornecedor]);
  } catch (err) {
    console.error("Erro ao atualizar fornecedor:", err);
    throw err;
  }
};

// Deletar fornecedor
const deletarFornecedor = async (idFornecedor) => {
  try {
    const sql = `
      UPDATE fornecedores
      SET status = 'inativo', data_atualizacao = NOW()
      WHERE id_fornecedor = ?
    `;

    return await readRaw(sql, [idFornecedor]);
  } catch (err) {
    console.error("Erro ao deletar fornecedor:", err);
    throw err;
  }
};

// ==================== GESTÃO DE USUÁRIOS ====================

// Listar usuários/equipe
const listarUsuarios = async (idEmpresa, idFilial = null) => {
  try {
    let filialFilter = idFilial ? `AND u.id_filial = ?` : "";
    const params = idFilial ? [idEmpresa, idFilial] : [idEmpresa];

    const sql = `
      SELECT
        u.id_usuario,
        u.nome,
        u.email,
        u.perfil,
        u.status,
        f.nome as nome_filial,
        u.data_criacao
      FROM usuarios u
      LEFT JOIN filiais f ON u.id_filial = f.id_filial
      WHERE u.id_empresa = ? ${filialFilter}
      ORDER BY u.nome
    `;

    return await readRaw(sql, params);
  } catch (err) {
    console.error("Erro ao listar usuários:", err);
    throw err;
  }
};

// Transferir funcionário de loja
const transferirFuncionario = async (idUsuario, novaIdFilial) => {
  try {
    const sql = `
      UPDATE usuarios
      SET id_filial = ?, data_atualizacao = NOW()
      WHERE id_usuario = ?
    `;

    return await readRaw(sql, [novaIdFilial, idUsuario]);
  } catch (err) {
    console.error("Erro ao transferir funcionário:", err);
    throw err;
  }
};

// Alterar perfil de acesso
const alterarPerfilUsuario = async (idUsuario, novoPerfil) => {
  try {
    const sql = `
      UPDATE usuarios
      SET perfil = ?, data_atualizacao = NOW()
      WHERE id_usuario = ?
    `;

    return await readRaw(sql, [novoPerfil, idUsuario]);
  } catch (err) {
    console.error("Erro ao alterar perfil:", err);
    throw err;
  }
};

// Resetar senha de usuário
const resetarSenhaUsuario = async (idUsuario, novaSenha) => {
  try {
    const sql = `
      UPDATE usuarios
      SET senha = ?, data_atualizacao = NOW()
      WHERE id_usuario = ?
    `;

    return await readRaw(sql, [novaSenha, idUsuario]);
  } catch (err) {
    console.error("Erro ao resetar senha:", err);
    throw err;
  }
};

// ==================== FINANCEIRO: CONTAS A PAGAR ====================

// Listar despesas (Matriz e auditoria de filiais)
const listarDespesas = async (idEmpresa, idFilial = null, status = null) => {
  try {
    let filialFilter = idFilial ? `AND d.id_filial = ?` : "";
    let statusFilter = status ? `AND d.status = ?` : "";
    
    const params = [];
    params.push(idEmpresa);
    if (idFilial) params.push(idFilial);
    if (status) params.push(status);

    const sql = `
      SELECT
        d.id_despesa,
        d.descricao,
        d.preco,
        d.status,
        d.data_pag,
        f.nome as nome_fornecedor,
        fil.nome as nome_filial,
        d.data_criacao
      FROM despesas d
      LEFT JOIN fornecedores f ON d.id_fornecedor = f.id_fornecedor
      LEFT JOIN filiais fil ON d.id_filial = fil.id_filial
      WHERE d.id_empresa = ? ${filialFilter} ${statusFilter}
      ORDER BY d.data_criacao DESC
    `;

    return await readRaw(sql, params);
  } catch (err) {
    console.error("Erro ao listar despesas:", err);
    throw err;
  }
};

// Registrar despesa de pagamento de fornecedor
const registrarDespesaFornecedor = async (idEmpresa, dados) => {
  try {
    const { descricao, preco, idFornecedor, dataPag, idFilial } = dados;

    const sql = `
      INSERT INTO despesas (id_empresa, id_fornecedor, id_filial, descricao, preco, status, data_pag, data_criacao)
      VALUES (?, ?, ?, ?, ?, 'pendente', ?, NOW())
    `;

    return await readRaw(sql, [idEmpresa, idFornecedor, idFilial, descricao, preco, dataPag]);
  } catch (err) {
    console.error("Erro ao registrar despesa:", err);
    throw err;
  }
};

// Atualizar status de despesa
const atualizarStatusDespesa = async (idDespesa, novoStatus) => {
  try {
    const sql = `
      UPDATE despesas
      SET status = ?, data_atualizacao = NOW()
      WHERE id_despesa = ?
    `;

    return await readRaw(sql, [novoStatus, idDespesa]);
  } catch (err) {
    console.error("Erro ao atualizar status da despesa:", err);
    throw err;
  }
};

// ==================== FINANCEIRO: FLUXO DE CAIXA ====================

// Obter fluxo de caixa consolidado
const obterFluxoCaixaConsolidado = async (idEmpresa, periodo, idFilial = null) => {
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

    let filialFilter = idFilial ? `AND id_filial = ?` : "";
    const params = idFilial ? [idEmpresa, idFilial] : [idEmpresa];

    const sqlEntradas = `
      SELECT COALESCE(SUM(total), 0) as entradas
      FROM vendas
      WHERE id_empresa = ? ${filialFilter} AND ${whereDataVendas}
    `;

    const sqlSaidas = `
      SELECT COALESCE(SUM(preco), 0) as saidas
      FROM despesas
      WHERE id_empresa = ? ${filialFilter} AND ${whereDataDespesas} AND status = 'pago'
    `;

    const entradas = await readRaw(sqlEntradas, params);
    const saidas = await readRaw(sqlSaidas, params);

    return {
      entradas: entradas[0].entradas,
      saidas: saidas[0].saidas,
      saldo: entradas[0].entradas - saidas[0].saidas
    };
  } catch (err) {
    console.error("Erro ao obter fluxo de caixa consolidado:", err);
    throw err;
  }
};

// Drill-down: Detalhes de receita/despesa por filial
const obterDetalhesFluxoPorFilial = async (idEmpresa, periodo) => {
  try {
    let whereData = "";
    switch (periodo) {
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
        f.id_filial,
        f.nome as nome_filial,
        COALESCE(SUM(v.total), 0) as receitas,
        COALESCE((SELECT SUM(d.preco) FROM despesas d WHERE d.id_filial = f.id_filial AND d.id_empresa = ? AND d.status = 'pago'), 0) as despesas
      FROM filiais f
      LEFT JOIN vendas v ON f.id_filial = v.id_filial AND ${whereData}
      WHERE f.id_empresa = ?
      GROUP BY f.id_filial, f.nome
      ORDER BY receitas DESC
    `;

    return await readRaw(sql, [idEmpresa, idEmpresa]);
  } catch (err) {
    console.error("Erro ao obter detalhes de fluxo por filial:", err);
    throw err;
  }
};

// ==================== RELATÓRIOS GERENCIAIS ====================

// Comparativo entre lojas
const obterComparativoLojas = async (idEmpresa, periodo) => {
  try {
    let whereData = "";
    switch (periodo) {
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
        f.id_filial,
        f.nome as nome_filial,
        COUNT(v.id_venda) as total_vendas,
        COALESCE(SUM(v.total), 0) as valor_vendas,
        COALESCE(SUM(vi.quantidade), 0) as quantidade_itens,
        ROUND(COALESCE(SUM(v.total) / COUNT(v.id_venda), 0), 2) as ticket_medio
      FROM filiais f
      LEFT JOIN vendas v ON f.id_filial = v.id_filial AND ${whereData}
      LEFT JOIN venda_itens vi ON v.id_venda = vi.id_venda
      WHERE f.id_empresa = ?
      GROUP BY f.id_filial, f.nome
      ORDER BY valor_vendas DESC
    `;

    return await readRaw(sql, [idEmpresa]);
  } catch (err) {
    console.error("Erro ao obter comparativo de lojas:", err);
    throw err;
  }
};

// Produtos mais vendidos na rede
const obterProdutosMaisVendidos = async (idEmpresa, periodo, limite = 10) => {
  try {
    let whereData = "";
    switch (periodo) {
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
        p.id_produto,
        p.nome as nome_produto,
        p.sku,
        COALESCE(SUM(vi.quantidade), 0) as quantidade_vendida,
        COALESCE(SUM(vi.quantidade * vi.preco_unitario), 0) as receita_total
      FROM produtos p
      LEFT JOIN venda_itens vi ON p.id_produto = vi.id_produto
      LEFT JOIN vendas v ON vi.id_venda = v.id_venda AND ${whereData}
      WHERE p.id_empresa = ?
      GROUP BY p.id_produto, p.nome, p.sku
      ORDER BY quantidade_vendida DESC
      LIMIT ?
    `;

    return await readRaw(sql, [idEmpresa, limite]);
  } catch (err) {
    console.error("Erro ao obter produtos mais vendidos:", err);
    throw err;
  }
};

// Curva ABC de faturamento
const obterCurvaABCFaturamento = async (idEmpresa, periodo) => {
  try {
    let whereData = "";
    switch (periodo) {
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
        p.id_produto,
        p.nome as nome_produto,
        COALESCE(SUM(vi.quantidade * vi.preco_unitario), 0) as receita,
        ROUND(100 * SUM(vi.quantidade * vi.preco_unitario) / (
          SELECT SUM(vi2.quantidade * vi2.preco_unitario)
          FROM venda_itens vi2
          INNER JOIN vendas v2 ON vi2.id_venda = v2.id_venda
          WHERE v2.id_empresa = ?
        ), 2) as percentual,
        CASE
          WHEN 100 * SUM(vi.quantidade * vi.preco_unitario) / (
            SELECT SUM(vi2.quantidade * vi2.preco_unitario)
            FROM venda_itens vi2
            INNER JOIN vendas v2 ON vi2.id_venda = v2.id_venda
            WHERE v2.id_empresa = ?
          ) <= 20 THEN 'A'
          WHEN 100 * SUM(vi.quantidade * vi.preco_unitario) / (
            SELECT SUM(vi2.quantidade * vi2.preco_unitario)
            FROM venda_itens vi2
            INNER JOIN vendas v2 ON vi2.id_venda = v2.id_venda
            WHERE v2.id_empresa = ?
          ) <= 50 THEN 'B'
          ELSE 'C'
        END as classificacao_abc
      FROM produtos p
      LEFT JOIN venda_itens vi ON p.id_produto = vi.id_produto
      LEFT JOIN vendas v ON vi.id_venda = v.id_venda AND ${whereData}
      WHERE p.id_empresa = ?
      GROUP BY p.id_produto, p.nome
      HAVING receita > 0
      ORDER BY receita DESC
    `;

    return await readRaw(sql, [idEmpresa, idEmpresa, idEmpresa, idEmpresa]);
  } catch (err) {
    console.error("Erro ao obter curva ABC:", err);
    throw err;
  }
};

// Obter produtos vendidos
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

// Obter melhor vendedor
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

// Calcular trend
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
  obterVendasPorFilial,
  obterContasAPagar,
  obterSaldoConsolidado,
  listarFiliais,
  criarFilial,
  atualizarFilial,
  desativarFilial,
  listarProdutos,
  criarProduto,
  atualizarProduto,
  desativarProduto,
  listarFornecedores,
  criarFornecedor,
  atualizarFornecedor,
  deletarFornecedor,
  listarUsuarios,
  transferirFuncionario,
  alterarPerfilUsuario,
  resetarSenhaUsuario,
  listarDespesas,
  registrarDespesaFornecedor,
  atualizarStatusDespesa,
  obterFluxoCaixaConsolidado,
  obterDetalhesFluxoPorFilial,
  obterComparativoLojas,
  obterProdutosMaisVendidos,
  obterCurvaABCFaturamento,
  obterProdutosVendidos,
  obterVendedoresAtivos,
  obterMelhorVendedor,
  calcularTrend
  
};