import {
  deleteRecord,
  read,
  readAll,
  update,
  create,
} from "../config/database.js";

const listarDespesas = async (whereClause = null) => {
  try {
    return await readAll("despesas", whereClause);
  } catch (err) {
    console.error("Erro ao listar despesas: ", err);
    throw err;
  }
};

const obterDespesaPorId = async (idDespesa) => {
  try {
    return await read("despesas", `id_despesa = ${idDespesa}`);
  } catch (err) {
    console.error("Erro ao obter despesa por ID: ", err);
    throw err;
  }
};

const despesasPagas = async () => {
  try {
    return await readAll("despesas", `status = 'pago'`);
  } catch (err) {
    console.error("Erro ao obter despesa por ID: ", err);
    throw err;
  }
};

const despesasPendentes = async () => {
  try {
    return await readAll("despesas", `status = 'pendente'`);
  } catch (err) {
    console.error("Erro ao obter despesa por ID: ", err);
    throw err;
  }
};

const criarDespesa = async (despesaData) => {
  try {
    return await create("despesas", despesaData);
  } catch (err) {
    console.error("Erro ao criar despesa: ", err);
    throw err;
  }
};

const atualizarDespesa = async (idDespesa, despesaData) => {
  try {
    return await update("despesas", despesaData, `id_despesa = ${idDespesa}`);
  } catch (err) {
    console.error("Erro ao atualizar despesa: ", err);
    throw err;
  }
};

const excluirDespesa = async (idDespesa) => {
  try {
    return await deleteRecord("despesas", `id_despesa = ${idDespesa}`);
  } catch (error) {
    console.error("Erro ai excluir despesa: ", error);
    throw error
  }
}

export {
  listarDespesas,
  obterDespesaPorId,
  criarDespesa,
  atualizarDespesa,
  excluirDespesa,
  despesasPagas,
  despesasPendentes
};
