import express from 'express';
import {
  listarLivrosController,
  obterLivroPorIdController,
  criarLivroController,
  atualizarLivroController,
  excluirLivroController,
} from '../controllers/LivroController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', listarLivrosController);
router.get('/:id', obterLivroPorIdController);

router.delete('/:id', authMiddleware, excluirLivroController);

router.options('/', (req, res) => {
  res.setHeader('Allow', 'GET, OPTIONS');
  res.status(204).send();
});

router.options('/:id', (req, res) => {
  res.setHeader('Allow', 'GET, OPTIONS');
  res.status(204).send();
});

export default router;