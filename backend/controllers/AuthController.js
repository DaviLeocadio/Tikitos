import jwt from "jsonwebtoken";
import { read, compare } from "../config/database.js";
import { JWT_SECRET } from "../config/jwt.js";
import { encontrarUsuario } from "../models/AuthModel.js";
import {sendMail} from "../utils/mailer.js";
import { generateHashedPassword } from "../hashPassword.js";


import fs from "fs";

let codes = {};


if (fs.existsSync("../codes.json")) {
  codes = JSON.parse(fs.readFileSync("../codes.json", 'utf8'))
}

// checar se email existe

const checkEmailController = async (req, res) => {
  const email = req.body.email;
  try {
    const user = await encontrarUsuario(email);
    console.log(user)

    if (!user) return res.status(404).json({ mensagem: 'Email não encontrado' });

    if (user.senha === 'deve_mudar') {
      //gerar token de verificação
      const code = Math.floor(100000 + Math.random() * 900000);
      codes[email] = {
        code,
        expires: Date.now() + 15 * 60 * 1000 // 15 minutos
      }
      fs.writeFileSync("../codes.json", JSON.stringify(codes, null, 2));

      await sendMail(email, `Seu código de acesso: ${code}`);
      return res.status(200).json({ step: 'definir_senha' })
    }

    return res.status(200).json({ step: 'login' })
  } catch (error) {
    console.error('Erro ao buscar email: ', error);
    res.status(500).json({ mensagem: 'Erro ao buscar email.' })
  }
}

// Confirmar código e adicionar senha

const definirSenhaController = async (req, res) => {
  const { email, code, novaSenha, confirmarSenha } = req.body;

  try {
    if (!email || !code || !novaSenha || !confirmarSenha) return res.status(400).json({ error: 'Insira todos os parâmetros obrigatórios' });

    const record = codes[email];
    if (!record || record.code !== code) return res.status(400).json({ error: 'Código inválido.' });
    if (Date.now > record.expires) return res.status(400).json({ error: 'O código expirou.' });
    if (novaSenha !== confirmarSenha) return res.status(400).json({ error: 'As senhas não coincidem' })

    const senhaCriptografada = await generateHashedPassword(novaSenha)

    await definirSenhaController(email, { senha: senhaCriptografada });
  } catch (error) {
    console.error('Erro ao definir senha: ', error);
    res.status(500).json({ mensagem: 'Erro ao definir sneha.' })
  }
}

//Login
const loginController = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await read('usuarios', `email = '${email}'`);

    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário Não Encontrado' })
    }

    const senhaCorreta = await compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'Senha Incorreta' })
    }

    const token = jwt.sign({ id: usuario.id, tipo: usuario.tipo }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ mensagem: 'Login Realizado com Sucesso', token })
  } catch (error) {
    console.error('Erro ao Fazer login: ', error);
    res.status(500).json({ mensagem: 'Erro ao fazer login.' })
  }
}




export { loginController, checkEmailController, definirSenhaController }