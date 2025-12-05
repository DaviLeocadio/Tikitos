import { read, update, readRaw } from "../config/database.js";

const encontrarUsuario = async (email) => {
  try {
    return await read("usuarios", `email = '${email}'`);
  } catch (error) {
    console.error("Erro ao procurar usuario: ", error);
  }
};

const definirSenha = async (email, senha) => {
  try {
    return await update("usuarios", senha, `email = '${email}'`);
  } catch (error) {
    console.error("Erro ao definir senha do usuario: ", error);
  }
};

const ObterUsuarioMiddlewareModel = async (idUsuario) => {
  try {
    let sql = `
      SELECT 
        U.id_usuario,
        U.nome,
        U.perfil,
        U.email,
        U.id_empresa,
        E.nome AS empresa_nome
      FROM 
        usuarios U
      INNER JOIN
        empresas E
      ON U.id_empresa = E.id_empresa
      WHERE U.id_usuario = ?
      `;

    const usuarios = await readRaw(sql, [idUsuario]);
    return usuarios[0];
  } catch (error) {
     console.error("Erro ao obter dados do usuario: ", error);
  }
};

export { encontrarUsuario, definirSenha, ObterUsuarioMiddlewareModel };
