import { obterCategoriaPorId } from "../models/Categorias.js";
import { obterProdutoLoja } from "../models/ProdutoLoja.js";
import { mascaraDinheiro } from "./formatadorNumero.js";

export const formatarProdutos = async (produtos, usuarioEmpresa = null) => {
  return await Promise.all(
    produtos.map(async (produto) => {
      const categoria = await obterCategoriaPorId(produto.id_categoria);

      let precoProduto = produto.preco;
      let estoque = null;

      if (usuarioEmpresa) {
        const produtoLoja = await obterProdutoLoja(
          produto.id_produto,
          usuarioEmpresa
        );
        precoProduto =
          produto.preco - produto.preco * produtoLoja.desconto * 0.01;
        estoque = produtoLoja.estoque;
      }
      let precoFormatado = mascaraDinheiro(precoProduto);

      let response = {
        ...produto,
        categoria: categoria.nome,
        preco: precoProduto,
        precoFormatado: precoFormatado,
      };

      if (estoque) response.estoque = estoque;
      return response;
    })
  );
};

export const formatarProduto = async (produto, usuarioEmpresa = null) => {
  const categoria = await obterCategoriaPorId(produto.id_categoria);

  let precoProduto = produto.preco;
  let estoque = null;

  if (usuarioEmpresa) {
    const produtoLoja = await obterProdutoLoja(
      produto.id_produto,
      usuarioEmpresa
    );
    precoProduto = produto.preco - produto.preco * produtoLoja.desconto * 0.01;
    estoque = produtoLoja.estoque;
  }
  let precoFormatado = mascaraDinheiro(precoProduto);

  let response = {
    ...produto,
    categoria: categoria.nome,
    preco: precoProduto,
    precoFormatado: precoFormatado,
  };

  if (estoque) response.estoque = estoque;
  return response;
};
