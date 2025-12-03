import {
  listarProdutos,
  obterProdutoPorId,
  criarProduto,
  atualizarProduto,
} from "../models/Produto.js";

import { fileURLToPath } from "url";
import path from "path";
import { obterCategoriaPorId, listarCategorias } from "../models/Categorias.js";
import { obterProdutoLoja } from "../models/ProdutoLoja.js";
import { mascaraDinheiro } from "../utils/formatadorNumero.js";
import {
  formatarProduto,
  formatarProdutos,
} from "../utils/formatarProdutos.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const listarProdutosController = async (req, res) => {
  try {
    const usuarioEmpresa = req.usuarioEmpresa;
    const usuarioPerfil = req.usuarioPerfil;
    const produtos = await listarProdutos();
    const categorias = await listarCategorias();

    const produtosFormatadosPerfil = await formatarProdutos(
      produtos,
      usuarioPerfil !== "admin" ? usuarioEmpresa : null
    );

    const produtosFormatados = produtosFormatadosPerfil.map((produto) => {
      const categoria = categorias.find((c) => c.id_categoria == produto.id_categoria);

      return {
        ...produto,
        categoria: categoria || null
      }
    })

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

    let produto = await obterProdutoPorId(idProduto);

    if (!produto || produto.length === 0) {
      return res.status(404).json({
        mensagem: "Produto não encontrado",
      });
    }
    const usuarioEmpresa = req.usuarioEmpresa;
    const usuarioPerfil = req.usuarioPerfil;

    produto = await formatarProduto(
      produto,
      usuarioPerfil !== "admin" ? usuarioEmpresa : null
    );

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
    const { idProduto } = req.params.id;
    const { idEmpresa } = req.usuarioEmpresa;
    const {
      idCategoria,
      idFornecedor,
      nome,
      descricao,
      custo,
      lucro,
    } = req.body;

    // Validação básica
    if (!nome || nome.trim() === "") {
      return res.status(400).json({ mensagem: "Nome do produto é obrigatório" });
    }

    if (custo === undefined || custo === null || custo === "") {
      return res.status(400).json({ mensagem: "Custo é obrigatório" });
    }

    if (lucro === undefined || lucro === null || lucro === "") {
      return res.status(400).json({ mensagem: "Lucro é obrigatório" });
    }

    const preco = parseFloat(custo) * (1 + parseFloat(lucro) / 100);

    let imagemPath = null;
    if (req.file) {
      imagemPath = req.file.path.replace(
        __dirname.replace("\\controllers", ""),
        ""
      );
    }

    // Garante que valores undefined sejam convertidos para null
    const produtoData = {
      id_empresa: 100,
      id_categoria: idCategoria || null,
      id_fornecedor: idFornecedor || null,
      nome: nome,
      descricao: descricao || null,
      custo: parseFloat(custo),
      lucro: parseFloat(lucro),
      preco: preco,
      imagem: imagemPath || null,
    };

    const produto = await atualizarProduto(req.params.id, produtoData);
    res
      .status(200)
      .json({ mensagem: "Produto atualizado com sucesso", produto });
  } catch (err) {
    console.error("Erro ao atualizar o produto: ", err);
    res.status(500).json({ mensagem: "Erro ao atualizar o produto pedido" });
  }
};

const desativarProdutoController = async (req, res) => {
  try {
    const { idProduto } = req.params;

    const produtoDesativado = await atualizarProduto(idProduto, {
      status: "inativo",
    });


    if (produtoDesativado == 0)
      return res.status(404).json({ error: "Produto não encontrado" });

    return res
      .status(200)
      .json({ mensagem: "Produto desativado com sucesso", produtoDesativado });
  } catch (error) {
    console.error("Erro ao desativar produto: ", error);
    res.status(500).json({ mensagem: "Erro ao desativar produto" });
  }
};

const ativarProdutoController = async (req, res) => {
  try {
    const { idProduto } = req.params;

    const produtoAtivado = await atualizarProduto(idProduto, {
      status: "ativo",
    });

    if (produtoAtivado == 0)
      return res.status(404).json({ error: "Produto não encontrado" });

    return res
      .status(200)
      .json({ mensagem: "Produto ativado com sucesso", produtoAtivado });
  } catch (error) {
    console.error("Erro ao ativar produto: ", err);
    res.status(500).json({ mensagem: "Erro ao ativar produto" });
  }
};


export {
  listarProdutosController,
  obterProdutoPorIdController,
  criarProdutoController,
  atualizarProdutoController,
  desativarProdutoController,
  ativarProdutoController
};
