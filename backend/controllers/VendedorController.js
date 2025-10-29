import { encontrarUsuario } from "../models/AuthModel.js";
import {
  listarUsuarios,
  obterUsuarioPorId,
  criarUsuario,
  atualizarUsuario,
} from "../models/Usuario.js";

import { formatarNome } from "../utils/formatadorNome.js";

const listarVendedoresController = async (req, res) => {
  try {
    const empresaId = req.usuarioEmpresa;

    const vendedores = await listarUsuarios(
      `id_empresa = ${empresaId} AND perfil = 'vendedor'`
    );

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
    const vendendor = await obterVendendorPorId(req.params.vendedorId);
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

    const { logradouro, numero, complemento, bairro, cidade, uf, cep } =
      endereco;

    if (!logradouro || !numero || !bairro || !cidade || !uf || !cep)
      return res
        .status(404)
        .json({ error: "Parâmetros do endereço faltando." });

    const enderecoFormatado = `${logradouro}, ${numero}${
      complemento ? `, ${complemento}` : ""
    }, ${bairro}, ${cidade}/${uf}, ${cep}`;

    const vendendorData = {
      nome: formatarNome(nome),
      email,
      telefone: telefoneFormatado,
      cpf: cpfFormatado,
      endereco: enderecoFormatado,
      perfil: "vendedor",
      senha: "deve_mudar",
      data_nasc,
      id_empresa: req.usuarioEmpresa,
    };

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
    const { nome, email, telefone, cpf, endereco, data_nasc } = req.body;
    const { idUsario } = req.params;
    
    if (!nome || !email || !telefone || !cpf || !endereco || !data_nasc)
      return res
        .status(404)
        .json({ error: "Parâmetros obrigatórios ausentes." });

    const emailExistente = await encontrarUsuario(email);

    if (!emailExistente)
      return res
        .status(404)
        .json({ error: "Já existe um cadastro com o email informado." });

    const telefoneFormatado = telefone.replace(/\D/g, "");
    if (telefoneFormatado.lenght < 10 || telefoneFormatado.lenght > 11)
      return res.status(400).json({ error: "Telefone inválido." });

    const cpfFormatado = cpf.replace(/\D/g, "");

    if (cpfFormatado.length != 11) {
      return res.status(400).json({ error: "CPF inválido." });
    }

    const { logradouro, numero, complemento, bairro, cidade, uf, cep } =
      endereco;

    if (!logradouro || !numero || !bairro || !cidade || !uf || !cep)
      return res
        .status(404)
        .json({ error: "Parâmetros do endereço faltando." });

    const enderecoFormatado = `${logradouro}, ${numero}${
      complemento ? `, ${complemento}` : ""
    }, ${bairro}, ${cidade}/${uf}, ${cep}`;

    const vendendorData = {
      nome: formatarNome(nome),
      email,
      telefone: telefoneFormatado,
      cpf: cpfFormatado,
      endereco: enderecoFormatado,
      perfil: "vendedor",
      senha: "deve_mudar",
      data_nasc,
      id_empresa: req.usuarioEmpresa,
    };

    const vendendorId = await criarUsuario(vendendorData);
    return res
      .status(201)
      .json({ mensagem: "Vendendor criado com sucesso", vendendorId });
  } catch (error) {
    console.error("Erro ao criar vendendor:", error);
    return res.status(500).json({ mensagem: "Erro ao criar vendendor" });
  }
};

const excluirVendedorController = async (req, res) => {
  try {
    const vendendorId = req.params.id;
    await excluirVendendor(vendendorId);
    res.status(200).json({ mensagem: "Vendendor excluído com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir vendendor:", err);
    res.status(500).json({ mensagem: "Erro ao excluir vendendor" });
  }
};

export {
  listarVendedoresController,
  obterVendedorPorIdController,
  criarVendedorController,
  atualizarVendedorController,
  excluirVendedorController,
};
