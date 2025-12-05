import { listarCategorias, listarCategoriasMeta } from "../models/Categorias.js";
import { listarFornecedor } from "../models/Fornecedor.js";

const metaAdminController = async (req, res) => {
  try {
    const {categorias, fornecedores} = req.query;
    let response = {};

    if(categorias) {
        const categoriasList = await listarCategoriasMeta();
        response.categorias = categoriasList;
    }

    if(fornecedores){
        const listaFornecedores = await listarFornecedor(`status = 'ativo'`);
        response.fornecedores = listaFornecedores;
    }

    response.mensagem = "Dados de formulário obtidos com sucesso!";

    return res.status(200).json(response)
  } catch (error) {
    console.error("Erro ao obter dados de formulario: ", error);
    res.status(500).json({ mensagem: "Erro ao obter dados de formulario" });
  }
};

export {metaAdminController}
