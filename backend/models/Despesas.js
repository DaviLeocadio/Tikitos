import {
  deleteRecord,
  read,
  readAll,
  update,
  create,
} from "../config/database.js";

const listarDespesa = async (whereClause = null) => {
  try {
    return await readAll("despesas", whereClause);
  } catch (err) {
    console.error("Erro ao listar produtos: ", err);
    throw err;
  }
};

const obterDespesaPorId = async (idDespesa) => {
  try {
    return await read("despesas", `id_despesa = ${idDespesa}`);
  } catch (err) {
    console.error("Erro ao obter produto por ID: ", err);
    throw err;
  }
};

const criarDespesa = async (despesaData) => {
  try {
    return await create("despesas", despesaData);
  } catch (err) {
    console.error("Erro ao criar produto: ", err);
    throw err;
  }
};

const atualizarDespesa = async (idDespesa, despesaData) => {
  try {
    return await update("despesas", despesaData, `id_despesa = ${idDespesa}`);
  } catch (err) {
    console.error("Erro ao atualizar produto: ", err);
    throw err;
  }
};

export {
  listarDespesa,
  obterDespesaPorId,
  criarDespesa,
  atualizarDespesa,
};
