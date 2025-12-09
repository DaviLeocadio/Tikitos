import jwt from "jsonwebtoken";
import { read, compare, create, update } from "../config/database.js";
import { JWT_SECRET } from "../config/jwt.js";
import {
  encontrarUsuario,
  definirSenha,
  ObterUsuarioMiddlewareModel,
} from "../models/AuthModel.js";
import { sendMail } from "../utils/mailer.js";
import { generateHashedPassword } from "../utils/hashPassword.js";
import { buscarToken, editarToken, registrarToken } from "../models/Token.js";

const generateCode = async (usuarioId, email) => {
  //gerar token de verificação
  const token = Math.floor(100000 + Math.random() * 900000);
  const decriptedToken = await generateHashedPassword(String(token));

  const agora = new Date();
  const limite = 15 * 60 * 1000; // 15 minutos em ms;
  const expiraEm = new Date(agora.getTime() + limite);

  const tokenData = {
    id_usuario: usuarioId,
    codigo: decriptedToken,
    expira_em: expiraEm,
    verificado: false,
  };

  // Salva token no banco
  await registrarToken(tokenData);

  // Manda email com token para o usuário
  await sendMail(
    email,
    "Código de Acesso - Tikitos",
    `Seu código de acesso é: ${token}. Use-o para definir sua senha.`
  );
};

// Checar se email existe
const checkEmailController = async (req, res) => {
  const { email } = req.body;

  // Verifica de há excesso de caracteres para proteção contra ataques
  if (email.length > 100) {
    return res.status(400).json({ mensagem: "Máximo de caracteres excedido" });
  }
  try {
    if (!email) {
      return res.status(401).json({ error: "Email não informado" });
    }
    console.log(email);
    // Procura email no bd
    const usuario = await encontrarUsuario(email);
    if (!usuario)
      return res.status(404).json({ error: "Email não encontrado" });

    // Se for o primeiro acesso do usuário, a senha será 'deve_mudar'.
    if (usuario.senha === "deve_mudar") {
      await generateCode(usuario.id_usuario, email);
      return res.status(200).json({ type: "success", step: "verificar_token" }); // verifica token
    }

    return res.status(200).json({ type: "success", step: "login" }); // manda fazer login
  } catch (error) {
    console.error("Erro ao buscar email: ", error);
    res.status(500).json({ error: "Erro ao buscar email." });
  }
};

const verificarTokenController = async (req, res) => {
  const { email, token } = req.body;

  // Verifica de há excesso de caracteres para proteção contra ataques
  if (email.length > 100) {
    return res.status(400).json({
      mensagem: "Máximo de caracteres excedido",
      code: "CARACTER_EXCEDIDO",
    });
  }

  try {
    if (!email || !token)
      return res.status(400).json({
        error: "Insira todos os parâmetros obrigatórios",
        code: "FALTA_DADOS",
      });

    if (token.length != 6) {
      return res
        .status(400)
        .json({ error: "Token incorreto", code: "TOKEN_INCORRETO" });
    }
    const usuario = await encontrarUsuario(email);
    if (!usuario)
      return res.status(404).json({ error: "Email não encontrado" });

    // Busca o token no banco
    const record = await buscarToken(usuario.id_usuario);

    if (!record)
      return res
        .status(404)
        .json({ error: "Nenhum token foi encontrado no email fornecido" });

    // Verifica se está expirado
    if (Date.now() > new Date(record.expira_em)) {
      return res
        .status(401)
        .json({ error: "O código expirou.", code: "CODIGO_EXPIROU" });
    }

    // Verifica se o código coincide
    const tokenCorreto = await compare(String(token), record.codigo);
    if (!tokenCorreto) {
      return res
        .status(401)
        .json({ error: "Código inválido", code: "CODIGO_INVALIDO" });
    }

    const tokenAtualizado = await editarToken(record.id_token, {
      verificado: true,
    });

    return res.status(200).json({
      type: "success",
      step: "definir_senha",
      mensagem: "Token verificado com sucesso",
      tokenAtualizado,
    });
  } catch (error) {
    console.error("Erro ao verificar token: ", error);
    res.status(500).json({ error: "Erro ao verificar token." });
  }
};

// Confirmar código e adicionar senha
const definirSenhaController = async (req, res) => {
  const { email, novaSenha, confirmarSenha } = req.body;
  try {
    if (!email || !novaSenha || !confirmarSenha)
      return res.status(400).json({
        error: "Insira todos os parâmetros obrigatórios",
        code: "FALTA_DADOS",
      });

    // Verifica se email existe no bd
    const usuario = await encontrarUsuario(email);
    if (!usuario)
      return res.status(404).json({ error: "Email não encontrado" });

    // Verifica de há excesso de caracteres para proteção contra ataques
    if (novaSenha.length > 25 || confirmarSenha.length > 25) {
      return res.status(400).json({
        mensagem: "Máximo de caracteres excedido",
        code: "CARACTER_EXCEDIDO",
      });
    }

    if (novaSenha < 6) {
      return res.status(400).json({
        mensagem: "Mínimo de caracteres é de 6",
        code: "CARACTER_MINIMO",
      });
    }

    // Busca o token no banco
    const record = await buscarToken(usuario.id_usuario);

    if (!record)
      return res
        .status(404)
        .json({ error: "Nenhum token foi encontrado no email fornecido" });

    if (!record.verificado)
      return res.status(403).json({ error: "O token não foi verificado" });

    // Verifica se as duas senhas coincidem
    if (novaSenha !== confirmarSenha) {
      return res
        .status(400)
        .json({ error: "As senhas não coincidem", code: "SENHA_DIFERENTE" });
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
    res.status(500).json({ error: "Erro ao definir senha." });
  }
};

//Login
const loginController = async (req, res) => {
  const { email, senha } = req.body;

  // Verifica de há excesso de caracteres para proteção contra ataques
  if (email.length > 100 || senha.length > 25) {
    return res.status(400).json({ mensagem: "Máximo de caracteres excedido" });
  }
  try {
    const usuario = await read("usuarios", `email = '${email}'`);

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (usuario.senha === "deve_mudar") {
      return res
        .status(403)
        .json({
          error: "Usuário deve definir uma nova senha",
          code: "DEVE_MUDAR_SENHA",
        });
    }

    const senhaCorreta = await compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    const usuarioData = await ObterUsuarioMiddlewareModel(usuario.id_usuario);

    const expiresIn =
      usuario.perfil === "vendedor"
        ? 12 * 60 * 60 // 12h em segundos
        : 1 * 60 * 60; // 1h em segundos

    const token = jwt.sign(
      {
        id_usuario: usuarioData.id_usuario,
        nome: usuarioData.nome,
        email: usuarioData.email,
        perfil: usuarioData.perfil,
        id_empresa: usuarioData.id_empresa,
        empresa_nome: usuarioData.empresa_nome,
      },
      JWT_SECRET,
      { expiresIn }
    );

    const baseCookieOptions = {
      secure: false, // true em produção HTTPS
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn * 1000, // ms
    };

    res.cookie("token", token, {
      ...baseCookieOptions,
      httpOnly: true,
    });

    res.cookie("expiresAt", Date.now() + expiresIn * 1000, {
      ...baseCookieOptions,
      httpOnly: false,
    });

    return res.status(200).json({
      mensagem: "Login Realizado com Sucesso",
      usuario: {
        id_usuario: usuarioData.id_usuario,
        nome: usuarioData.nome,
        email: usuarioData.email,
        perfil: usuarioData.perfil,
        id_empresa: usuarioData.id_empresa,
        empresa_nome: usuarioData.empresa_nome,
      },
      expiresAt: Date.now() + expiresIn * 1000,
    });
  } catch (error) {
    console.error("Erro ao Fazer login: ", error);
    res.status(500).json({ error: "Erro ao fazer login." });
  }
};

const logoutController = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: false, // true em produção
      sameSite: "lax",
      maxAge: 0,
    });

    res.status(200).json({ mensagem: "Logout realizado com sucesso" });
  } catch (error) {
    console.error("Erro ao realizar logout: ", error);
    res.status(500).json({ error: "Erro ao fazer logout." });
  }
};

const resetarSenhaController = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const usuarioExistente = await read("usuarios", `id_usuario = ${usuarioId}`);
    if (!usuarioExistente) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const usuarioAtualizado = await update("usuarios", { senha: "deve_mudar" }, `id_usuario = ${usuarioId}`); 

    return res.status(200).json({ mensagem: "Senha resetada com sucesso", usuarioAtualizado });
    
  } catch (error) {
    console.error("Erro ao resetar senha: ", error);
    res.status(500).json({ error: "Erro ao resetar senha." });
  }
};

export {
  loginController,
  logoutController,
  checkEmailController,
  definirSenhaController,
  verificarTokenController,
  resetarSenhaController
};
