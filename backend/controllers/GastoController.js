import {
  listarDespesas,
  obterDespesaPorId,
  criarDespesa,
  atualizarDespesa,
  excluirDespesa,
} from "../models/Despesas.js";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(customParseFormat);


// Listar todos os gastos
const listarGastosController = async (req, res) => {
  try {
    const { dataInicio, dataFim, status } = req.query;
    const idEmpresa = req.usuarioEmpresa;
    
    console.log("📅 Parâmetros recebidos:", { dataInicio, dataFim, status, idEmpresa });
    
    let where = `id_empresa = ${idEmpresa}`;
    
    if (dataInicio && dataFim) {
      // ✅ CORREÇÃO: Usar >= e < ao invés de BETWEEN
      // Isso garante que pegue todo o intervalo corretamente
      where += ` AND DATE(data_adicionado) >= '${dataInicio}' AND DATE(data_adicionado) < '${dataFim}'`;
    }
    
    // ✅ NOVO: Suporte a filtro de status
    if (status && status !== "todos") {
      where += ` AND status = '${status}'`;
    }
    
    console.log("🔎 Query WHERE:", where);
    
    where += ` ORDER BY 
      CASE 
        WHEN d.status = 'pendente' THEN 0
        WHEN d.status = 'pago' THEN 1
        ELSE 2
      END,
      DATE(d.data_adicionado) DESC`;

    const gastos = await listarDespesas(where);
    
    console.log("💰 Gastos encontrados:", gastos.length);
    
    res.status(200).json({ mensagem: "Gastos listados com sucesso", gastos });
  } catch (error) {
    console.error("❌ Erro ao listar gastos:", error);
    res.status(500).json({ message: "Erro ao listar gastos", error: error.message });
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

    const dataPag = dayjs(data_pag, "DD/MM/YYYY");

    const dataPagSQL = dataPag.format("YYYY-MM-DD");

    const gastoData = {
      id_empresa,
      data_pag: dataPagSQL,
      descricao,
      preco,
    };
    const gastoCriado = await criarDespesa(gastoData);
    return res
      .status(200)
      .json({ mensagem: "Gasto registrado com sucesso", gastoCriado });
  } catch (error) {
    console.error("Erro ao registrar gasto: ", error);
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
