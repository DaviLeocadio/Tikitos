import jwt from "jsonwebtoken";
import { read, compare, create } from "../config/database.js";
import { JWT_SECRET } from "../config/jwt.js";
import { encontrarUsuario, definirSenha } from "../models/AuthModel.js";
import { sendMail } from "../utils/mailer.js";
import { generateHashedPassword } from "../utils/hashPassword.js";
import { buscarToken, editarToken, registrarToken } from "../models/Token.js";


const generateCode = async (usuarioId, email) => {

  //gerar token de verificação
  const token = Math.floor(100000 + Math.random() * 900000);
  const decriptedToken = await generateHashedPassword(String(token));

  const agora = new Date();
  const limite = 15 * 60 * 1000 // 15 minutos em ms;
  const expiraEm = new Date(agora.getTime() + limite);

  const tokenData = {
    id_usuario: usuarioId,
    codigo: decriptedToken,
    expira_em: expiraEm,
    verificado: false
  }

  // Salva token no banco
  await registrarToken(tokenData);

  // Manda email com token para o usuário
  await sendMail(
    email,
    "Código de Acesso - Tikitos",
    `Seu código de acesso é: ${token}. Use-o para definir sua senha.`
  );
}

// Checar se email existe
const checkEmailController = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ error: 'Email não informado' })
    }
    // Procura email no bd
    const usuario = await encontrarUsuario(email);
    if (!usuario) return res.status(404).json({ error: 'Email não encontrado' });

    // Se for o primeiro acesso do usuário, a senha será 'deve_mudar'.
    if (usuario.senha === 'deve_mudar') {
      await generateCode(usuario.id_usuario, email);
      return res.status(200).json({ type: 'success', step: 'verificar_token' }); // verifica token
    }

    return res.status(200).json({ type: 'success', step: 'login' }) // manda fazer login

  } catch (error) {
    console.error('Erro ao buscar email: ', error);
    res.status(500).json({ error: 'Erro ao buscar email.' })
  }
}




const verificarTokenController = async (req, res) => {

  const { email, token } = req.body;
  try {
    if (!email || !token) return res.status(400).json({ error: 'Insira todos os parâmetros obrigatórios' });

    const usuario = await encontrarUsuario(email);
    if (!usuario) return res.status(404).json({ error: 'Email não encontrado' });

    // Busca o token no banco
    const record = await buscarToken(usuario.id_usuario);

    if (!record) return res.status(404).json({ error: 'Nenhum token foi encontrado no email fornecido' });

    // Verifica se está expirado
    if (Date.now() > new Date(record.expira_em)) {
      return res.status(410).json({ error: 'O código expirou.' });
    }

    // Verifica se o código coincide
    const tokenCorreto = await compare(String(token), record.codigo);
    if (!tokenCorreto) {
      return res.status(401).json({ error: 'Código inválido' })
    }

    const tokenAtualizado = await editarToken( record.id_token,{ verificado: true });

    return res.status(200).json(
      {
        type: 'success',
        step: 'definir_senha',
        mensagem: 'Token verificado com sucesso',
        tokenAtualizado
      }
    )


  } catch (error) {
    console.error('Erro ao verificar token: ', error);
    res.status(500).json({ error: 'Erro ao verificar token.' })
  }
}


// Confirmar código e adicionar senha
const definirSenhaController = async (req, res) => {
  const { email, novaSenha, confirmarSenha } = req.body;

  try {
    if (!email || !novaSenha || !confirmarSenha) return res.status(400).json({ error: 'Insira todos os parâmetros obrigatórios' });

    // Verifica se email existe no bd
    const usuario = await encontrarUsuario(email);
    if (!usuario) return res.status(404).json({ error: 'Email não encontrado' });

    // Busca o token no banco
    const record = await buscarToken(usuario.id_usuario);

    if (!record) return res.status(404).json({ error: 'Nenhum token foi encontrado no email fornecido' });

    if(token.verificado !== true) return res.status(403).json({error: 'O token não foi verificado'});


    // Verifica se as duas senhas coincidem
    if (novaSenha !== confirmarSenha) {
      return res.status(401).json({ error: 'As senhas não coincidem' })
    }

    // Gera hash da senha
    const senhaCriptografada = await generateHashedPassword(novaSenha)

    // Seta nova senha e manda fazer login
    await definirSenha(email, { senha: senhaCriptografada });
    res.status(200).json({ mensagem: "Senha definida com sucesso", step: 'login' });

  } catch (error) {
    console.error('Erro ao definir senha: ', error);
    res.status(500).json({ error: 'Erro ao definir senha.' })
  }
}

//Login
const loginController = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await read('usuarios', `email = '${email}'`);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    const senhaCorreta = await compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ error: 'Senha incorreta' })
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        perfil: usuario.perfil,
        id_empresa: usuario.id_empresa
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ mensagem: 'Login Realizado com Sucesso', token });


  } catch (error) {
    console.error('Erro ao Fazer login: ', error);
    res.status(500).json({ error: 'Erro ao fazer login.' })
  }
}




export {
  loginController,
  checkEmailController,
  definirSenhaController,
  verificarTokenController
}