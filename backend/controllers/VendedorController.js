// import {
//   listarVendendores,
//   obterVendendorPorId,
//   criarVendendor,
//   atualizarVendendor,
//   excluirVendendor,
// } from "../models/Vendendor.js";

// import { formatarNome } from "../utils/formatadorNome.js";

// const listarVendedoresController = async (req, res) => {
//   try {
//     const vendendores = await listarVendendores();
//     res.status(200).json(vendendores);
//   } catch (err) {
//     console.error("Erro ao listar vendendores:", err);
//     res.status(500).json({ mensagem: "Erro ao listar vendendores" });
//   }
// };

// const obterVendedorPorIdController = async (req, res) => {
//   try {
//     const vendendor = await obterVendendorPorId(req.params.id);
//     if (vendendor) {
//       res.json(vendendor);
//     } else {
//       res.status(404).json({ mensagem: "Vendendor não encontrado" });
//     }
//   } catch (err) {
//     console.error("Erro ao obter vendendor por ID:", err);
//     res.status(500).json({ mensagem: "Erro ao obter vendendor por ID" });
//   }
// };

// const criarVendedorController = async (req, res) => {
//   try {
//     const { nome, email, telefone, cpf, endereco, data_nasc } = req.body;

//     if (!nome || !email || !telefone || !cpf || !endereco || !data_nasc)
//       return res
//         .status(404)
//         .json({ error: "Parâmetros obrigatórios ausentes." });

//     const emailExistente = await encontrarUsuario(email);
//     if (emailExistente)
//       return res
//         .status(409)
//         .json({ error: "Já existe um cadastro com o email informado." });

//     const telefoneFormatado = telefone.replace(/\D/g, "");
//     if (telefone.lenght < 10 || telefone.lenght > 11)
//       return res.status(400).json({ error: "Telefone inválido." });

//     const cpfFormatado = telefone.replace(/\D/g, "");
//     if (cpf.lenght !== 11)
//       return res.status(400).json({ error: "CPF inválido." });

//     const { logradouro, numero, complemento, bairro, cidade, uf, cep } =
//       endereco;

//     if (!logradouro || !numero || !bairro || !cidade || !uf || !cep)
//       return res
//         .status(404)
//         .json({ error: "Parâmetros do endereço faltando." });

//     const enderecoFormatado = `${logradouro}, ${numero}${
//       complemento ? `, ${complemento}` : ""
//     }, ${bairro}, ${cidade}/${uf}, ${cep}`;

//     const vendendorData = {
//       nome: formatarNome(nome),
//       email,
//       telefone: telefoneFormatado,
//       cpf: cpfFormatado,
//       endereco: enderecoFormatado,
//       perfil: "vendedor",
//       senha: "deve_mudar",
//       data_nasc,
//       id_empresa: req.usuarioEmpresa,
//     };

//     const vendendorId = await criarVendendor(vendendorData);
//     res
//       .status(201)
//       .json({ mensagem: "Vendendor criado com sucesso", vendendorId });
//   } catch (error) {
//     console.error("Erro ao criar vendendor:", error);
//     res.status(500).json({ mensagem: "Erro ao criar vendendor" });
//   }
// };

// const atualizarVendedorController = async (req, res) => {
//   try {
//     const vendendorId = req.params.id;
//     const { nome, email, telefone, endereco } = req.body;
//     const vendendorData = {
//       nome,
//       email,
//       telefone,
//       endereco,
//       foto: fotoPath,
//     };
//     await atualizarVendedor(vendendorId, vendendorData);
//     res.status(200).json({ mensagem: "Vendendor atualizado com sucesso" });
//   } catch (error) {
//     console.error("Erro ao atualizar vendendor:", error);
//     res.status(500).json({ mensagem: "Erro ao atualizar vendendor" });
//   }
// };

// const excluirVendedorController = async (req, res) => {
//   try {
//     const vendendorId = req.params.id;
//     await excluirVendendor(vendendorId);
//     res.status(200).json({ mensagem: "Vendendor excluído com sucesso" });
//   } catch (err) {
//     console.error("Erro ao excluir vendendor:", err);
//     res.status(500).json({ mensagem: "Erro ao excluir vendendor" });
//   }
// };


// export {
//   listarVendedoresController,
//   obterVendedorPorIdController,
//   criarVendedorController,
//   atualizarVendedorController,
//   excluirVendedorController,
// };
