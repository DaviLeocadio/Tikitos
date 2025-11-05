import {
  deleteRecord,
  read,
  readAll,
  update,
  create,
} from "../config/database.js";
import { mascaraCpf, mascaraTelefone } from "../utils/formatadorNumero.js";

const listarUsuarios = async (whereClause = null) => {
  try {
    const usuarios = await readAll("usuarios", whereClause);
    const usuariosFormatados = usuarios.map((usuario) => {
      return {
        ...usuario,
        cpf: mascaraCpf(usuario.cpf),
        telefone: mascaraTelefone(usuario.telefone),
      };
    });

    usuariosFormatados.forEach((usuario) => {
      delete usuario.senha;
    });

    return usuariosFormatados;
  } catch (err) {
    console.error("Erro ao listar usuários: ", err);
    throw err;
  }
};

const obterUsuarioPorId = async (id) => {
  try {
    const usuario = await read("usuarios", `id_usuario = ${id}`);
    delete usuario.senha;

    return {
      ...usuario,
      cpf: mascaraCpf(usuario.cpf),
      telefone: mascaraTelefone(usuario.telefone),
    };
    
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


export { listarUsuarios, obterUsuarioPorId, criarUsuario, atualizarUsuario };
