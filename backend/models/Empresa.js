import {
  deleteRecord,
  read,
  readAll,
  update,
  create,
} from "../config/database.js";

const listarEmpresas = async (whereClause = null) => {
  try {
    return await readAll("empresas", whereClause);
  } catch (err) {
    console.error("Erro ao listar empresas: ", err);
    throw err;
  }
};

const obterEmpresaPorId = async (empresaId) => {
  try {
    return await read("empresas", `id_empresa = ${empresaId}`);
  } catch (err) {
    console.error("Erro ao obter empresa por ID: ", err);
    throw err;
  }
};

const criarEmpresa = async (empresaData) => {
  try {
    return await create("empresas", empresaData);
  } catch (err) {
    console.error("Erro ao criar empresa: ", err);
    throw err;
  }
};

const atualizarEmpresa = async (empresaId, empresaData) => {
  try {
    await update("empresas", empresaData, `id_empresa = ${empresaId}`);
  } catch (err) {
    console.error("Erro ao atualizar empresa: ", err);
    throw err;
  }
};

export { 
    listarEmpresas,
    obterEmpresaPorId,
    criarEmpresa, 
    atualizarEmpresa
};
