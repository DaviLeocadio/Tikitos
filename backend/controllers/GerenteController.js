import { json } from "express";
import {
  listarUsuarios,
  obterUsuarioPorId,
  criarUsuario,
  atualizarUsuario,
} from "../models/Usuario.js";
import { obterEmpresaPorId } from "../models/Empresa.js";
import { listarFornecedor } from "../models/Fornecedor.js";
import { listarProdutos } from "../models/Produto.js";

const listarGerentesController = async (req, res) => {
  try {
    const gerentes = await listarUsuarios("u.perfil = 'gerente'");

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

    const gerente = await obterUsuarioPorId(`id_usuario = ${gerenteId}`);

    res.status(200).json({ mensagem: "Gerente obtido com sucesso!", gerente });
  } catch (err) {
    return res.status(500).json({ err: "Erro ao obter o gerente por ID" });
  }
};

const criarGerenteController = async (req, res) => {
  try {
    const { nome, email, telefone, cpf, endereco, perfil, data_nasc } =
      req.body;

    const { idEmpresa } = req.params;

    const filial = await obterEmpresaPorId(idEmpresa);
    if (!filial)
      return res
        .status(404)
        .json({ error: "Filial não encontrada com o ID informado" });

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

    const gerenteData = {
      nome: nome,
      email: email,
      telefone: telefoneFormatado,
      cpf: cpfFormatado,
      endereco: enderecoFormatado,
      perfil: perfil,
      senha: "deve_mudar",
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
    const gerente = await obterUsuarioPorId(gerenteId);
    if (!gerente)
      return res
        .status(404)
        .json({ error: "Gerente não encontrado com o ID informado" });
    const {
      nome,
      email,
      telefone,
      cpf,
      endereco,
      perfil,
      data_nasc,
      id_empresa,
    } = req.body;

    const telefoneFormatado = telefone.replace(/\D/g, "");
    if (telefoneFormatado.lenght < 10 || telefoneFormatado.lenght > 11)
      return res.status(400).json({ error: "Telefone inválido." });

    const cpfFormatado = cpf.replace(/\D/g, "");

    if (cpfFormatado.length != 11) {
      return res.status(400).json({ error: "CPF inválido." });
    }

    let gerenteData = {
      nome: nome,
      email: email,
      telefone: telefoneFormatado,
      cpf: cpfFormatado,
      perfil: perfil,
      data_nasc: data_nasc,
      id_empresa: id_empresa,
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
      gerenteData.endereco = enderecoFormatado;
    }

    const gerenteAtualizado = await atualizarUsuario(gerenteId, gerenteData);

    return res
      .status(200)
      .json({ mensagem: "Gerente atualizado com sucesso!", gerenteAtualizado });
  } catch (err) {
    console.error("Erro ao atualizar gerente: ", err);
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

    return res
      .status(201)
      .json({ mensagem: "Gerente com status inativo!", gerenteDesativado });
  } catch (err) {
    console.log("Erro ao desativa gerente: ", err);
    return res
      .status(500)
      .json({ err: "Não foi possível desativar o gerente" });
  }
};

const ativarGerenteController = async (req, res) => {
  try {
    const { gerenteId } = req.params;

    const gerenteDesativado = atualizarUsuario(gerenteId, {
      status: "ativo",
    });

    if (!gerenteDesativado)
      return res.status(404).json({ error: "Gerente não encontrado" });

    return res
      .status(201)
      .json({ mensagem: "Gerente com status ativo!", gerenteDesativado });
  } catch (err) {
    console.log("Erro ao ativar gerente: ", err);
    return res
      .status(500)
      .json({ err: "Não foi possível ativar o gerente" });
  }
};

const metaGerenteController = async (req, res) => {
  try {
    const { fornecedores, produtos, fornecedoresSup, todosFornecedores} = req.query;
    let response = {};

    if(fornecedores){
        const listaFornecedores = await listarFornecedor(`status = 'ativo' AND tipo = 'mercadorias'`);
        response.fornecedores = listaFornecedores;
    }
    if(fornecedoresSup){
        const listaFornecedores = await listarFornecedor(`status = 'ativo' AND tipo = 'suprimentos'`);
        response.fornecedoresSup = listaFornecedores;
    }
    if(todosFornecedores){
        const listaFornecedores = await listarFornecedor(`status = 'ativo'`);
        response.fornecedores = listaFornecedores;
    }

    if(produtos){
        const listaProdutos = await listarProdutos(`status = 'ativo'`);
        response.produtos = listaProdutos;
    }

    response.mensagem = "Dados de formulário obtidos com sucesso!";

    return res.status(200).json(response)
  } catch (error) {
    console.error("Erro ao obter dados de formulario: ", error);
    res.status(500).json({ mensagem: "Erro ao obter dados de formulario" });
  }
};



export {
  listarGerentesController,
  obterGerentePorIdController,
  criarGerenteController,
  atualizarGerenteController,
  desativarGerenteController,
  ativarGerenteController,
  metaGerenteController
};
