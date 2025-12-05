import jwt, { decode } from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt.js"; // Importar a chave secreta
import { readRaw } from "../config/database.js";
import { ObterUsuarioMiddlewareModel } from "../models/AuthModel.js";

// Middleware genérico que recebe funções permitidas como parâmetro
const authMiddleware = (funcoesPermitidas = []) => {
  return async (req, res, next) => {
    // Cookies that have been signed
    const authHeader = req.cookies.token;

    if (!authHeader) {
      return res
        .status(403)
        .json({ mensagem: "Não autorizado: Token não fornecido" });
    }

    try {
      const decoded = jwt.verify(authHeader, JWT_SECRET);

      const usuario = await ObterUsuarioMiddlewareModel(decoded.id_usuario);
      

      req.usuarioId = usuario.id_usuario;
      req.usuarioNome = usuario.nome;
      req.usuarioPerfil = usuario.perfil;
      req.usuarioEmail = usuario.email;
      req.usuarioEmpresa = usuario.id_empresa;
      req.usuarioEmpresaNome = usuario.empresa_nome;

      // Se funções foram passadas, valida
      if (
        funcoesPermitidas.length > 0 &&
        !funcoesPermitidas.includes(decoded.perfil)
      ) {
        return res.status(403).json({
          mensagem:
            "Não autorizado: Sua permissão não concede acesso à essa rota",
        });
      }

      next();
    } catch (error) {
      return res
        .status(403)
        .json({ mensagem: "Não autorizado: Token inválido" });
    }
  };
};

export default authMiddleware;
