import { despesasPagas, despesasPendentes } from "../models/Despesas.js";

const despesasPagasController = async (req, res) => {
  try {
    const despesas = await despesasPagas();
    res
      .status(200)
      .json({ mensagem: "Depesas pagas conquistadas", despesas });
  } catch (err) {
    res.status(500).json({ err: "Erro ao buscar despesas pagas" });
  }
};

const despesasPendentesController = async (req, res) => {
  try {
    const despesas = await despesasPendentes();
    res
      .status(200)
      .json({ mensagem: "Depesas pendentes conquistadas", despesas });
  } catch (err) {
    res.status(500).json({ err: "Erro ao buscar despesas pagas" });
  }
};

export { despesasPagasController, despesasPendentesController };
