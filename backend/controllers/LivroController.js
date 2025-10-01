import {
  listarLivros,
  obterLivroPorId,
  criarLivro,
  atualizarLivro,
  excluirLivro,
} from '../models/Livro.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const listarLivrosController = async (req, res) => {
  try {
    const livros = await listarLivros();
    res.status(200).json(livros);
  } catch (err) {
    console.error('Erro ao listar livros: ', err);
    res.status(500).json({ mensagem: 'Erro ao listar livros' });
  }
};

const obterLivroPorIdController = async (req, res) => {
  try {
    const livro = await obterLivroPorId(req.params.id);
    if (livro) {
      res.json(livro);
    } else {
      res.status(404).json({ mensagem: 'Livro não encontrado' });
    }
  } catch (err) {
    console.error('Erro ao obter livro por ID: ', err);
    res.status(500).json({ mensagem: 'Erro ao obter livro por ID' });
  }
};

const criarLivroController = async (req, res) => {
  try {
    const { titulo, descricao, isbn } = req.body;
    let capaPath = null;
    if (req.file) {
      capaPath = req.file.path.replace(
        __dirname.replace('\\controllers', ''),
        ''
      );
    }
    const livroData = {
      titulo: titulo,
      descricao: descricao,
      isbn: isbn,
      capa: capaPath,
    };
    const livroId = await criarLivro(livroData);
    res.status(201).json({ mensagem: 'Livro criado com sucesso', livroId });
  } catch (error) {
    console.error('Erro ao criar livro:', error);
    res.status(500).json({ mensagem: 'Erro ao criar livro' });
  }
};

const atualizarLivroController = async (req, res) => {
  try {
    const livroId = req.params.id;
    const { titulo, descricao, isbn } = req.body;
    let capaPath = null;
    if (req.file) {
      capaPath = req.file.path.replace(
        __dirname.replace('\\controllers', ''),
        ''
      );
    }
    const livroData = {
      titulo: titulo,
      descricao: descricao,
      isbn: isbn,
      capa: capaPath,
    };
    await atualizarLivro(livroId, livroData);
    res.status(200).json({ mensagem: 'Livro atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    res.status(500).json({ mensagem: 'Erro ao atualizar livro' });
  }
};

const excluirLivroController = async (req, res) => {
  try {
    const livroId = req.params.id;
    await excluirLivro(livroId);
    res.status(200).json({ mensagem: 'Livro excluído com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir livro:', err);
    res.status(500).json({ mensagem: 'Livro excluído com sucesso' });
  }
};

export {
  obterLivroPorIdController,
  listarLivrosController,
  excluirLivroController,
  atualizarLivroController,
  criarLivroController,
};
