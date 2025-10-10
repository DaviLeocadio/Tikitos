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

const obterEmpresaPorId = async (id) => {
  try {
    return await read("empresas", `id = ${id}`);
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

const atual = async (id, usuarioData) => {
  try {
    await update("usuarios", usuarioData, `id = ${id}`);
  } catch (err) {
    console.error("Erro ao atualizar usuario: ", err);
    throw err;
  }
};

export { listarUsuarios, obterUsuarioPorId, criarUsuario, atualizarUsuario };
