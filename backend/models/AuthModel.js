import { read, update } from "../config/database.js";
 
const encontrarUsuario = async (email) => {
    try {
      return  await read('usuarios', `email = '${email}'`);
    } catch (error) {
        console.error('Erro ao procurar usuario: ', error)
    }
}
 
const definirSenha = async (email, senha) => {
    try {
        return await update('usuarios', senha `email = ${email}`)
    } catch (error) {
        console.error('Erro ao definir senha do usuario: ', error)
    }
}

export {encontrarUsuario, definirSenha}