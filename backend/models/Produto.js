import {
  deleteRecord,
  read,
  readAll,
  update,
  create,
} from "../config/database.js";

const listarProdutos = async (whereClause = null) => {
  try {
    return await readAll("produtos", whereClause);
  } catch (err) {
    console.error("Erro ao listar produtos: ", err);
    throw err;
  }
};

const obterProdutoPorId = async (produtoId) => {
  try {
    return await read("produtos", `id_produto = ${produtoId}`);
  } catch (err) {
    console.error("Erro ao obter produto por ID: ", err);
    throw err;
  }
};

const criarProduto = async (produtoData) => {
  try {
    return await create("produtos", produtoData);
  } catch (err) {
    console.error("Erro ao criar produto: ", err);
    throw err;
  }
};

const atualizarProduto = async (produtoId, produtoData) => {
  try {
    await update("produtos", produtoData, `id_produto = ${produtoId}`);
  } catch (err) {
    console.error("Erro ao atualizar produto: ", err);
    throw err;
  }
};

export {
  listarProdutos,
  obterProdutoPorId,
  criarProduto,
  atualizarProduto
};
