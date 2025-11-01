import {
  listarFornecedor,
  obterFornecedorPorId,
  criarFornecedor,
  atualizarFornecedor,
  desativarFornecedor,
  deletarFornecedor,
} from "../models/Fornecedor.js";

const listarFornecedoresController = async (req, res) => {
  try {
    const fornecedores = await listarFornecedor(`id_fornecedor > 0 ORDER BY FIELD(status, 'ativo', 'inativo') ASC`);
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
    const { id } = req.params;

    const fornecedor = await obterFornecedorPorId(id);
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
    const { nome, tipo, cnpj, telefone, email, endereco, cidade, estado } =
      req.body;

    const fornecedorData = {
      nome,
      tipo,
      cnpj,
      telefone,
      email,
      endereco,
      cidade,
      estado,
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
    const { id } = req.params;
    const {
      nome,
      tipo,
      cnpj,
      telefone,
      email,
      endereco,
      cidade,
      estado,
      status,
    } = req.body;

    const fornecedorData = {
      nome,
      tipo,
      cnpj,
      telefone,
      email,
      endereco,
      cidade,
      estado,
      status,
    };

    const fornecedorAtualizado = await atualizarFornecedor(id, fornecedorData);
    res.status(200).json({
      mensagem: "Fornecedor atualizado com sucesso!",
      fornecedorAtualizado,
    });
  } catch (err) {
    console.error("Erro ao atualizar fornecedor: ", err);
    res.status(500).json({ mensagem: "Erro ao atualizar o fornecedor" });
  }
};
const deletarFornecedorController = async (req, res) => {
  try {
    const { id } = req.params;
    await deletarFornecedor(id);
    res.status(200).json({ mensagem: "Fornecedor deletado com sucesso!" });
  } catch (err) {
    console.error("Erro ao deletar o fornecedor: ", err);
    res.status(500).json({ mensagem: "Erro ao deletar o fornecedor" });
  }
};
export {
  criarFornecedorController,
  listarFornecedoresController,
  obterFornecedorPorIdController,
  atualizarFornecedorController,
  deletarFornecedorController,
};
