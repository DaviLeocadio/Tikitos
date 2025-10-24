import {
  deleteRecord,
  read,
  readAll,
  update,
  create,
} from "../config/database.js";

const listarVendas = async () => {
  try {
    return await readAll("vendas");
  } catch (err) {
    console.error("Erro ao listar vendas: ", err);
    throw err;
  }
};

const listarVendasPorCaixa = async (caixaId) => {
  try {
    return await readAll("vendas", `id_caixa = ${caixaId}`);
  } catch (error) {
    console.error("Erro ao listar vendas por caixa: ", err);
    throw err;
  }
};

const obterVendaPorId = async (vendaId) => {
  try {
    return await read("vendas", `id_venda = ${vendaId}`);
  } catch (err) {
    console.error("Erro ao obter detalhes da venda: ", err);
    throw err;
  }
};

const obterVendaPorData = async (dataCaixa, idCaixa, idEmpresa) => {
  try {
    return await readAll(
      "vendas",
      `DATE(data_venda) = '${dataCaixa}' AND id_caixa = ${idCaixa} AND id_empresa = ${idEmpresa}`
    );
  } catch (err) {
    console.error("Erro ao obter detalhes da venda: ", err);
    throw err;
  }
};

const criarVenda = async (vendaData) => {
  try {
    return await create("vendas", vendaData);
  } catch (err) {
    console.error("Erro ao registrar venda: ", err);
    throw err;
  }
};

const atualizarVenda = async (vendaId, vendaData) => {
  try {
    await update("vendas", vendaData, `id_venda = ${vendaId}`);
  } catch (err) {
    console.error("Erro ao atualizar venda: ", err);
    throw err;
  }
};

const excluirVenda = async (vendaId) => {
  try {
    await deleteRecord("vendas", `id_venda = ${vendaId}`);
  } catch (err) {
    console.error("Erro ao excluir venda", err);
    throw err;
  }
};

export {
  listarVendas,
  listarVendasPorCaixa,
  obterVendaPorId,
  obterVendaPorData,
  criarVenda,
  atualizarVenda,
  excluirVenda,
};
