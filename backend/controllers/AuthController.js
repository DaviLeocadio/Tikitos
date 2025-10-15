import jwt from "jsonwebtoken";
import { read, compare } from "../config/database.js";
import { JWT_SECRET } from "../config/jwt.js";
import { encontrarUsuario, definirSenha } from "../models/AuthModel.js";
import { sendMail } from "../utils/mailer.js";
import { generateHashedPassword } from "../utils/hashPassword.js";
import { AbrirCaixaController } from "./CaixaController.js";

import fs from "fs";

let codes = {};

// Leitura sincronizada com arquivo que contém os códigos
try {
  if (fs.existsSync("./codes.json")) {
    const data = fs.readFileSync("./codes.json", "utf8");
    codes = JSON.parse(data || "{}");
  }
} catch (err) {
  console.error("Erro ao ler codes.json:", err);
  codes = {};
}

// Checar se email existe
const checkEmailController = async (req, res) => {
  const { email } = req.body;

  try {
    // Procura email no bd
    const usuario = await encontrarUsuario(email);
    if (!usuario)
      return res.status(404).json({ mensagem: "Email não encontrado" });

    // Se for o primeiro acesso do usuário, a senha será 'deve_mudar'.
    if (usuario.senha === "deve_mudar") {
      //gerar token de verificação
      const code = Math.floor(100000 + Math.random() * 900000);
      codes[email] = {
        code,
        expires: Date.now() + 15 * 60 * 1000, // 15 minutos
      };
      // Salva token no arquivo de codigos
      fs.writeFileSync("./codes.json", JSON.stringify(codes, null, 2));

      // Manda email com token para o usuário
      await sendMail(
        email,
        "Código de Acesso - Tikitos",
        `Seu código de acesso é: ${code}. Use-o para entrar no sistema da Tikitos.`
      );

      return res.status(200).json({ step: "definir_senha" }); // manda definir senha
    }

    return res.status(200).json({ step: "login" }); // manda fazer login
  } catch (error) {
    console.error("Erro ao buscar email: ", error);
    res.status(500).json({ mensagem: "Erro ao buscar email." });
  }
};

// Confirmar código e adicionar senha
const definirSenhaController = async (req, res) => {
  const { email, code, novaSenha, confirmarSenha } = req.body;

  try {
    if (!email || !code || !novaSenha || !confirmarSenha)
      return res
        .status(400)
        .json({ error: "Insira todos os parâmetros obrigatórios" });

    // Verifica se email existe no bd
    const usuario = await encontrarUsuario(email);
    if (!usuario)
      return res.status(404).json({ mensagem: "Email não encontrado" });

    const record = codes[email]; // Pega código atrelado ao email

    // Verifica se está expirado
    if (Date.now() > record.expires) {
      return res.status(410).json({ error: "O código expirou." });
    }

    // Verifica se o código coincide
    if (!record || parseInt(record.code) !== parseInt(code)) {
      return res.status(400).json({ error: "Código inválido." });
    }

    // Verifica se as duas senhas coincidem
    if (novaSenha !== confirmarSenha) {
      return res.status(401).json({ error: "As senhas não coincidem" });
    }

    // Gera hash da senha
    const senhaCriptografada = await generateHashedPassword(novaSenha);

    // Seta nova senha e manda fazer login
    await definirSenha(email, { senha: senhaCriptografada });
    res
      .status(200)
      .json({ mensagem: "Senha definida com sucesso", step: "login" });
  } catch (error) {
    console.error("Erro ao definir senha: ", error);
    res.status(500).json({ mensagem: "Erro ao definir senha." });
  }
};

//Login
const loginController = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await read("usuarios", `email = '${email}'`);

    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    const senhaCorreta = await compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: "Senha incorreta" });
    }

    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        email: usuario.email,
        perfil: usuario.perfil,
        id_empresa: usuario.id_empresa,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ mensagem: "Login realizado com sucesso", token });
  } catch (error) {
    console.error("Erro ao fazer login: ", error);
    res.status(500).json({ mensagem: "Erro ao fazer login." });
  }
};

export { loginController, checkEmailController, definirSenhaController };
