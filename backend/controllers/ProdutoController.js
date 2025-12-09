import {
  listarProdutos,
  obterProdutoPorId,
  criarProduto,
  atualizarProduto,
} from "../models/Produto.js";

import { fileURLToPath } from "url";
import path from "path";
import { obterCategoriaPorId, listarCategorias } from "../models/Categorias.js";
import { criarProdutoLoja, obterProdutoLoja } from "../models/ProdutoLoja.js";
import { mascaraDinheiro } from "../utils/formatadorNumero.js";
import {
  formatarProduto,
  formatarProdutos,
} from "../utils/formatarProdutos.js";

import sharp from "sharp";
import fs from "fs";
import { listarEmpresas, listarTodasEmpresas } from "../models/Empresa.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Gera um nome de arquivo sanitizado a partir de um nome (remove acentos,
// converte para minúsculas, substitui caracteres inválidos por underscore)
function gerarNomeArquivoSanitizado(nome) {
  if (!nome) return `${Date.now()}`;

  const normalizado = nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // remove acentos

  let slug = normalizado
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_") // substitui grupos de caracteres inválidos por _
    .replace(/^_+|_+$/g, ""); // remove underscores nas pontas

  if (!slug) slug = `${Date.now()}`;
  return slug;
}
const listarProdutosController = async (req, res) => {
  try {
    const usuarioEmpresa = req.usuarioEmpresa;
    const usuarioPerfil = req.usuarioPerfil;
    const produtos = await listarProdutos();
    const categorias = await listarCategorias();

    const produtosFormatadosPerfil = await formatarProdutos(
      produtos,
      usuarioPerfil !== "admin" ? usuarioEmpresa : null
    );

    const produtosFormatados = produtosFormatadosPerfil.map((produto) => {
      const categoria = categorias.find(
        (c) => c.id_categoria == produto.id_categoria
      );

      return {
        ...produto,
        categoria: categoria || null,
      };
    });

    res.status(200).json({
      mensagem: "Listagem de produtos realizada com sucesso",
      produtosFormatados,
    });
  } catch (err) {
    console.error("Erro ao listar produtos: ", err);
    res.status(500).json({ mensagem: "Erro na listagem de produtos" });
  }
};

const obterProdutoPorIdController = async (req, res) => {
  try {
    const { idProduto } = req.params;

    let produto = await obterProdutoPorId(idProduto);

    if (!produto || produto.length === 0) {
      return res.status(404).json({
        mensagem: "Produto não encontrado",
      });
    }
    const usuarioEmpresa = req.usuarioEmpresa;
    const usuarioPerfil = req.usuarioPerfil;

    produto = await formatarProduto(
      produto,
      usuarioPerfil !== "admin" ? usuarioEmpresa : null
    );

    res.status(200).json({ mensagem: "Produto obtido com sucesso", produto });
  } catch (err) {
    console.error("Erro ao obter o produto pelo ID: ", err);
    res.status(500).json({ mensagem: "Erro ao obter o produto desejado" });
  }
};

const criarProdutoController = async (req, res) => {
  try {
    // Aceita campos em snake_case (do form-data) ou camelCase
    const proximoId = req.body.proximo_id ?? req.body.proximoId ?? null;
    const idCategoria = req.body.id_categoria ?? req.body.idCategoria ?? null;
    const idFornecedor = req.body.id_fornecedor ?? req.body.idFornecedor ?? null;
    const nome = req.body.nome ?? null;
    const descricao = req.body.descricao ?? null;
    const custoRaw = req.body.custo ?? null;
    const lucroRaw = req.body.lucro ?? null;
    const precoRaw = req.body.preco ?? null;

    const idEmpresa = req.usuarioEmpresa ?? null;

    const custo = custoRaw !== null && custoRaw !== "" ? parseFloat(custoRaw) : null;
    const lucro = lucroRaw !== null && lucroRaw !== "" ? parseFloat(lucroRaw) : null;
    // prefer explicit preco, senão calcula a partir de custo+lucro
    const preco = precoRaw !== null && precoRaw !== "" ? parseFloat(precoRaw) : (custo !== null && lucro !== null ? parseFloat((custo * (1 + lucro / 100)).toFixed(2)) : null);

    let imagemPath = null;
    if (req.file) {
      const caminhoTemp = req.file.path; // caminho temporário enviado pelo multer

      // Lê metadados da imagem
      const meta = await sharp(caminhoTemp).metadata();

      if (meta.width !== meta.height) {
        // apaga a imagem que o multer salvou
        fs.unlinkSync(caminhoTemp);

        return res.status(400).json({
          error: "A imagem deve ser quadrada (ex: 600x600, 1024x1024)",
        });
      }

      if (req.file.mimetype !== "image/png") {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          error: "A imagem deve estar no formato PNG.",
        });
      }

      // Renomeia o arquivo salvo pelo multer para um nome derivado do produto
      // (ex: "Urso de Pelúcia" -> "urso_de_pelucia.png")
      try {
        const dir = path.dirname(caminhoTemp);
        const ext = path.extname(req.file.originalname).toLowerCase() || ".png";
        const slug = gerarNomeArquivoSanitizado(nome);
        let novoNome = `${slug}${ext}`;
        let novoPath = path.join(dir, novoNome);

        if (fs.existsSync(novoPath)) {
          // evita sobrescrever — adiciona timestamp
          novoNome = `${slug}_${Date.now()}${ext}`;
          novoPath = path.join(dir, novoNome);
        }

        fs.renameSync(caminhoTemp, novoPath);

        imagemPath = `/img/produtos/${novoNome}`;
      } catch (err) {
        console.error("Erro ao renomear imagem do produto:", err);
        // tenta remover o arquivo temporário caso algo dê errado
        try {
          if (fs.existsSync(caminhoTemp)) fs.unlinkSync(caminhoTemp);
        } catch (e) {}
        return res.status(500).json({ error: "Erro ao processar a imagem do produto." });
      }
    }

    // Garante que undefined não seja passado — usar null explicitamente
    const produtoData = {
      id_produto: proximoId ?? null,
      id_empresa: idEmpresa ?? null,
      id_categoria: idCategoria ?? null,
      id_fornecedor: idFornecedor ?? null,
      nome: nome ?? null,
      descricao: descricao ?? null,
      custo: custo !== null ? custo : null,
      lucro: lucro !== null ? lucro : null,
      preco: preco !== null ? preco : null,
      imagem: imagemPath ?? null,
    };

    const produto = await criarProduto(produtoData);

    const empresas = await listarTodasEmpresas();

    try {
      if (empresas && empresas.length > 0) {
        await Promise.all(
          empresas.map((e) =>
            criarProdutoLoja({ id_produto: produto, id_empresa: e.id_empresa, estoque: 25 })
          )
        );
      }
    } catch (err) {
      console.error("Erro ao criar registros de produto por empresa/filial:", err);
    }
    res.status(201).json({ mensagem: "Produto criado com sucesso", produto });
  } catch (error) {
    console.error("Erro ao criar o produto: ", error);
    res.status(500).json({ error: "Erro ao criar o produto desejado" });
  }
};

const atualizarProdutoController = async (req, res) => {
  try {
    // Aceita campos em snake_case (do form-data) ou camelCase
    const { idProduto } = req.params;
    const idCategoria = req.body.id_categoria ?? req.body.idCategoria ?? null;
    const idFornecedor = req.body.id_fornecedor ?? req.body.idFornecedor ?? null;
    const nome = req.body.nome ?? null;
    const descricao = req.body.descricao ?? null;
    const custoRaw = req.body.custo ?? null;
    const lucroRaw = req.body.lucro ?? null;
    const precoRaw = req.body.preco ?? null;

    const idEmpresa = req.usuarioEmpresa ?? null;

    const custo = custoRaw !== null && custoRaw !== "" ? parseFloat(custoRaw) : null;
    const lucro = lucroRaw !== null && lucroRaw !== "" ? parseFloat(lucroRaw) : null;
    // prefere preco explícito, senão calcula a partir de custo+lucro
    const preco = precoRaw !== null && precoRaw !== "" ? parseFloat(precoRaw) : (custo !== null && lucro !== null ? parseFloat((custo * (1 + lucro / 100)).toFixed(2)) : null);

    // Validação básica
    if (!nome || nome.trim() === "") {
      return res.status(400).json({ mensagem: "Nome do produto é obrigatório" });
    }

    if (custo === null || Number.isNaN(custo)) {
      return res.status(400).json({ mensagem: "Custo é obrigatório" });
    }

    if (lucro === null || Number.isNaN(lucro)) {
      return res.status(400).json({ mensagem: "Lucro é obrigatório" });
    }

    let imagemPath = null;
    if (req.file) {
      const caminhoTemp = req.file.path; // caminho temporário salvo pelo multer

      // Lê metadados da imagem
      const meta = await sharp(caminhoTemp).metadata();

      if (meta.width !== meta.height) {
        // apaga a imagem que o multer salvou
        fs.unlinkSync(caminhoTemp);

        return res.status(400).json({
          error: "A imagem deve ser quadrada (ex: 600x600, 1024x1024)",
        });
      }

      if (req.file.mimetype !== "image/png") {
        fs.unlinkSync(caminhoTemp);
        return res.status(400).json({
          error: "A imagem deve estar no formato PNG.",
        });
      }

      // Renomeia o arquivo salvo pelo multer para um nome derivado do produto
      try {
        const dir = path.dirname(caminhoTemp);
        const ext = path.extname(req.file.originalname).toLowerCase() || ".png";
        const slug = gerarNomeArquivoSanitizado(nome);
        let novoNome = `${slug}${ext}`;
        let novoPath = path.join(dir, novoNome);

        if (fs.existsSync(novoPath)) {
          // evita sobrescrever — adiciona timestamp
          novoNome = `${slug}_${Date.now()}${ext}`;
          novoPath = path.join(dir, novoNome);
        }

        fs.renameSync(caminhoTemp, novoPath);

        imagemPath = `/img/produtos/${novoNome}`;
      } catch (err) {
        console.error("Erro ao renomear imagem do produto:", err);
        try {
          if (fs.existsSync(caminhoTemp)) fs.unlinkSync(caminhoTemp);
        } catch (e) {}
        return res.status(500).json({ error: "Erro ao processar a imagem do produto." });
      }
    }

    // Garante que valores undefined sejam convertidos para null
    const produtoData = {
      id_empresa: idEmpresa ?? null,
      id_categoria: idCategoria ?? null,
      id_fornecedor: idFornecedor ?? null,
      nome: nome ?? null,
      descricao: descricao ?? null,
      custo: custo !== null ? custo : null,
      lucro: lucro !== null ? lucro : null,
      preco: preco !== null ? preco : null,
    };

    // Só atualiza o campo de imagem se um novo arquivo foi enviado
    if (imagemPath !== null) {
      produtoData.imagem = imagemPath;
    }

    const produto = await atualizarProduto(idProduto, produtoData);
    res.status(200).json({ mensagem: "Produto atualizado com sucesso", produto });
  } catch (err) {
    console.error("Erro ao atualizar o produto: ", err);
    res.status(500).json({ mensagem: "Erro ao atualizar o produto pedido" });
  }
};

const desativarProdutoController = async (req, res) => {
  try {
    const { idProduto } = req.params;

    const produtoDesativado = await atualizarProduto(idProduto, {
      status: "inativo",
    });

    if (produtoDesativado == 0)
      return res.status(404).json({ error: "Produto não encontrado" });

    return res
      .status(200)
      .json({ mensagem: "Produto desativado com sucesso", produtoDesativado });
  } catch (error) {
    console.error("Erro ao desativar produto: ", error);
    res.status(500).json({ mensagem: "Erro ao desativar produto" });
  }
};

const ativarProdutoController = async (req, res) => {
  try {
    const { idProduto } = req.params;

    const produtoAtivado = await atualizarProduto(idProduto, {
      status: "ativo",
    });

    if (produtoAtivado == 0)
      return res.status(404).json({ error: "Produto não encontrado" });

    return res
      .status(200)
      .json({ mensagem: "Produto ativado com sucesso", produtoAtivado });
  } catch (error) {
    console.error("Erro ao ativar produto: ", err);
    res.status(500).json({ mensagem: "Erro ao ativar produto" });
  }
};

export {
  listarProdutosController,
  obterProdutoPorIdController,
  criarProdutoController,
  atualizarProdutoController,
  desativarProdutoController,
  ativarProdutoController,
};
