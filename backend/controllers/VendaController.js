import {
  listarVendas,
  obterVendaPorId,
  criarVenda,
  atualizarVenda,
} from "../models/Venda.js";

import { criarItensVenda } from "../models/ItensVenda.js";

const listarVendasController = async (req, res) => {
  try {
    const vendas = listarVendas();
    res.status(200).json({ message: "Listagem de vendas realizada", vendas });
  } catch (err) {
    res.status(500).json({ message: "Erro ao listar vendas: ", err });
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
      total,
      idEmpresa,
      idVendedor,
      produtos,
      pagamento, // Tipo de pagamento e email do pagante
    } = req.body;

    if (!total || !idEmpresa || !idVendedor || !produtos || !pagamento) {
      return res
        .status(404)
        .json({ error: "Parâmetros obrigatórios ausentes" });
    }

    // Registro na tabela de vendas

    const dataVenda = {
      id_usuario: idVendedor,
      id_empresa: idEmpresa,
      tipo_pagamento: tipo_pagamento,
      total: total,
    };

    // Registro na tabela de venda_items

    let valorTotal = 0;

    const vendaItemsData = produtos.map(async (p) => {
      if (!p.id_produto || !p.quantidade)
        return res
          .status(404)
          .json({ error: "Parâmetros obrigatórios ausentes em produtos" });

      const produto = await obterProdutoPorId(p.id_produto);

      if (!produto)
        return res
          .status(404)
          .json({ error: `Produto com ID ${p.id_produto} não encontrado` });

      const subtotal = p.quantidade * produto.preco;
      valorTotal += subtotal;
      return {
        id_produto: p.id_produto,
        quantidade: p.quantidade,
        preco_unitario: produto.preco,
        subtotal: subtotal,
      };
    });

    //Pagamento

    if (!pagamento.email || !pagamento.tipo)
      return res
        .status(404)
        .json({ error: "Parâmetros obrigatórios ausentes em pagamento." });


    const vendaCriada = await criarVenda(dataVenda);
    console.log(vendaCriada);

    vendaItensCriada.map(() => {
      return {
        id_venda: vendaCriada.id,
      };
    });

    const vendaItensCriada = await criarItensVenda(vendaItemsData);

    return res
      .status(201)
      .json({ mensagem: "Venda adicionada com sucesso", respostaPagamento, vendaCriada, vendaItensCriada  });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao criar venda" });
  }
};

export {
  listarVendasController,
  obterVendaPorIdController,
  criarVendaController,
};
