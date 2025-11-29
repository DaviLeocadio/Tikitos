import dotenv from "dotenv";
dotenv.config();

import { obterProdutoPorId } from "../models/Produto.js";
import {
  listarProdutosLoja,
  obterProdutoLoja,
  criarProdutoLoja,
  atualizarProdutoLoja,
  deletarProdutoLoja,
  verificarEstoque,
} from "../models/ProdutoLoja.js";
import { formatarProdutos } from "../utils/formatarProdutos.js";
import { mascaraDinheiro } from "../utils/formatadorNumero.js";
import { obterFornecedorPorId } from "../models/Fornecedor.js";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { criarDespesa } from "../models/Despesas.js";
import { registrarMovimento } from "../models/MovimentoEstoque.js";

dayjs.extend(customParseFormat);

const atualizarProdutoLojaController = async (req, res) => {
  try {
    const { desconto, estoque } = req.body;
    const { idProduto } = req.params;
    const idEmpresa = req.usuarioEmpresa;

    const produto = await obterProdutoPorId(idProduto);
    if (!produto)
      return res.status(404).json({ error: "Produto não encontrado" });

    const produtoLoja = await obterProdutoLoja(idProduto, idEmpresa);
    if (!produtoLoja)
      return res
        .status(404)
        .json({ error: "Registro não encontrado em produto_loja" });

    let produtoLojaData = {};

    if (desconto) {
      if (desconto < 0 || desconto > 100) {
        return res
          .status(400)
          .json({ error: "O desconto deve estar entre 0 e 100." });
      }
      produtoLojaData.desconto = desconto;
    }

    if (estoque) {
      if (estoque < 0) {
        return res
          .status(400)
          .json({ error: "O estoque não pode ser menor que 0." });
      }
      produtoLojaData.estoque = estoque;
    }

    const produtoLojaAtualizado = await atualizarProdutoLoja(
      produtoLoja.id_produto_loja,
      produtoLojaData
    );

    return res.status(200).json({
      mensagem: "Produto atualizado com sucesso na loja",
      produtoLojaAtualizado,
    });
  } catch (err) {
    console.error("Erro ao atualizar o produto na loja: ", err);
    res.status(500).json({ mensagem: "Erro ao atualizar o produto pedido" });
  }
};

const estoqueBaixoController = async (req, res) => {
  try {
    const idEmpresa = req.usuarioEmpresa;
    const produtoLojaArray = await listarProdutosLoja(
      `id_empresa = ${idEmpresa}`
    );

    if (!produtoLojaArray || produtoLojaArray.length == 0) {
      return res
        .status(404)
        .json({ error: "Nenhuma relação produto-loja encontrada na empresa" });
    }

    const estoqueMin = process.env.ESTOQUE_MINIMO;

    const estoqueBaixo = produtoLojaArray.filter((p) => p.estoque < estoqueMin);
    if (estoqueBaixo.length == 0)
      return res.status(200).json({
        mensagem: `Nenhum produto com estoque abaixo de ${estoqueMin} unidades`,
        code: "ESTOQUE",
      });

    let produtosComEstoqueBaixo = [];

    await Promise.all(
      estoqueBaixo.map(async (e) => {
        const produto = await obterProdutoPorId(e.id_produto);
        produtosComEstoqueBaixo.push(produto);
      })
    );

    const usuarioEmpresa = req.usuarioEmpresa;

    produtosComEstoqueBaixo = await formatarProdutos(
      produtosComEstoqueBaixo,
      usuarioEmpresa
    );

    return res.status(200).json({
      mensagem: "Produtos com estoque baixo consultados com sucesso",
      produtosComEstoqueBaixo,
    });
  } catch (err) {
    console.error("Erro ao consultar produtos com estoque baixo: ", err);
    res
      .status(500)
      .json({ mensagem: "Erro ao consultar produtos com estoque baixo" });
  }
};

const visualizarEstoqueController = async (req, res) => {
  try {
    const { idFilial } = req.body;

    if (!idFilial)
      return res
        .status(401)
        .json({ mensagem: "Parâmetros obrigatórios não preenchidos!" });

    const produtosLoja = listarProdutosLoja(`id_empresa = ${idFilial}`);

    return res.status(200).json({
      mensagem: "Estoque listado com sucesso!",
      produtos: produtosLoja,
    });
  } catch (err) {
    console.error("Erro ao consultar produtos com estoque baixo: ", err);
    res
      .status(500)
      .json({ err: "Erro ao consultar produtos com estoque baixo" });
  }
};

const pedidoProdutoController = async (req, res) => {
  try {
    const { idProduto } = req.params;
    const { quantidade, data_pag, status } = req.body;
    const empresaId = req.usuarioEmpresa;

    const produto = await obterProdutoPorId(idProduto);
    if (!produto)
      return res.status(404).json({ error: "Produto não encontrado" });

    // Adicionar ao estoque
    const produtoLoja = await obterProdutoLoja(idProduto, empresaId);
    const novoEstoque = produtoLoja.estoque + quantidade;
    const estoqueAtualizado = await atualizarProdutoLoja(
      produtoLoja.id_produto_loja,
      { estoque: novoEstoque }
    );

    // Registrar em despesas
    const valor = Number(quantidade) * parseFloat(produto.custo);

    const dataPag = dayjs(data_pag, "DD/MM/YYYY");
    const dataPagSQL = dataPag.format("YYYY-MM-DD");

    const fornecedor = await obterFornecedorPorId(produto.id_fornecedor);

    const descricao = `Pedido: ${quantidade} unidades de ${
      produto.nome
    } do fornecedor ${fornecedor.nome} - ${mascaraDinheiro(
      produto.custo
    )} × ${quantidade} : ${mascaraDinheiro(valor)}`;
    const despesaData = {
      id_empresa: empresaId,
      data_pag: dataPagSQL,
      descricao,
      preco: valor,
      status,
    };
    const despesaAdicionada = await criarDespesa(despesaData);

    // Registrar movimento_estoque
    const origemMovimento = `Pedido #${despesaAdicionada} - Fornecedor ${produto.id_fornecedor}`;
    const movimentoData = {
      id_produto: idProduto,
      id_empresa: empresaId,
      tipo: "entrada",
      quantidade,
      origem: origemMovimento,
    };
    const movimentoCriado = await registrarMovimento(movimentoData);

    return res
      .status(201)
      .json({
        mensagem: "Pedido realizado com sucesso!",
        estoqueAtualizado,
        despesaAdicionada,
        movimentoCriado,
      });
      
  } catch (err) {
    console.error("Erro ao fazer pedido: ", err);
    res.status(500).json({ err: "Erro ao fazer pedido: " });
  }
};

export {
  atualizarProdutoLojaController,
  estoqueBaixoController,
  pedidoProdutoController,
};
