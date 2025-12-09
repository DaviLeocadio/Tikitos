import {
  deleteRecord,
  read,
  readAll,
  update,
  create,
} from "../config/database.js";
  
const listarVendas = async (query = null) => {
  try {
    const table = `
      (
        SELECT
          v.*,
          u.nome AS nome_usuario
        FROM vendas v
        INNER JOIN usuarios u
          ON v.id_usuario = u.id_usuario
      ) AS v_with_user
    `;

    return await readAll(table, query);
  } catch (err) {
    console.error("Erro ao listar vendas: ", err);
    throw err;
  }
};

const listarVendasPorVendedor = async (idVendedor) => {
  try {
    return await readAll(
      "vendas",
      `id_usuario = ${idVendedor} ORDER BY data_venda DESC`
    );
  } catch (err) {
    console.error("Erro ao listar vendas: ", err);
    throw err;
  }
};


const listarVendasPorCaixa = async (caixaId) => {
  try {
    return await readAll("vendas", `id_caixa = ${caixaId}`);
  } catch (error) {
    console.error("Erro ao listar vendas por caixa: ", err);
    throw err;
  }
};

const obterVendaPorId = async (vendaId) => {
  try {
    return await read("vendas", `id_venda = ${vendaId}`);
  } catch (err) {
    console.error("Erro ao obter detalhes da venda: ", err);
    throw err;
  }
};

const obterVendaPorData = async (dataCaixa, idCaixa, idEmpresa) => {
  try {
    return await readAll(
      "vendas",
      `DATE(data_venda) = '${dataCaixa}' AND id_caixa = ${idCaixa} AND id_empresa = ${idEmpresa}`
    );
  } catch (err) {
    console.error("Erro ao obter detalhes da venda: ", err);
    throw err;
  }
};

const obterVendasIntervaloUsuario = async (
  dataInicial,
  dataFinal,
  idUsuario,
  idEmpresa
) => {
  try {
    return await readAll(
      "vendas",
      `DATE(data_venda) BETWEEN '${dataInicial}' AND '${dataFinal}'
      AND id_usuario = ${idUsuario}
      AND id_empresa = ${idEmpresa}`
    );
  } catch (error) {
    console.error("Erro ao listar vendas: ", err);
    throw err;
  }
};

const obterVendaPorDataUsuario = async (data, idUsuario, idEmpresa) => {
  try {
    return await readAll(
      "vendas",
      `DATE(data_venda) = '${data}'
      AND id_usuario = ${idUsuario}
      AND id_empresa = ${idEmpresa}`
    );
  } catch (error) {
    console.error("Erro ao listar vendas: ", err);
    throw err;
  }
};

const criarVenda = async (vendaData) => {
  try {
    return await create("vendas", vendaData);
  } catch (err) {
    console.error("Erro ao registrar venda: ", err);
    throw err;
  }
};

const atualizarVenda = async (vendaId, vendaData) => {
  try {
    await update("vendas", vendaData, `id_venda = ${vendaId}`);
  } catch (err) {
    console.error("Erro ao atualizar venda: ", err);
    throw err;
  }
};

const excluirVenda = async (vendaId) => {
  try {
    await deleteRecord("vendas", `id_venda = ${vendaId}`);
  } catch (err) {
    console.error("Erro ao excluir venda", err);
    throw err;
  }
};

// Transactional versions (use a provided connection)
const obterVendaPorIdTrans = async (connection, vendaId) => {
  try {
    const [rows] = await connection.execute(
      `SELECT * FROM vendas WHERE id_venda = ?`,
      [vendaId]
    );
    return rows[0] || null;
  } catch (err) {
    console.error("Erro ao obter venda por ID (trans): ", err);
    throw err;
  }
};

const excluirVendaTrans = async (connection, vendaId) => {
  try {
    const [result] = await connection.execute(
      `DELETE FROM vendas WHERE id_venda = ?`,
      [vendaId]
    );
    return result.affectedRows;
  } catch (err) {
    console.error("Erro ao excluir venda (trans): ", err);
    throw err;
  }
};

export {
  listarVendas,
  listarVendasPorCaixa,
  obterVendaPorId,
  obterVendaPorData,
  criarVenda,
  atualizarVenda,
  excluirVenda,
  obterVendaPorIdTrans,
  excluirVendaTrans,
  obterVendasIntervaloUsuario,
  obterVendaPorDataUsuario,
  listarVendasPorVendedor,
};
