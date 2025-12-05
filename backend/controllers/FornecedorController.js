import {
  listarFornecedor,
  obterFornecedorPorId,
  criarFornecedor,
  atualizarFornecedor,
  desativarFornecedor,
} from "../models/Fornecedor.js";

const listarFornecedoresController = async (req, res) => {
  try {
    const fornecedores = await listarFornecedor();
    res
      .status(200)
      .json({ mensagem: "Fornecedores listado com sucesso!", fornecedores });
  } catch (err) {
    console.error("Erro ao listar fornecedores: ", err);
    res.status(500).json({ mensagem: "Erro ao listar fornecedor" });
  }
};

const obterFornecedorPorIdController = async (req, res) => {
  try {
    const { idFornecedor } = req.params;

    const fornecedor = obterFornecedorPorId(idFornecedor);
    res
      .status(200)
      .json({ mensagem: "Fornecedor obtido a partir do ID", fornecedor });
  } catch (err) {
    console.error("Erro ao obter o fornecedor por ID: ", err);
    res.status(500).json({ mensagem: "Erro ao listar fornecedor" });
  }
};

const criarFornecedorController = async (req, res) => {
  try {
    const { nome } = req.body;

    const fornecedorData = {
      nome: nome,
      status: "ativo",
    };

    const fornecedorCriado = await criarFornecedor(fornecedorData);
    res
      .status(201)
      .json({ mensagem: "Fornecedor criado com sucesso" }, fornecedorCriado);
  } catch (err) {
    console.error("Erro ao criar o fornecedor: ", err);
    res.status(500).json({ mensagem: "Erro ao listar fornecedor" });
  }
};

const atualizarFornecedorController = async (req, res) => {
  try {
    const { idFornecedor } = req.params;
    const { nome, status } = req.body;

    const fornecedorData = {
      nome: nome,
      status: status,
    };

    const fornecedorAtualizado = await atualizarFornecedor(
      idFornecedor,
      fornecedorData
    );
    res.status(200).json({
      mensagem: "Fornecedor atualizado com sucesso!",
      fornecedorAtualizado,
    });
  } catch (err) {
    console.error("Erro ao atualizar fornecedor: ", err);
    res.status(500).json({ mensagem: "Erro ao atualizar o fornecedor" });
  }
};
const desativarFornecedorController = async (req, res) => {
  try {
    const { id } = req.params;
    await desativarFornecedor(id);
    res.status(200).json({ mensagem: "Fornecedor desativado com sucesso!" });
  } catch (err) {
    console.error("Erro ao desativar o fornecedor: ", err);
    res.status(500).json({ mensagem: "Erro ao desativar o fornecedor" });
  }
};
export {
  criarFornecedorController,
  listarFornecedoresController,
  obterFornecedorPorIdController,
  atualizarFornecedorController,
  desativarFornecedorController,
};
