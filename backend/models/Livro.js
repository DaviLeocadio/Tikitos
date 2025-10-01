import { deleteRecord, read, readAll, update, create } from '../config/database.js';

const listarLivros = async () => {
  try {
    return await readAll('livros');
  } catch (err) {
    console.error('Erro ao listar livros: ', err);
    throw err;
  }
};

const obterLivroPorId = async (id) => {
  try {
    return await read('livros', `id = ${id}`);
  } catch (err) {
    console.error('Erro ao listar o livro solicitado: ', err);
    throw err;
  }
};

const criarLivro = async (livroData) => {
  try {
    return await create('livros', livroData);
  } catch (err) {
    console.error('Erro ao criar livro: ', err);
    throw err;
  }
};

const atualizarLivro = async (id,livroData)=>{
  try{
    await update('livros', livroData, `id = ${id}`)
  } catch(err){
    console.error('Erro ao atualizar livro: ', err);
    throw err;
  }
};

const excluirLivro = async (id)=>{
  try{
    await deleteRecord('livros', `id = ${id}`);
  } catch(err){
    console.error('Erro ao excluir livro', err);
    throw err;
  }
}

export { listarLivros, obterLivroPorId, criarLivro, atualizarLivro, excluirLivro };
