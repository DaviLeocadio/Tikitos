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
    console.error("Erro ao listar produtos: ", err);
    throw err;
  }
};

const obterMovimentoPorId = async (idMovimento) => {
  try {
    return await read("movimento_estoque", `id_movimento = ${idMovimento}`);
  } catch (err) {
    console.error("Erro ao obter produto por ID: ", err);
    throw err;
  }
};

const criarMovimento = async (despesaData) => {
  try {
    return await create("movimento_estoque", despesaData);
  } catch (err) {
    console.error("Erro ao criar produto: ", err);
    throw err;
  }
};

const atualizarMovimento = async (idMovimento, movimentoData) => {
  try {
    return await update("movimento_estoque", movimentoData, `id_movimento = ${idMovimento}`);
  } catch (err) {
    console.error("Erro ao atualizar produto: ", err);
    throw err;
  }
};

export {
  listarMovimento,
  obterMovimentoPorId,
  criarMovimento,
  atualizarMovimento,
};
