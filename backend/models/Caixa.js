import { readAll, read, create, update } from "../config/database.js";

const AbrirCaixa = async (caixaData) => {
  try {
    return await create("caixa", caixaData);
  } catch (err) {
    console.error("Erro ao abrir caixa: ", err);
    throw err;
  }
};

const LerCaixaPorVendedor = async (idVendedor) => {
  try {
    return await read(
      "caixa",
      `id_usuario = ${idVendedor} ORDER BY abertura ASC`
    );
  } catch (err) {
    console.error("Erro ao ler caixa por vendedor: ", err);
    throw err;
  }
};

const AtualizarCaixa = async (idCaixa, caixaData) => {
  try {
    return await update("caixa", caixaData, `id_caixa = ${idCaixa}`);
  } catch (err) {
    console.error("Erro ao atualizar caixa: ", err);
    throw err;
  }
};

const FecharCaixa = async (caixaData, idCaixa) => {
  try {
    return await update("caixa", caixaData, `id_usuario = ${idCaixa}`);
  } catch (err) {
    console.error("Erro ao fechar caixa: ", err);
    throw err;
  }
};

export { AbrirCaixa, LerCaixaPorVendedor, FecharCaixa, AtualizarCaixa };
