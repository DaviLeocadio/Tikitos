import {
  listarProdutos,
  obterProdutoPorId,
  criarProduto,
  atualizarProduto,
} from "../models/Produto.js";


const listarProdutosController = async (req, res) => {
  try {
    const produtos = await listarProdutos();
    res.status(200).json({
      mensagem: "Listagem de produtos realizada com sucesso",
      produtos,
    });
  } catch (err) {
    console.error("Erro ao listar produtos: ", err);
    res.status(500).json({ mensagem: "Erro na listagem de produtos" });
  }
};

const obterProdutoPorIdController = async (req, res) => {
  try {
    const { idProduto } = req.params;

    const produto = obterProdutoPorId(idProduto);
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

    const produtoData = {
      id_empresa: idEmpresa,
      id_categoria: idCategoria,
      id_fornecedor: idFornecedor,
      nome: nome,
      descricao: descricao,
      custo: custo,
      lucro: lucro,
      preco: preco,
      imagem: imagem,
    };

    const produto = criarProduto(produtoData);
    res.status(201).json({ mensagem: "Produto criado com sucesso", produto });
  } catch (err) {
    console.error("Erro ao criar o produto: ", err);
    res.status(500).json({ mensagem: "Erro ao criar o produto desejado" });
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
      imagem,
    } = req.body;

    const produtoData = {
      id_empresa: idEmpresa,
      id_categoria: idCategoria,
      id_fornecedor: idFornecedor,
      nome: nome,
      descricao: descricao,
      custo: custo,
      lucro: lucro,
      preco: preco,
      imagem: imagem,
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
