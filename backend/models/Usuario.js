import {
  deleteRecord,
  read,
  readAll,
  update,
  create,
} from "../config/database.js";

const listarUsuarios = async (whereClause = null) => {
  try {
    return await readAll("usuarios", whereClause);
  } catch (err) {
    console.error("Erro ao listar usuários: ", err);
    throw err;
  }
};

const obterUsuarioPorId = async (id) => {
  try {
    return await read("usuarios", `id_usuario = ${id}`);
  } catch (err) {
    console.error("Erro ao obter usuario por ID: ", err);
    throw err;
  }
};

const criarUsuario = async (usuarioData) => {
  try {
    return await create("usuarios", usuarioData);
  } catch (err) {
    console.error("Erro ao criar usuario: ", err);
    throw err;
  }
};

const atualizarUsuario = async (id, usuarioData) => {
  try {
    await update("usuarios", usuarioData, `id_usuario = ${id}`);
  } catch (err) {
    console.error("Erro ao atualizar usuario: ", err);
    throw err;
  }
};

export {
  listarUsuarios,
  obterUsuarioPorId,
  criarUsuario,
  atualizarUsuario
};
