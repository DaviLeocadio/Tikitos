import { deleteRecord, read, readAll, update, create } from "../config/database.js";

const listarItensVenda = async (query = null) => {
  try {
    return await readAll("venda_itens", query);
  } catch (err) {
    console.error("Erro ao listar itens da venda: ", err);
    throw err;
  }
};


const criarItensVenda = async (itensVendaData) => {
  try {
    return await create("venda_itens", itensVendaData);
  } catch (err) {
    console.error("Erro ao registrar itens da venda: ", err);
    throw err;
  }
};


const excluirItensVenda = async (vendaId) => {
  try {
    await deleteRecord("venda_itens", `id_venda = ${vendaId}`);
  } catch (err) {
    console.error("Erro ao excluir itens da venda", err);
    throw err;
  }
};

// Transactional variants
const listarItensVendaTrans = async (connection, vendaId) => {
  try {
    const [rows] = await connection.execute(
      `SELECT * FROM venda_itens WHERE id_venda = ?`,
      [vendaId]
    );
    return rows;
  } catch (err) {
    console.error("Erro ao listar itens da venda (trans): ", err);
    throw err;
  }
};

const excluirItensVendaTrans = async (connection, vendaId) => {
  try {
    const [result] = await connection.execute(
      `DELETE FROM venda_itens WHERE id_venda = ?`,
      [vendaId]
    );
    return result.affectedRows;
  } catch (err) {
    console.error("Erro ao excluir itens da venda (trans): ", err);
    throw err;
  }
};


export {
 listarItensVenda,
 criarItensVenda,
 excluirItensVenda
 , listarItensVendaTrans, excluirItensVendaTrans
};
