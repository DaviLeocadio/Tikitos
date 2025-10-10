import {
  listarVendas,
  obterVendaPorId,
  criarVenda,
  atualizarVenda,
} from "../models/Venda.js";

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
    const { tipo_pagamento, total, idEmpresa, idVendedor } = req.body;

    const data =
      new Date().getFullYear() +
      "/" +
      (new Date().getMonth() + 1) +
      "/" +
      new Date().getDay() +
      " " +
      new Date().getHours() +
      ":" +
      new Date().getMinutes() +
      ":" +
      new Date().getSeconds();

    const dataVenda = {
      id_usuario: idVendedor,
      id_empresa: idEmpresa,
      data_venda: data,
      tipo_pagamento: tipo_pagamento,
      total: total,
    };

    const vendaCriada = criarVenda(dataVenda);
    res
      .status(201)
      .json({ mensagem: "Venda adicionada com sucesso", vendaCriada });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao criar venda" });
  }
};

export {
  listarVendasController,
  obterVendaPorIdController,
  criarVendaController,
};
