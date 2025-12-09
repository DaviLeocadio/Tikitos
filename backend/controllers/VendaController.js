import PDFDocument from "pdfkit";

import {
  listarVendas,
  obterVendaPorId,
  criarVenda,
  excluirVenda,
  listarVendasPorCaixa,
  listarVendasPorVendedor,
  obterVendaPorIdTrans,
  excluirVendaTrans,
} from "../models/Venda.js";

import {
  criarItensVenda,
  excluirItensVenda,
  listarItensVenda,
  listarItensVendaTrans,
  excluirItensVendaTrans,
} from "../models/ItensVenda.js";

import { obterProdutoPorId } from "../models/Produto.js";
import {
  AtualizarCaixa,
  CaixaAbertoVendedor,
  LerCaixaPorVendedor,
  LerCaixaPorVendedorTrans,
  CaixaAbertoVendedorTrans,
  AtualizarCaixaTrans,
} from "../models/Caixa.js";

import {
  obterProdutoLoja,
  atualizarProdutoLoja,
  obterProdutoLojaTrans,
  atualizarProdutoLojaTrans,
} from "../models/ProdutoLoja.js";
import { registrarMovimento, registrarMovimentoTrans } from "../models/MovimentoEstoque.js";
import { formatarNome, primeiroNome } from "../utils/formatadorNome.js";

import { beginTransaction, commitTransaction, rollbackTransaction } from "../config/database.js";

const listarVendasController = async (req, res) => {
  try {
    const idVendedor = req.usuarioId;

    const caixa = await LerCaixaPorVendedor(idVendedor);

    if (!caixa)
      return res
        .status(404)
        .json({ mensagem: "Nenhum caixa aberto para o vendedor" });

    const vendas = await listarVendasPorVendedor(idVendedor);

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

const obterVendaController = async (req, res) => {
  try {
    const vendas = await listarVendas();

    const valorTotal = vendas.reduce(
      (total, venda) => total + Number(venda.total),
      0
    );

    res.status(200).json({
      mensagem: "Vendas obtidas com sucesso",
      valorTotal
    });
  } catch (err) {
    res.status(500).json({
      erro: "Erro ao obter vendas",
      detalhe: err.message
    });
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
        // CORREÇÃO: usar produto.nome e produtoLoja.estoque
        return res.status(404).json({
          error: `Não há ${p.quantidade} unidades de ${produto.nome}, apenas ${produtoLoja.estoque}`,
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
  let connection;
  try {
    const { idVenda } = req.params;
    const usuarioId = req.usuarioId;
    const idEmpresa = req.usuarioEmpresa;

    if (!idVenda) return res.status(400).json({ error: "ID da venda é obrigatório" });

    // Inicia transação
    connection = await beginTransaction();

    // Buscar venda dentro da transação
    const venda = await obterVendaPorIdTrans(connection, idVenda);
    if (!venda) {
      await rollbackTransaction(connection);
      return res.status(404).json({ error: "Venda não encontrada." });
    }

    // Validações de autorização e empresa
    if (venda.id_usuario != usuarioId) {
      await rollbackTransaction(connection);
      return res.status(403).json({ error: "A venda não foi feita pelo usuário que fez a requisição" });
    }
    if (venda.id_empresa != idEmpresa) {
      await rollbackTransaction(connection);
      return res.status(403).json({ error: "A venda não pertence à empresa do usuário" });
    }

    // Verifica caixa aberto do vendedor
    const caixa = await CaixaAbertoVendedorTrans(connection, usuarioId);
    if (!caixa) {
      await rollbackTransaction(connection);
      return res.status(400).json({ error: "Nenhum caixa aberto para este vendedor" });
    }

    // Buscar itens da venda (dentro da transação)
    const itens = await listarItensVendaTrans(connection, idVenda);

    // Repor estoque em paralelo: buscar todos os registros de produto_loja e atualizar
    const produtosLoja = await Promise.all(
      itens.map((it) => obterProdutoLojaTrans(connection, it.id_produto, idEmpresa))
    );

    // Valida existência e calcula novos estoques
    const updates = produtosLoja.map((pl, idx) => {
      if (!pl) {
        throw new Error(`Produto loja não encontrado para id_produto=${itens[idx].id_produto}`);
      }
      const novoEstoque = Number(pl.estoque) + Number(itens[idx].quantidade);
      return atualizarProdutoLojaTrans(connection, pl.id_produto_loja, { estoque: novoEstoque });
    });

    await Promise.all(updates);

    // Registrar movimentos em paralelo
    const nomeVendedor = await primeiroNome(req.usuarioNome);
    const movimentos = itens.map((item) => {
      const movimentoEstoqueData = {
        id_produto: item.id_produto,
        id_empresa: idEmpresa,
        tipo: "entrada",
        quantidade: item.quantidade,
        origem: `Estorno #${venda.id_venda} - Caixa ${caixa.id_caixa} (${nomeVendedor})`,
      };
      return registrarMovimentoTrans(connection, movimentoEstoqueData);
    });

    await Promise.all(movimentos);

    // Atualizar valor do caixa
    const novoValor = Number(caixa.valor_final) - Number(venda.total);
    await AtualizarCaixaTrans(connection, caixa.id_caixa, { valor_final: novoValor });

    // Excluir itens e a venda
    await excluirItensVendaTrans(connection, idVenda);
    await excluirVendaTrans(connection, idVenda);

    // Commit
    await commitTransaction(connection);

    return res.status(200).json({ mensagem: "Venda excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir venda: ", error);
    if (connection) {
      try {
        await rollbackTransaction(connection);
      } catch (e) {
        console.error('Erro ao dar rollback: ', e);
      }
    }
    return res.status(500).json({ error: "Erro ao excluir venda desejada", detalhe: error.message });
  }
};

const listarVendasGerenteController = async (req, res) => {
  try {
    const { data, idVendedor, pagamento, dataInicio, dataFim } = req.query;
    const includeItems = req.query.itens === "true" || req.query.itens === "1" || req.query.includeItems === "true";
    const idEmpresa = req.usuarioEmpresa;

    console.log(req.query)

    let conditions = [];

    conditions.push(`id_empresa = ${idEmpresa}`);
    if (data) conditions.push(`DATE(data_venda) = '${data}'`);
    if (dataInicio && dataFim) conditions.push(`DATE(data_venda) >= '${dataInicio}' AND DATE(data_venda) < '${dataFim}'`);
    if (idVendedor) conditions.push(`id_usuario = ${idVendedor}`);
    if (pagamento) conditions.push(`tipo_pagamento = '${pagamento}'`);

    const query = conditions.join(" AND ");


    const vendas = await listarVendas(query + " ORDER BY data_venda DESC");

    if (!vendas || vendas.length === 0) {
      return res.status(404).json({ mensagem: "Nenhuma venda encontrada" });
    }

    // Se solicitado, buscar itens de cada venda e anexar
    if (includeItems) {
      try {
        const vendasComItens = await Promise.all(
          vendas.map(async (v) => {
            const itens = await listarItensVenda(`id_venda = ${v.id_venda}`);
            return { ...v, itens };
          })
        );

        return res
          .status(200)
          .json({ mensagem: "Listagem de vendas realizada", vendas: vendasComItens });
      } catch (errItems) {
        console.error("Erro ao buscar itens das vendas:", errItems);
        // Mesmo que falhem os itens, retornamos as vendas sem itens
        return res
          .status(200)
          .json({ mensagem: "Listagem de vendas realizada (itens falharam)", vendas });
      }
    }

    return res.status(200).json({ mensagem: "Listagem de vendas realizada", vendas });
  } catch (err) {
    console.error("Erro ao listar vendas: ", err);
    res.status(500).json({ mensagem: "Erro ao listar vendas: ", err });
  }
};

export {
  listarVendasController,
  obterVendaPorIdController,
  criarVendaController,
  excluirVendaController,
  listarVendasGerenteController,
  obterVendaController
};
