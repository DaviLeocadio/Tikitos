import {
  deleteRecord,
  read,
  readAll,
  update,
  create,
  readRaw,
} from "../config/database.js";

const listarCategorias = async (whereClause = null) => {
  try {
    return await readAll("categorias", whereClause);
  } catch (err) {
    console.error("Erro ao listar produtos: ", err);
    throw err;
  }
};

const listarCategoriasMeta = async() => {
  try {
    return await readRaw(`SELECT
    c.id_categoria,
    c.nome AS nome_categoria,
    (
        CASE
            WHEN MAX(p.id_produto) IS NULL
                THEN c.id_categoria * 1000 + 1
            ELSE MAX(p.id_produto) + 1
        END
    ) AS proximo_produto_id
FROM categorias c
LEFT JOIN produtos p
    ON p.id_categoria = c.id_categoria
WHERE c.status = 'ativo'
GROUP BY c.id_categoria, c.nome
ORDER BY c.id_categoria;
`)
  } catch (error) {
     console.error("Erro ao listar produtos: ", err);
    throw err;
  }
}

const obterCategoriaPorId = async (categoriaId) => {
  try {
    return await read("categorias", `id_categoria = ${categoriaId}`);
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
  listarCategorias,
  listarCategoriasMeta,
  obterCategoriaPorId,
  criarCategoria,
  atualizarCategoria
};
