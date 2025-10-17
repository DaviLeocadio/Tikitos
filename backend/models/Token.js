import { deleteRecord, read, update, create } from '../config/database.js';

const buscarToken = async (usuarioId) => {
    try {
        return await read('tokens', `id_usuario = ${usuarioId} ORDER BY expira_em DESC`)
    } catch (err) {
        console.error('Erro ao buscar token: ', err);
        throw err;
    }
}


const registrarToken = async (tokenData) => {
    try {
        return await create('tokens', tokenData);
    } catch (err) {
        console.error('Erro ao registrar token: ', err);
        throw err;
    }
};

const editarToken = async (idToken, tokenData) => {
    try {
        return await update('tokens', tokenData, `token = ${idToken}`)
    } catch (err) {
        console.error('Erro ao editar token: ', err);
        throw err;
    }
}

const deletarToken = async (usuarioId) => {
    try {
        return await deleteRecord('tokens', `id_usuario = ${usuarioId}`)
    } catch (error) {
        console.error('Erro ao deletar token: ', err);
        throw err;
    }
}


export {
    buscarToken, 
    registrarToken,
    editarToken,
    deletarToken
}