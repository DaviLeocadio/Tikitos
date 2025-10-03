import jwt from "jsonwebtoken";
import { read, compare } from "../config/database.js";
import { JWT_SECRET } from "../config/jwt.js";

const loginController = async (req, res) => {
  const { login, senha } = req.body;
  
  try { 
    const usuario = await read(
      "usuarios",
      `email = '${login}'`
    );

    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    const senhaCorreta = await compare(senha, usuario.senha);
    console.log(senhaCorreta)

    if (!senhaCorreta) {
      return res.status(404).json({ mensagem: "Senha incorreta" });
    }

    const token = jwt.sign({ id: usuario.id, tipo: usuario.tipo }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ mensagem: "Login realizado com sucesso", token });
  } catch (err) {
    console.error("Erro ao fazer login", err);
    res.status(500).json({ mensagem: "Erro ao fazer login" });
  }
};

export { loginController };
