import express from 'express';
import { checkEmailController, definirSenhaController, loginController } from '../controllers/AuthController.js';

const router = express.Router();

//Verifica se o email existe no bd
router.post('/checar_email', checkEmailController);

// //Verifica token criado para definição de senha
// router.post('/verificar_token', verificarTokenController)

// Define a senha de uma conta que tem senha indefinida
router.post('/definir_senha', definirSenhaController)

// Login
router.post('/login', loginController);



router.options('/', (req, res) => {
  res.setHeader('Allow', 'POST, OPTIONS');
  res.status(204).send();
});

export default router;