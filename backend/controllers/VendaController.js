import {
  listarVendas,
  obterVendaPorId,
  criarVenda,
  excluirVenda,
  listarVendasPorCaixa,
} from "../models/Venda.js";

import {
  criarItensVenda,
  excluirItensVenda,
  listarItensVenda,
} from "../models/ItensVenda.js";

import { obterProdutoPorId } from "../models/Produto.js";
import { AtualizarCaixa, LerCaixaPorVendedor } from "../models/Caixa.js";

import {
  obterProdutoLoja,
  atualizarProdutoLoja,
} from "../models/ProdutoLoja.js";

const listarVendasController = async (req, res) => {
  try {
    const { idVendedor } = req.params;

    const caixa = await LerCaixaPorVendedor(idVendedor);

    if (!caixa)
      return res
        .status(404)
        .json({ mensagem: "Nenhum caixa aberto para o vendedor" });

    const vendas = await listarVendasPorCaixa(caixa.id_caixa);

    if (!vendas || vendas.lenght === 0) {
      return res
        .status(404)
        .json({ mensagem: "Nenhuma venda encontrada hoje" });
    }

    res.status(200).json({ mensagem: "Listagem de vendas realizada", vendas });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao listar vendas: ", err });
  }
};

const obterVendaPorIdController = async (req, res) => {
  try {
    const { id_venda } = req.body;

    const venda = obterVendaPorId(id_venda);
    res.status(200).json({ mensagem: "Venda obtida a partir do ID", venda });
  } catch (err) {
    res.status(500).send("Erro ao obter venda por ID: ", err);
  }
};

const criarVendaController = async (req, res) => {
  try {
    const {
      produtos,
      pagamento, // Tipo de pagamento e email do pagante
    } = req.body;

    const idVendedor = req.usuarioId;
    const idEmpresa = req.usuarioEmpresa;

    if (!idEmpresa || !idVendedor || !produtos || !pagamento) {
      return res
        .status(404)
        .json({ error: "Parâmetros obrigatórios ausentes" });
    }

    // Verificar se caixa existe e se está aberto
    const caixa = await LerCaixaPorVendedor(idVendedor);

    if (!caixa || caixa.status == "fechado")
      return res
        .status(404)
        .json({ error: "Nenhum caixa aberto para este vendedor" });

    // Dados dos itens da venda
    let valorTotal = 0;
    let vendaItemsData = [];

    for (const p of produtos) {
      if (!p.id_produto || !p.quantidade) {
        return res
          .status(404)
          .json({ error: "Parâmetros obrigatórios ausentes em produtos" });
      }
      const produto = await obterProdutoPorId(p.id_produto);

      if (!produto)
        return res
          .status(404)
          .json({ error: `Produto com ID ${p.id_produto} não encontrado` });

      // Verificar estoque
      const produtoLoja = await obterProdutoLoja(p.id_produto, idEmpresa);

      const novoEstoque = produtoLoja.estoque - p.quantidade;
      if (novoEstoque < 0) {
        return res.status(404).json({
          error: `Não há ${p.quantidade} unidades de ${p.nome}, apenas ${produtoLoja.quantidade}`,
        });
      }

      // Atualizar estoque
      const produtoAtualizado = await atualizarProdutoLoja(
        produtoLoja.id_produto_loja,
        { estoque: novoEstoque }
      );

      const subtotal = parseFloat(p.quantidade) * parseFloat(produto.preco);
      valorTotal += subtotal;

      vendaItemsData.push({
        id_produto: p.id_produto,
        quantidade: p.quantidade,
        preco_unitario: produto.preco,
        subtotal: subtotal,
      });
    }

    // Registro na tabela de vendas
    const dataVenda = {
      id_usuario: idVendedor,
      id_empresa: idEmpresa,
      id_caixa: caixa.id_caixa,
      tipo_pagamento: pagamento.tipo,
      total: valorTotal,
    };

    //Pagamento
    if (!pagamento.email || !pagamento.tipo)
      return res
        .status(404)
        .json({ error: "Parâmetros obrigatórios ausentes em pagamento." });

    const vendaCriada = await criarVenda(dataVenda);

    const vendaItensCriada = await Promise.all(
      vendaItemsData.map((item) => {
        criarItensVenda({ ...item, id_venda: vendaCriada.id || vendaCriada });
      })
    );

    const valorCaixa = parseFloat(caixa.valor_final) + parseFloat(valorTotal);

    const caixaAtualizado = await AtualizarCaixa(caixa.id_caixa, {
      valor_final: valorCaixa,
    });

    return res.status(201).json({
      mensagem: "Venda adicionada com sucesso",
      vendaCriada,
      vendaItensCriada,
      caixaAtualizado,
    });
  } catch (err) {
    console.error("Erro ao criar venda: ", err);
    res.status(500).json({ mensagem: "Erro ao criar venda" });
  }
};

const excluirVendaController = async (req, res) => {
  try {
    const { idVenda } = req.params;
    const usuarioId = req.usuarioId;
    const idEmpresa = req.usuarioEmpresa;

    const vendaExistente = await obterVendaPorId(idVenda);
    if (!vendaExistente)
      return res.status(404).json({ error: "Venda não encontrada." });

    if (vendaExistente.id_usuario != usuarioId) {
      return res.status(403).json({
        error: "A venda não foi feita pelo usuário que fez a requisição",
      });
    }

    const itensVenda = await listarItensVenda(idVenda);

    // Repor estoque
    let estoqueReposto = [];

    for (const item of itensVenda) {
      const produtoLoja = await obterProdutoLoja(item.id_produto, idEmpresa);
      const novoEstoque = produtoLoja.estoque + item.quantidade;
      const resposta = await atualizarProdutoLoja(produtoLoja.id_produto_loja, {
        estoque: novoEstoque,
      });

      estoqueReposto.push(resposta);
    }

    const caixa = await LerCaixaPorVendedor(usuarioId);
    const novoValor = caixa.valor_final - vendaExistente.total;
    const caixaAtualizado = await AtualizarCaixa(caixa.id_caixa, {
      valor_final: novoValor,
    });

    const itensVendaExcluidos = await excluirItensVenda(idVenda);
    const vendaExcluida = await excluirVenda(idVenda);

    res.status(200).json({ mensagem: "Venda excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir venda: ", error);
    res.status(500).json({ error: "Erro ao excluir venda desejada" });
  }
};

export {
  listarVendasController,
  obterVendaPorIdController,
  criarVendaController,
  excluirVendaController,
};
