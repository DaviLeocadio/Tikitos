import { deleteRecord, read, readAll, update, create } from "../config/database.js";

const listarItensVenda = async (vendaId) => {
  try {
    return await readAll("venda_itens", `id_venda = ${vendaId}`);
  } catch (err) {
    console.error("Erro ao listar itens da venda: ", err);
    throw err;
  }
};


const criarItensVenda = async (itensVendaData) => {
  try {
    return await create("venda_itens", itensVendaData);
  } catch (err) {
    console.error("Erro ao registrar itens da venda: ", err);
    throw err;
  }
};


const excluirItensVenda = async (vendaId) => {
  try {
    await deleteRecord("venda_itens", `id_venda = ${vendaId}`);
  } catch (err) {
    console.error("Erro ao excluir itens da venda", err);
    throw err;
  }
};


export {
 listarItensVenda,
 criarItensVenda,
 excluirItensVenda
};
