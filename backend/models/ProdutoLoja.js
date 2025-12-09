import {
  deleteRecord,
  read,
  readAll,
  update,
  create,
  readRaw,
} from "../config/database.js";
import dotenv from "dotenv";

dotenv.config();

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

// Transactional variants
const obterProdutoLojaTrans = async (connection, idProduto, idEmpresa) => {
  try {
    const [rows] = await connection.execute(
      `SELECT * FROM produto_loja WHERE id_produto = ? AND id_empresa = ?`,
      [idProduto, idEmpresa]
    );
    return rows[0] || null;
  } catch (err) {
    console.error("Erro ao obter produto por ID (trans): ", err);
    throw err;
  }
};

const atualizarProdutoLojaTrans = async (
  connection,
  idProdutoLoja,
  produtoLojaData
) => {
  try {
    const columns = Object.keys(produtoLojaData);
    const values = Object.values(produtoLojaData);
    const set = columns.map((c) => `${c} = ?`).join(", ");
    const sql = `UPDATE produto_loja SET ${set} WHERE id_produto_loja = ?`;
    const [result] = await connection.execute(sql, [...values, idProdutoLoja]);
    return result.affectedRows;
  } catch (err) {
    console.error("Erro ao atualizar produto (trans): ", err);
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

const contarProdutosEmPromocao = async (idEmpresa) => {
  try {
    return await readAll(
      "produto_loja",
      `id_empresa = ${idEmpresa} AND desconto > 0`
    );
  } catch (error) {
    console.error("Erro ao buscar produtos em promoção: ", err);
    throw err;
  }
};

const obterProdutosEstoqueCritico = async (idEmpresa) => {
  try {
    const sql = `SELECT 
    p.id_produto,
    p.nome,
    p.descricao,
    p.custo,
    p.lucro,
    p.preco,
    p.imagem,
    pl.estoque,
    c.nome AS categoria,
    f.nome AS fornecedor
FROM produtos p
JOIN produto_loja pl 
    ON p.id_produto = pl.id_produto
JOIN categorias c
    ON p.id_categoria = c.id_categoria
JOIN fornecedores f
    ON p.id_fornecedor = f.id_fornecedor
WHERE pl.id_empresa = ?
    AND pl.estoque < ${process.env.ESTOQUE_MINIMO}
ORDER BY pl.estoque ASC;
`;
    return await readRaw(sql, [idEmpresa]);
  } catch (error) {
    console.error("Erro ao consultar produtos com estoque baixo: ", err);
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
  contarProdutosEmPromocao,
  obterProdutoLojaTrans,
  atualizarProdutoLojaTrans,
};
