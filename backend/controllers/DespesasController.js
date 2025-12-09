import {
  despesasPagas,
  despesasPendentes,
  criarDespesa,
  listarDespesas,
  atualizarDespesa,
  excluirDespesa,
} from "../models/Despesas.js";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(customParseFormat);

const despesasPagasController = async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;

    // construir cláusula WHERE para despesas pagas
    let where = `d.status = 'pago'`;
    if (dataInicio && dataFim) {
      where += ` AND DATE(d.data_pag) BETWEEN '${dataInicio}' AND '${dataFim}'`;
    }

    const despesas = await listarDespesas(where);
    const valorDespesas = despesas.reduce(
      (total, despesa) => total + Number(despesa.preco || 0),
      0
    );

    return res.status(200).json({ mensagem: "Despesas pagas encontradas", valorDespesas });
  } catch (err) {
    return res.status(500).json({ erro: "Erro ao buscar despesas pagas" });
  }
};

const despesasPendentesController = async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;

    // construir cláusula WHERE para despesas pendentes
    let where = `d.status = 'pendente'`;
    if (dataInicio && dataFim) {
      // para pendentes, filtrar por data_adicionado (quando foi criada)
      where += ` AND DATE(d.data_adicionado) BETWEEN '${dataInicio}' AND '${dataFim}'`;
    }

    const despesas = await listarDespesas(where);
    const valorDespesas = despesas.reduce(
      (total, despesa) => total + Number(despesa.preco || 0),
      0
    );

    return res.status(200).json({ mensagem: "Despesas pendentes encontradas", valorDespesas });
  } catch (err) {
    return res.status(500).json({ erro: "Erro ao buscar despesas pendentes" });
  }
};

const criarDespesaController = async (req, res) => {
  try {
    const { data_pag, descricao, preco, status, id_fornecedor } = req.body;

    // validações essenciais
    if (!descricao || !preco) {
      return res.status(400).json({
        erro: "Descrição e preço são obrigatórios",
      });
    }

    if (!["pago", "pendente"].includes(status)) {
      return res.status(400).json({
        erro: "Status inválido",
      });
    }

    const dataPag = dayjs(data_pag, "DD/MM/YYYY");

    const dataPagSQL = dataPag.format("YYYY-MM-DD");

    const despesaData = {
      id_empresa: 100,
      data_adicionado: new Date(),
      data_pag: dataPagSQL,
      descricao,
      preco: Number(preco),
      id_fornecedor: id_fornecedor || null,
      status,
    };

    const despesaCriada = await criarDespesa(despesaData);

    return res.status(201).json({
      mensagem: "Despesa criada com sucesso",
      despesaCriada,
    });
  } catch (err) {
    return res.status(500).json({ err: "Erro ao criar despesa" });
  }
};

const listarDespesasController = async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;

    let where = null;
    if (dataInicio && dataFim) {
      // filtrar pela data de adição da despesa
      where = `DATE(d.data_adicionado) BETWEEN '${dataInicio}' AND '${dataFim}' ORDER BY data_adicionado DESC`;
    }

    const despesasListadas = await listarDespesas(where);
    res.status(200).json({ mensagem: "Despesa listada", despesasListadas });
  } catch (err) {
    return res.status(500).json({ err: "Erro ao listar despesa" });
  }
};

const pagarDespesaController = async (req, res) => {
  try {
    const { despesaId } = req.params;

    const data_pag = new Date().toISOString().split("T")[0];

    const despesaAtualizada = await atualizarDespesa(despesaId, {
      status: "pago",
      data_pag,
    });

    if (!despesaAtualizada) {
      return res.status(404).json({
        error: "Despesa não encontrada",
      });
    }

    return res.status(200).json({
      mensagem: "Despesa marcada como paga com sucesso!",
      despesa: despesaAtualizada,
    });
  } catch (error) {
    console.error("Erro ao atualizar status da despesa:", error);
    return res.status(500).json({
      error: "Erro ao atualizar status da despesa",
    });
  }
};

// Deletar despesa (admin)
const deletarDespesaController = async (req, res) => {
  try {
    const { despesaId } = req.params;

    const excluido = await excluirDespesa(despesaId);

    if (!excluido) {
      return res.status(404).json({ mensagem: "Despesa não encontrada" });
    }

    return res.status(200).json({ mensagem: "Despesa excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir despesa:", error);
    return res.status(500).json({ mensagem: "Erro ao excluir despesa" });
  }
};

export {
  despesasPagasController,
  despesasPendentesController,
  criarDespesaController,
  pagarDespesaController,
  // novo
  deletarDespesaController,
  listarDespesasController,
};
