import {
  deleteRecord,
  read,
  readAll,
  update,
  create,
} from "../config/database.js";

const listarMovimento = async (whereClause = null) => {
  try {
    return await readAll("movimento_estoque", whereClause);
  } catch (err) {
    console.error("Erro ao listar movimento de estoque: ", err);
    throw err;
  }
};

const obterMovimentoPorId = async (idMovimento) => {
  try {
    return await read("movimento_estoque", `id_movimento = ${idMovimento}`);
  } catch (err) {
    console.error("Erro ao obter movimento de estoque por ID: ", err);
    throw err;
  }
};

const registrarMovimento = async (movimentoData) => {
  try {
    return await create("movimento_estoque", movimentoData);
  } catch (err) {
    console.error("Erro ao registrar movimento de estoque: ", err);
    throw err;
  }
};

const atualizarMovimento = async (idMovimento, movimentoData) => {
  try {
    return await update("movimento_estoque", movimentoData, `id_movimento = ${idMovimento}`);
  } catch (err) {
    console.error("Erro ao atualizar movimento de estoque: ", err);
    throw err;
  }
};

export {
  listarMovimento,
  obterMovimentoPorId,
  registrarMovimento,
  atualizarMovimento,
};
