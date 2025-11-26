import {
  deleteRecord,
  read,
  readAll,
  update,
  create,
} from "../config/database.js";
import dotenv from "dotenv";

dotenv.config()

const listarProdutosLoja = async (whereClause = null) => {
  try {
    return await readAll("produto_loja", whereClause);
  } catch (err) {
    console.error("Erro ao listar produtos: ", err);
    throw err;
  }
};

const obterProdutoLoja = async (idProduto, idEmpresa) => {
  try {
    return await read(
      "produto_loja",
      `id_produto = ${idProduto} AND id_empresa = ${idEmpresa}`
    );
  } catch (err) {
    console.error("Erro ao obter produto por ID: ", err);
    throw err;
  }
};

const criarProdutoLoja = async (produtoLojaData) => {
  try {
    return await create("produto_loja", produtoLojaData);
  } catch (err) {
    console.error("Erro ao criar produto: ", err);
    throw err;
  }
};

const atualizarProdutoLoja = async (idProdutoLoja, produtoLojaData) => {
  try {
    return await update(
      "produto_loja",
      produtoLojaData,
      `id_produto_loja = ${idProdutoLoja}`
    );
  } catch (err) {
    console.error("Erro ao atualizar produto: ", err);
    throw err;
  }
};

const deletarProdutoLoja = async (idProdutoLoja) => {
  try {
    return await deleteRecord(
      "produto_loja",
      `id_produto_loja = ${idProdutoLoja}`
    );
  } catch (err) {
    console.error("Erro ao deletar produto da loja: ", err);
    throw err;
  }
};

const verificarEstoque = async (idProduto, idEmpresa) => {
  try {
    const produto = await read(
      "produto_loja",
      `id_produto = ${idProduto} AND id_empresa = ${idEmpresa}`
    );
    return produto.estoque;
  } catch (error) {
    console.error("Erro ao consultar estoque de produto: ", err);
    throw err;
  }
};
const obterProdutosEstoqueCritico = async (idEmpresa) => {
  try {
     return await readAll(
      "produto_loja",
      `id_empresa = ${idEmpresa} AND estoque < ${process.env.ESTOQUE_MINIMO}`
    )
  } catch (error) {
    console.error("Erro ao consultar estoque dos produtos: ", err);
    throw err;
  }
};

const contarProdutosEmPromocao = async (idEmpresa) => {
  try {
     return await readAll(
      "produto_loja",
      `id_empresa = ${idEmpresa} AND desconto > 0`
    )
  } catch (error) {
    console.error("Erro ao buscar produtos em promoção: ", err);
    throw err;
  }
};

export {
  listarProdutosLoja,
  obterProdutoLoja,
  criarProdutoLoja,
  atualizarProdutoLoja,
  deletarProdutoLoja,
  verificarEstoque,
  obterProdutosEstoqueCritico,
  contarProdutosEmPromocao
};
