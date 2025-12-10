import {
  deleteRecord,
  read,
  readAll,
  update,
  create,
  readRaw,
} from "../config/database.js";
import { mascaraCpf, mascaraTelefone } from "../utils/formatadorNumero.js";

const listarUsuarios = async (whereClause = null) => {
  try {
    const usuarios = await readRaw(`
  SELECT 
    u.*, 
    e.nome AS nome_empresa
  FROM usuarios u
  LEFT JOIN empresas e 
    ON e.id_empresa = u.id_empresa
  WHERE ${whereClause}
`);

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

const obterUsuarioPorId = async (whereClause) => {
  try {
    const usuario = await read("usuarios", whereClause);
    if (!usuario) return usuario;
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
    return await update("usuarios", usuarioData, `id_usuario = ${id}`);
  } catch (err) {
    console.error("Erro ao atualizar usuario: ", err);
    throw err;
  }
};

const obterGerentePorEmpresa = async (empresaId) => {
  try {
    const gerente = await read(
      "usuarios",
      `id_empresa = ${empresaId} AND perfil = 'gerente'`
    );
    return gerente ? true : false;
  } catch (error) {
    console.error("Erro ao obter gerente por empresa: ", err);
    throw err;
  }
};

export {
  listarUsuarios,
  obterUsuarioPorId,
  criarUsuario,
  atualizarUsuario,
  obterGerentePorEmpresa,
};
