import { listarCategorias, listarCategoriasMeta } from "../models/Categorias.js";
import { listarEmpresas } from "../models/Empresa.js";
import { listarFornecedor } from "../models/Fornecedor.js";
import { listarProdutos } from "../models/Produto.js";

const metaAdminController = async (req, res) => {
  try {
    const {categorias, fornecedores, filiais, produtos} = req.query;
    let response = {};

    if(categorias) {
        const categoriasList = await listarCategoriasMeta();
        response.categorias = categoriasList;
    }

    if(fornecedores){
        const listaFornecedores = await listarFornecedor(`status = 'ativo'`);
        response.fornecedores = listaFornecedores;
    }
    if(filiais){
        const listaFiliais = await listarEmpresas(`tipo = 'filial'`);
        response.filiais = listaFiliais;
    }
    if(produtos){
        const listaProdutos = await listarProdutos(`status = 'ativo'`);
        response.produtos = listaProdutos;
    }



    response.mensagem = "Dados de formulário obtidos com sucesso!";

    return res.status(200).json(response)
  } catch (error) {
    console.error("Erro ao obter dados de formulario: ", error);
    res.status(500).json({ mensagem: "Erro ao obter dados de formulario" });
  }
};

export {metaAdminController}
