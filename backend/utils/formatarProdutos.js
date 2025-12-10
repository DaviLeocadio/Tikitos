import { obterCategoriaPorId } from "../models/Categorias.js";
import { obterProdutoLoja } from "../models/ProdutoLoja.js";
import { mascaraDinheiro } from "./formatadorNumero.js";
import { obterFornecedorPorId } from "../models/Fornecedor.js";

export const formatarProdutos = async (produtos, usuarioEmpresa = null) => {
  return await Promise.all(
    produtos.map(async (produto) => {
      const categoria = await obterCategoriaPorId(produto.id_categoria);
      const fornecedor = await obterFornecedorPorId(produto.id_fornecedor);

      let precoProduto = produto.preco;
      let precoComDesconto = null;
      let desconto = null;
      let estoque = 0;

      if (usuarioEmpresa) {
        const produtoLoja = await obterProdutoLoja(
          produto.id_produto,
          usuarioEmpresa
        );
        precoComDesconto =
          produto.preco - produto.preco * produtoLoja.desconto * 0.01;
        estoque = produtoLoja.estoque;
        desconto = produtoLoja.desconto;
      }
      let precoFormatado = mascaraDinheiro(precoProduto);

      let response = {
        ...produto,
        fornecedor: fornecedor.nome,
        categoria: categoria.nome,
        precoFormatado: precoFormatado,
      };

      if (estoque) response.estoque = estoque;
      if (precoComDesconto) {
        response.precoComDesconto = precoComDesconto;
        response.precoFormatadoComDesconto = mascaraDinheiro(precoComDesconto);
      }
      if (desconto) response.desconto = desconto;
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
