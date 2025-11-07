import {
  listarDespesas,
  obterDespesaPorId,
  criarDespesa,
  atualizarDespesa,
  excluirDespesa,
} from "../models/Despesas.js";

// Listar todos os gastos
const listarGastosController = async (req, res) => {
  try {
    const gastos = await listarDespesas(`id_empresa = ${req.usuarioEmpresa}`);
    res.status(200).json({ mensagem: "Gastos listados com sucesso", gastos });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao listar gastos", error: error.message });
  }
};

// Adicionar novo gasto
const adicionarGastoController = async (req, res) => {
  try {
    const { data_pag, descricao, preco } = req.body;
    if (!data_pag || !descricao || !preco)
      return res
        .status(404)
        .json({ error: "Parâmetros obrigatórios ausentes" });

    const id_empresa = req.usuarioEmpresa;
    const data_adicionado = new Date();
    const gastoData = {
      id_empresa,
      data_adicionado,
      data_pag: new Date(data_pag),
      descricao,
      preco,
    };
    const gastoCriado = await criarDespesa(gastoData);
    return res
      .status(200)
      .json({ mensagem: "Gasto registrado com sucesso", gastoCriado });
  } catch (error) {
    console.error("Erro ao registrar gasto: ", err);
    res.status(500).json({ mensagem: "Erro ao registrar gasto" });
  }
};

// Atualizar gasto existente
const atualizarGastoController = async (req, res) => {
  try {
    const { idGasto } = req.params;
    const { data_pag, descricao, preco, status } = req.body;

    let gastoData = {};
    if (data_pag) gastoData.data_pag = data_pag;
    if (descricao) gastoData.descricao = descricao;
    if (preco) gastoData.preco = preco;
    if (status) gastoData.status = status;


    const gastoAtualizado = await atualizarDespesa(idGasto, gastoData);
    if (!gastoAtualizado) {
      return res.status(404).json({ message: "Gasto não encontrado" });
    }
    res
      .status(200)
      .json({ mensagem: "Gasto atualizado com sucesso", gastoAtualizado });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Erro ao atualizar gasto", errorMessage: error.message });
  }
};

// Excluir gasto
const excluirGastoController = async (req, res) => {
  try {
    const { idGasto } = req.params;

    const gastoExcluido = await excluirDespesa(idGasto);
    if (!gastoExcluido) {
      return res.status(404).json({ message: "Gasto não encontrado" });
    }
    res.status(200).json({ message: "Gasto excluído com sucesso" });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Erro ao excluir gasto", errorMessage: error.message });
  }
};

export {
  listarGastosController,
  adicionarGastoController,
  atualizarGastoController,
  excluirGastoController,
};
