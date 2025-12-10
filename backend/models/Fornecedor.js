import {
  read,
  readAll,
  update,
  create,
  deleteRecord
} from "../config/database.js";

const listarFornecedor = async (whereClause = null) => {
  try {
    return await readAll("fornecedores", whereClause);
  } catch (err) {
    console.error("Erro ao listar fornecedores: ", err);
    throw err;
  }
};

const obterFornecedorPorId = async (idFornecedor) => {
  try {
    return await read("fornecedores", `id_fornecedor = ${idFornecedor}`);
  } catch (err) {
    console.error("Erro ao obter fornecedor por ID: ", err);
    throw err;
  }
};

const criarFornecedor = async (fornecedorData) => {
  try {
    return await create("fornecedores", fornecedorData);
  } catch (err) {
    console.error("Erro ao criar fornecedor: ", err);
    throw err;
  }
};

const atualizarFornecedor = async (idFornecedor, fornecedorData) => {
  try {
    return await update("fornecedores", fornecedorData, `id_fornecedor = ${idFornecedor}`);
  } catch (err) {
    console.error("Erro ao atualizar fornecedor: ", err);
    throw err;
  }
};

const deletarFornecedor = async (idFornecedor) => {
  try {
    return await deleteRecord("fornecedores", `id_fornecedor = ${idFornecedor}`);
  } catch (err) {
    console.error("Erro ao deletar fornecedor: ", err);
    throw err;
  }
};

const desativarFornecedor = async(idFornecedor) => {
  try {
    return await update('fornecedores', {status: 'inativo'}, `id_fornecedor = ${idFornecedor}`);
  } catch (err) {
    console.error("Erro ao desativar fornecedor: ", err);
    throw err;
  }
}

export {
  listarFornecedor,
  obterFornecedorPorId,
  criarFornecedor,
  atualizarFornecedor,
  deletarFornecedor,
  desativarFornecedor
};
