import { json } from "express";
import {
  listarUsuarios,
  obterUsuarioPorId,
  criarUsuario,
  atualizarUsuario,
} from "../models/Usuario.js";

const listarGerentesController = async (req, res) => {
  try {
    const gerentes = await listarUsuarios("perfil = gerente");

    res
      .status(200)
      .json({ mensagem: "Gerentes listados com sucesso!", gerentes });
  } catch (err) {
    return res.status(500).json({ err: "Erro ao listar gerente" });
  }
};

const obterGerentePorIdController = async (req, res) => {
  try {
    const { gerenteId } = req.params;

    const gerente = await obterUsuarioPorId(gerenteId);

    res.status(200).json({ mensagem: "Gerente obtido com sucesso!", gerente });
  } catch (err) {
    return res.status(500).json({ err: "Erro ao obter o gerente por ID" });
  }
};

const criarGerenteController = async (req, res) => {
  try {
    const {
      nome,
      email,
      telefone,
      cpf,
      endereco,
      perfil,
      data_nasc,
      idEmpresa,
    } = req.body;

    const gerenteData = {
      nome: nome,
      email: email,
      telefone: telefone,
      cpf: cpf,
      endereco,
      perfil: perfil,
      data_nasc: data_nasc,
      id_empresa: idEmpresa,
    };

    const gerenteCriado = await criarUsuario(gerenteData);

    res
      .status(201)
      .json({ mensagem: "Gerente criado com sucesso!", gerenteCriado });
  } catch (err) {
    return res.status(500).json({ err: "Erro ao criar gerente" });
  }
};

const atualizarGerenteController = async (req, res) => {
  try {
    const { gerenteId } = req.params;
    const {
      nome,
      email,
      telefone,
      cpf,
      endereco,
      perfil,
      data_nasc,
      idEmpresa,
    } = req.body;

    const gerenteData = {
      nome: nome,
      email: email,
      telefone: telefone,
      cpf: cpf,
      endereco,
      perfil: perfil,
      data_nasc: data_nasc,
      id_empresa: idEmpresa,
    };

    const gerenteAtualizado = atualizarUsuario(gerenteId, gerenteData);

    res
      .status(200)
      .json({ mensagem: "Gerente atualizado com sucesso!", gerenteAtualizado });
  } catch (err) {
    return res
      .status(500)
      .json({ err: "Não foi possível atualizar o gerente" });
  }
};

const desativarGerenteController = async (req, res) => {
  try {
    const { gerenteId } = req.params;

    const gerenteDesativado = atualizarUsuario(gerenteId, {
      status: "inativo",
    });

    if (!gerenteDesativado)
      return res.status(404).json({ error: "Gerente não encontrado" });

    res
      .status(201)
      .json({ mensagem: "Gerente com status inativo!", gerenteDesativado });
  } catch (err) {
    console.log("Erro ao desativa gerente: ", err);
    return res
      .status(500)
      .json({ err: "Não foi possível desativar o gerente" });
  }
};

export {
  listarGerentesController,
  obterGerentePorIdController,
  criarGerenteController,
  atualizarGerenteController,
  desativarGerenteController
};
