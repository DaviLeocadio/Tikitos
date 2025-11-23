import PDFDocument from "pdfkit";

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
import {
  AtualizarCaixa,
  CaixaAbertoVendedor,
  LerCaixaPorVendedor,
} from "../models/Caixa.js";

import {
  obterProdutoLoja,
  atualizarProdutoLoja,
} from "../models/ProdutoLoja.js";
import { registrarMovimento } from "../models/MovimentoEstoque.js";
import { formatarNome, primeiroNome } from "../utils/formatadorNome.js";

const listarVendasController = async (req, res) => {
  try {
    const idVendedor = req.usuarioId;

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
      pagamento, // Tipo de pagamento e cpf do pagante
    } = req.body;

    const idVendedor = req.usuarioId;
    const idEmpresa = req.usuarioEmpresa;

    if (!idEmpresa || !idVendedor || !produtos || !pagamento) {
      return res
        .status(404)
        .json({ error: "Parâmetros obrigatórios ausentes" });
    }

    // Verificar se caixa existe e se está aberto
    const caixa = await CaixaAbertoVendedor(idVendedor);

    if (!caixa)
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
    if (!pagamento.cpf || !pagamento.tipo)
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

    // Registrar movimentação de estoque

    for (const p of produtos) {
      const nomeVendedor = await primeiroNome(req.usuarioNome);

      const movimentoEstoqueData = {
        id_produto: p.id_produto,
        id_empresa: idEmpresa,
        tipo: "saída",
        quantidade: p.quantidade,
        origem: `Venda #${vendaCriada} - Caixa ${caixa.id_caixa} (${nomeVendedor})`,
      };

      const movimentoEstoqueRegistrado = await registrarMovimento(
        movimentoEstoqueData
      );
    }

    // Geração do comprovante
    const doc = new PDFDocument({ margin: 40, size: "A5" });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);

      // Retorna o JSON com o PDF em base64
      return res.status(201).json({
        mensagem: "Venda adicionada com sucesso",
        vendaCriada,
        vendaItensCriada,
        caixaAtualizado,
        pdf: pdfData.toString("base64"),
      });
    });

    // Conteúdo do PDF
    doc.fontSize(16).text("Tikitos Brinquedos", { align: "center" });
    doc
      .fontSize(10)
      .text("Pequenos momentos, grandes sorrisos", { align: "center" });
    doc.moveDown();

    doc.fontSize(10).text(`Filial: ${idEmpresa}`);
    doc.text(`Caixa: ${caixa.id_caixa}`);
    doc.text(`Vendedor: ${await primeiroNome(req.usuarioNome)}`);
    doc.text(`Data: ${new Date().toLocaleString()}`);
    doc.text(`Forma de pagamento: ${pagamento.tipo}`);
    doc.text(`CPF: ${pagamento.cpf}`);
    doc.moveDown();

    doc.fontSize(12).text("Itens:", { underline: true });
    vendaItemsData.forEach((item) => {
      doc
        .fontSize(10)
        .text(
          `${item.quantidade}x Produto #${item.id_produto}  R$${Number(
            item.preco_unitario
          ).toFixed(2)}  =  R$${Number(item.subtotal).toFixed(2)}`
        );
    });

    doc.moveDown();
    doc
      .fontSize(12)
      .text(`Total: R$${Number(valorTotal).toFixed(2)}`, { align: "right" });
    doc.moveDown();
    doc.text("-------------------------------", { align: "center" });
    doc
      .fontSize(10)
      .text("Obrigado por comprar com a Tikitos", { align: "center" });
    doc.text("Pequenos momentos, grandes sorrisos!", { align: "center" });

    doc.end();
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

    const caixa = await LerCaixaPorVendedor(usuarioId);
    const novoValor = caixa.valor_final - vendaExistente.total;

    // Repor estoque
    let estoqueReposto = [];

    for (const item of itensVenda) {
      const produtoLoja = await obterProdutoLoja(item.id_produto, idEmpresa);
      const novoEstoque = produtoLoja.estoque + item.quantidade;
      const resposta = await atualizarProdutoLoja(produtoLoja.id_produto_loja, {
        estoque: novoEstoque,
      });

      estoqueReposto.push(resposta);

      const nomeVendedor = await primeiroNome(req.usuarioNome);

      const movimentoEstoqueData = {
        id_produto: item.id_produto,
        id_empresa: idEmpresa,
        tipo: "entrada",
        quantidade: item.quantidade,
        origem: `Estorno #${vendaExistente.id_venda} - Caixa ${caixa.id_caixa} (${nomeVendedor})`,
      };

      const movimentoEstoqueRegistrado = await registrarMovimento(
        movimentoEstoqueData
      );
    }

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

const listarVendasGerenteController = async (req, res) => {
  try {
    const { data, idVendedor, pagamento } = req.query;
    const idEmpresa = req.usuarioEmpresa;

    let conditions = [];

    conditions.push(`id_empresa = ${idEmpresa}`);
    if (data) conditions.push(`DATE(data_venda) = '${data}'`);
    if (idVendedor) conditions.push(`id_usuario = ${idVendedor}`);
    if (pagamento) conditions.push(`tipo_pagamento = '${pagamento}'`);

    const query = conditions.join(" AND ");

    const vendas = await listarVendas(query);

    if (!vendas || vendas.lenght === 0) {
      return res.status(404).json({ mensagem: "Nenhuma venda encontrada" });
    }

    return res
      .status(200)
      .json({ mensagem: "Listagem de vendas realizada", vendas });
  } catch (err) {
    console.error("Erro ao excluir venda: ", err);
    res.status(500).json({ mensagem: "Erro ao listar vendas: ", err });
  }
};

export {
  listarVendasController,
  obterVendaPorIdController,
  criarVendaController,
  excluirVendaController,
  listarVendasGerenteController,
};
