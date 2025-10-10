import {
  deleteRecord,
  read,
  readAll,
  update,
  create,
} from "../config/database.js";

const listarCategorias = async (whereClause = null) => {
  try {
    return await readAll("categorias", whereClause);
  } catch (err) {
    console.error("Erro ao listar produtos: ", err);
    throw err;
  }
};

const obterCategoriaPorId = async (categoriaId) => {
  try {
    return await read("produtos", `id_venda = ${categoriaId}`);
  } catch (err) {
    console.error("Erro ao obter produto por ID: ", err);
    throw err;
  }
};

const criarCategoria = async (categoriaData) => {
  try {
    return await create("categorias", categoriaData);
  } catch (err) {
    console.error("Erro ao criar categoria: ", err);
    throw err;
  }
};

const atualizarCategoria = async (idCategoria, categoriaData) => {
  try {
    return await update("categorias", categoriaData, `id = ${idCategoria}`);
  } catch (err) {
    console.error("Erro ao atualizar produto: ", err);
    throw err;
  }
};

export {
  listarCategorias
};
