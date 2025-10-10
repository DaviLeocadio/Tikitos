import {
  deleteRecord,
  read,
  readAll,
  update,
  create,
} from "../config/database.js";

const listarProdutosLoja = async (whereClause = null) => {
  try {
    return await readAll("produto_loja", whereClause);
  } catch (err) {
    console.error("Erro ao listar produtos: ", err);
    throw err;
  }
};

const obterProdutoLojaPorId = async (idProdutoLoja) => {
  try {
    return await read("produto_loja", `id_venda = ${idProdutoLoja}`);
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
    return await update("produto_loja", produtoLojaData, `id = ${idProdutoLoja}`);
  } catch (err) {
    console.error("Erro ao atualizar produto: ", err);
    throw err;
  }
};

const deletarProdutoLoja = async (idProdutoLoja)=>{
  try{
    return await deleteRecord("produto_loja", `id_produto_loja = ${idProdutoLoja}`)
  } catch(err){
    console.error("Erro ao deletar produto da loja: ", err);
    throw err;
  }
}

export {
  listarProdutosLoja,
  obterProdutoLojaPorId,
  criarProdutoLoja,
  atualizarProdutoLoja,
  deletarProdutoLoja
};
