import {
  listarProdutos,
  obterProdutoPorId,
  criarProduto,
  atualizarProduto,
} from "../models/Produto.js";

import { fileURLToPath } from "url";
import path from "path";
import { obterCategoriaPorId } from "../models/Categorias.js";
import { obterProdutoLoja } from "../models/ProdutoLoja.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const listarProdutosController = async (req, res) => {
  try {
    const usuarioEmpresa = req.usuarioEmpresa;
    const produtos = await listarProdutos();
    const produtosFormatados = await Promise.all(
      produtos.map( async(produto) => {
        const categoria = await obterCategoriaPorId(produto.id_categoria);
        const produtoLoja = await obterProdutoLoja(
          produto.id_produto,
          usuarioEmpresa
        );

        return {
          ...produto,
          categoria: categoria.nome,
          estoque: produtoLoja.estoque,
        };
      })
    );
    res.status(200).json({
      mensagem: "Listagem de produtos realizada com sucesso",
      produtosFormatados,
    });
  } catch (err) {
    console.error("Erro ao listar produtos: ", err);
    res.status(500).json({ mensagem: "Erro na listagem de produtos" });
  }
};

const obterProdutoPorIdController = async (req, res) => {
  try {
    const { idProduto } = req.params;

    const produto = await obterProdutoPorId(idProduto);

    if(!produto || produto.length === 0 ) {
      return res
        .status(404)
        .json({
          mensagem: "Produto não encontrado"
        })
    }
    res.status(200).json({ mensagem: "Produto obtido com sucesso", produto });
  } catch (err) {
    console.error("Erro ao obter o produto pelo ID: ", err);
    res.status(500).json({ mensagem: "Erro ao obter o produto desejado" });
  }
};

const criarProdutoController = async (req, res) => {
  try {
    const {
      idEmpresa,
      idCategoria,
      idFornecedor,
      nome,
      descricao,
      custo,
      lucro,
    } = req.body;

    const preco = custo * (1 + lucro / 100);

    let logoPath = null;
    if (req.file) {
      logoPath = `/img/produtos/${req.file.filename}`;
    }

    const produtoData = {
      id_empresa: idEmpresa,
      id_categoria: idCategoria,
      id_fornecedor: idFornecedor,
      nome: nome,
      descricao: descricao,
      custo: custo,
      lucro: lucro,
      preco: preco,
      imagem: imagemPath,
    };

    const produto = criarProduto(produtoData);
    res.status(201).json({ mensagem: "Produto criado com sucesso", produto });
  } catch (error) {
    console.error("Erro ao criar o produto: ", error);
    res.status(500).json({ error: "Erro ao criar o produto desejado" });
  }
};

const atualizarProdutoController = async (req, res) => {
  try {
    const { idProduto } = req.params;
    const {
      idEmpresa,
      idCategoria,
      idFornecedor,
      nome,
      descricao,
      custo,
      lucro,
    } = req.body;

    const preco = custo * (1 + lucro / 100);

    let imagemPath = null;
    if (req.file) {
      imagemPath = req.file.path.replace(
        __dirname.replace("\\controllers", ""),
        ""
      );
    }

    const produtoData = {
      id_empresa: idEmpresa,
      id_categoria: idCategoria,
      id_fornecedor: idFornecedor,
      nome: nome,
      descricao: descricao,
      custo: custo,
      lucro: lucro,
      preco: preco,
      imagem: imagemPath,
    };

    const produto = await atualizarProduto(idProduto, produtoData);
    res
      .status(200)
      .json({ mensagem: "Produto atualizado com sucesso", produto });
  } catch (err) {
    console.error("Erro ao atualizar o produto: ", err);
    res.status(500).json({ mensagem: "Erro ao atualizar o produto pedido" });
  }
};

export {
  listarProdutosController,
  obterProdutoPorIdController,
  criarProdutoController,
  atualizarProdutoController,
};
