import { encontrarUsuario } from "../models/AuthModel.js";
import {
  listarUsuarios,
  obterUsuarioPorId,
  criarUsuario,
  atualizarUsuario,
} from "../models/Usuario.js";

import { formatarNome } from "../utils/formatadorNome.js";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(customParseFormat);

const listarVendedoresController = async (req, res) => {
  try {
    let vendedores = [];
    let whereClause = `u.perfil = 'vendedor'`;

    if (req.usuarioPerfil !== "admin") {
      const empresaId = req.usuarioEmpresa;
      whereClause += ` AND u.id_empresa = ${empresaId}`;
    }
    vendedores = await listarUsuarios(whereClause);

    if (!vendedores)
      return res.status(404).json({ mensagem: "Nenhum vendedor cadastrado" });

    return res.status(200).json(vendedores);
  } catch (err) {
    console.error("Erro ao listar vendendores:", err);
    res.status(500).json({ mensagem: "Erro ao listar vendendores" });
  }
};

const obterVendedorPorIdController = async (req, res) => {
  try {
    const vendendor = await obterUsuarioPorId(
      `id_usuario = ${req.params.vendedorId}`
    );
    if (!vendendor) {
      res.status(404).json({ mensagem: "Vendendor não encontrado" });
    }

    return res
      .status(200)
      .json({ mensagem: "Vendedor obtido com sucesso", vendendor });
  } catch (err) {
    console.error("Erro ao obter vendendor por ID:", err);
    res.status(500).json({ mensagem: "Erro ao obter vendendor por ID" });
  }
};

const criarVendedorController = async (req, res) => {
  try {
    const { nome, email, telefone, cpf, endereco, data_nasc } = req.body;

    if (!nome || !email || !telefone || !cpf || !endereco || !data_nasc)
      return res
        .status(404)
        .json({ error: "Parâmetros obrigatórios ausentes." });

    const emailExistente = await encontrarUsuario(email);

    if (emailExistente)
      return res
        .status(409)
        .json({ error: "Já existe um cadastro com o email informado." });

    const telefoneFormatado = telefone.replace(/\D/g, "");
    if (telefoneFormatado.lenght < 10 || telefoneFormatado.lenght > 11)
      return res.status(400).json({ error: "Telefone inválido." });

    const cpfFormatado = cpf.replace(/\D/g, "");

    if (cpfFormatado.length != 11) {
      return res.status(400).json({ error: "CPF inválido." });
    }

    const dataNasc = dayjs(data_nasc, "DD/MM/YYYY");

    const dataNascSQL = dataNasc.format("YYYY-MM-DD HH:mm:ss");

    let vendendorData = {
      nome: formatarNome(nome),
      email,
      telefone: telefoneFormatado,
      cpf: cpfFormatado,
      perfil: "vendedor",
      senha: "deve_mudar",
      data_nasc: dataNascSQL,
      id_empresa: req.usuarioEmpresa,
    };

    if (endereco) {
      const { logradouro, numero, complemento, bairro, cidade, uf, cep } =
        endereco;

      if (!logradouro || !numero || !bairro || !cidade || !uf || !cep)
        return res
          .status(404)
          .json({ error: "Parâmetros do endereço faltando." });

      const enderecoFormatado = `${logradouro}, ${numero}${
        complemento ? `, ${complemento}` : ""
      } - ${bairro}, ${cidade} - ${uf}, ${cep}`;

      vendendorData.endereco = enderecoFormatado;
    }

    const vendendorId = await criarUsuario(vendendorData);
    return res
      .status(201)
      .json({ mensagem: "Vendendor criado com sucesso", vendendorId });
  } catch (error) {
    console.error("Erro ao criar vendendor:", error);
    return res.status(500).json({ mensagem: "Erro ao criar vendendor" });
  }
};

const atualizarVendedorController = async (req, res) => {
  try {
    const { vendedorId } = req.params;
    const { nome, email, telefone, cpf, endereco, data_nasc } = req.body;

    const usuarioExistente = await obterUsuarioPorId(
      `id_usuario = ${vendedorId}`
    );

    if (!usuarioExistente)
      return res.status(404).json({ error: "Usuário não encontrado." });

    if (email != usuarioExistente.email) {
      const emailExistente = await encontrarUsuario(email);

      if (emailExistente)
        return res
          .status(409)
          .json({ error: "Já existe um cadastro com o email informado." });
    }

    const telefoneFormatado = await telefone?.replace(/\D/g, "");
    if (telefoneFormatado?.lenght < 10 || telefoneFormatado?.lenght > 11)
      return res.status(400).json({ error: "Telefone inválido." });

    const cpfFormatado = await cpf?.replace(/\D/g, "");

    if (cpfFormatado?.length != 11) {
      return res.status(400).json({ error: "CPF inválido." });
    }

    const dataNasc = dayjs(data_nasc, "DD/MM/YYYY");

    const dataNascSQL = dataNasc.format("YYYY-MM-DD HH:mm:ss");

    let vendendorData = {
      nome: formatarNome(nome),
      email,
      telefone: telefoneFormatado,
      cpf: cpfFormatado,
      perfil: "vendedor",
      data_nasc: dataNascSQL,
      id_empresa: req.usuarioEmpresa,
      endereco,
    };

    const vendendorAtualizado = await atualizarUsuario(
      vendedorId,
      vendendorData
    );
    return res.status(201).json({
      mensagem: "Vendendor atualizado com sucesso",
      vendendorAtualizado,
    });
  } catch (error) {
    console.error("Erro ao atualizar vendendor:", error);
    return res.status(500).json({ mensagem: "Erro ao atualizar vendendor" });
  }
};

const desativarVendedorController = async (req, res) => {
  try {
    const { vendedorId } = req.params;

    const vendedorDesativado = await atualizarUsuario(vendedorId, {
      status: "inativo",
    });
    if (!vendedorDesativado)
      return res.status(404).json({ error: "Vendedor não encontrado" });

    return res.status(200).json({
      mensagem: "Vendedor com status inativo realizado!",
      vendedorDesativado,
    });
  } catch (error) {
    consoler.error("Erro ao atualizar o status do vendedor: ", error);
    return res
      .status(500)
      .json({ error: "Erro ao atualizar o status do vendedor" });
  }
};
const reativarVendedorController = async (req, res) => {
  try {
    const { vendedorId } = req.params;

    const vendedorReativado = await atualizarUsuario(vendedorId, {
      status: "ativo",
    });
    if (!vendedorReativado)
      return res.status(404).json({ error: "Vendedor não encontrado" });

    return res.status(200).json({
      mensagem: "Vendedor com status ativo realizado!",
      vendedorReativado,
    });
  } catch (error) {
    consoler.error("Erro ao atualizar o status do vendedor: ", error);
    return res
      .status(500)
      .json({ error: "Erro ao atualizar o status do vendedor" });
  }
};

export {
  listarVendedoresController,
  obterVendedorPorIdController,
  criarVendedorController,
  atualizarVendedorController,
  desativarVendedorController,
  reativarVendedorController
};
