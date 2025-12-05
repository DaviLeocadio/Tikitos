import { despesasPagas, despesasPendentes, criarDespesa, listarDespesas, atualizarDespesa } from "../models/Despesas.js";

const despesasPagasController = async (req, res) => {
  try {
    const despesas = await despesasPagas();

    const valorDespesas = despesas.reduce(
      (total, despesa) => total + Number(despesa.preco || 0),
      0
    );

    return res.status(200).json({
      mensagem: "Despesas pagas encontradas",
      valorDespesas
    });
  } catch (err) {
    return res.status(500).json({ erro: "Erro ao buscar despesas pagas" });
  }
};

const despesasPendentesController = async (req, res) => {
  try {
    const despesas = await despesasPendentes();

    const valorDespesas = despesas.reduce(
      (total, despesa) => total + Number(despesa.preco || 0),
      0
    );

    return res.status(200).json({
      mensagem: "Despesas pendentes encontradas",
      valorDespesas
    });
  } catch (err) {
    return res.status(500).json({ erro: "Erro ao buscar despesas pendentes" });
  }
};

const criarDespesaController = async (req, res) => {
  try {
    const { data_pag, descricao, preco, status } = req.body;

    // validações essenciais
    if (!descricao || !preco) {
      return res.status(400).json({
        erro: "Descrição e preço são obrigatórios"
      });
    }

    if (!["pago", "pendente"].includes(status)) {
      return res.status(400).json({
        erro: "Status inválido"
      });
    }

    const despesaData = {
      id_empresa: 100,
      data_adicionado: new Date(),
      data_pag,
      descricao,
      preco: Number(preco),
      status
    };

    const despesaCriada = await criarDespesa(despesaData);

    return res.status(201).json({
      mensagem: "Despesa criada com sucesso",
      despesaCriada
    });
  } catch (err) {
    return res.status(500).json({ err: "Erro ao criar despesa" });
  }
};

const listarDespesasController = async (req, res) => {
  try {
    const despesasListadas = await listarDespesas();
    res.status(200).json({ mensagem: "Despesa listada", despesasListadas })
  } catch (err) {
    return res.status(500).json({ err: "Erro ao listar despesa" });
  }
}

const pagarDespesaController = async (req, res) => {
  try {
    const { despesaId } = req.params;

    const data_pag = new Date().toISOString().split("T")[0];

    const despesaAtualizada = await atualizarDespesa(despesaId, {
      status: "pago",
      data_pag
    });

    if (!despesaAtualizada) {
      return res.status(404).json({
        error: "Despesa não encontrada"
      });
    }

    return res.status(200).json({
      mensagem: "Despesa marcada como paga com sucesso!",
      despesa: despesaAtualizada
    });

  } catch (error) {
    console.error("Erro ao atualizar status da despesa:", error);
    return res.status(500).json({
      error: "Erro ao atualizar status da despesa"
    });
  }
};

export {
  despesasPagasController,
  despesasPendentesController,
  criarDespesaController,
  pagarDespesaController,
  listarDespesasController
};
