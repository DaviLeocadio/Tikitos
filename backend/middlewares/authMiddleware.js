import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt.js"; // Importar a chave secreta

// Middleware genérico que recebe funções permitidas como parâmetro
const authMiddleware = (funcoesPermitidas = []) => {
  return (req, res, next) => {
    // Cookies that have been signed
    const authHeader = req.cookies.token;

    if (!authHeader) {
      return res
        .status(401)
        .json({ mensagem: "Não autorizado: Token não fornecido" });
    }

    try {
      const decoded = jwt.verify(authHeader, JWT_SECRET);

      req.usuarioId = decoded.id_usuario;
      req.usuarioNome = decoded.nome;
      req.usuarioPerfil = decoded.perfil;
      req.usuarioEmail = decoded.email;
      req.usuarioEmpresa = decoded.id_empresa;

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
