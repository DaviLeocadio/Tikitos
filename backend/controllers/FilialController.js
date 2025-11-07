import {
  listarEmpresas,
  obterEmpresaPorId,
  criarEmpresa,
  atualizarEmpresa,
} from "../models/Empresa.js";
import { listarProdutos } from "../models/Produto.js";
import { criarProdutoLoja, obterProdutoLoja } from "../models/ProdutoLoja.js";

const listarEmpresasController = async (req, res) => {
  try {
    const empresas = await listarEmpresas();

    if (empresas.length == 0)
      return res.status(404).json({ error: "Nenhuma empresa encontrada" });

    return res.status(200).json({ empresas });
  } catch (error) {
    console.error("Erro ao listar empresas: ", error);
    res.status(500).json({ error: "Erro ao listar empresas" });
  }
};

const obterEmpresaPorIdController = async (req, res) => {
  try {
    const { empresaId } = req.params;

    const empresa = await obterEmpresaPorId(empresaId);

    if (!empresa)
      return res.status(404).json({ error: "Empresa não encontrada" });

    return res.status(200).json({ empresa });
  } catch (error) {
    console.error("Erro ao obter empresa por ID: ", error);
    res.status(500).json({ error: "Erro ao obter empresa por ID" });
  }
};

const criarEmpresaController = async (req, res) => {
  try {
    const { nome, endereco } = req.body;

    if (!nome || !endereco)
      return res
        .status(404)
        .json({ error: "Parâmetros obrigatórios ausentes" });

    const { logradouro, numero, complemento, bairro, cidade, uf, cep } =
      endereco;

    if (!logradouro || !numero || !bairro || !cidade || !uf || !cep)
      return res
        .status(404)
        .json({ error: "Parâmetros do endereço faltando." });

    const enderecoFormatado = `${logradouro}, ${numero}${
      complemento ? `, ${complemento}` : ""
    } - ${bairro}, ${cidade} - ${uf}, ${cep}`;

    const empresaData = {
      nome: nome,
      tipo: "filial",
      endereco: enderecoFormatado,
    };

    const empresaId = await criarEmpresa(empresaData);

    const produtos = await listarProdutos();

    const produtoLojaCriado = await Promise.all(
      produtos.map((produto) => {
        const produtoLojaData = {
          id_produto: produto.id_produto,
          id_empresa: empresaId,
          desconto: 0.0,
          estoque: 0,
        };
        return criarProdutoLoja(produtoLojaData);
      })
    );

    return res.status(201).json({
      mensagem: "Empresa criada com sucesso",
      empresaId,
      produtoLojaCriado,
    });
  } catch (error) {
    console.error("Erro ao criar empresa: ", error);
    res.status(500).json({ error: "Erro ao criar empresa" });
  }
};

const atualizarEmpresaController = async (req, res) => {
  try {
    const { empresaId } = req.params;

    const { nome, endereco, status } = req.body;

    if (!nome || !status)
      return res
        .status(404)
        .json({ error: "Parâmetros obrigatórios ausentes" });

    const empresaData = {
      nome: nome,
      status: status,
    };

    if (endereco) {
      const { logradouro, numero, complemento, bairro, cidade, uf, cep } =
        endereco;

      if (!logradouro || !numero || !bairro || !cidade || !uf || !cep)
        return res
          .status(404)
          .json({ error: "Parâmetros do endereço faltando." });

      const enderecoFormatado = `${logradouro}, ${numero}${
        complemento ? `, ${complemento}` : ""
      } - ${bairro}, ${cidade} - ${uf}, ${cep}`;

      empresaData.push(enderecoFormatado);
    }

    const empresaAtualizada = await atualizarEmpresa(empresaId, empresaData);

    return res
      .status(201)
      .json({ mensagem: "Empresa atualizada com sucesso", empresaAtualizada });
  } catch (error) {
    console.error("Erro ao atualizar empresa: ", error);
    res.status(500).json({ error: "Erro ao atualizar empresa" });
  }
};

const desativarFilialController = async (req, res) => {
  try {
    const { empresaId } = req.params;

    const empresaDesativada = await atualizarEmpresa(empresaId, {
      status: "inativo",
    });

    return res
      .status(201)
      .json({ mensagem: "Empresa desativada com sucesso!", empresaDesativada });
  } catch (error) {
    console.error("Erro ao desativar filial: ", error);
    res.status(500).json({ error: "Erro ao desativar filial" });
  }
};

const estoqueFilialController = async (req, res) => {
  try {
    const { empresaId } = req.params;

    const produtos = await listarProdutos();

    const estoque = await Promise.all(
      produtos.map(async (produto) => {
        const produtoLoja = await obterProdutoLoja(
          produto.id_produto,
          empresaId
        );
        return {
          ...produto,
          estoque: produtoLoja.estoque,
        };
      })
    );

    return res
      .status(200)
      .json({ mensagem: "Estoque da filial obtido com sucesso", estoque });
  } catch (error) {
    console.error("Erro ao obter estoque de uma filial: ", error);
    res.status(500).json({ error: "Erro ao obter estoque de uma filial" });
  }
};

const estoqueTodasFiliaisController = async (req, res) => {
  try {
    const filiais = await listarEmpresas("tipo = 'filial'");
    const produtos = await listarProdutos();

    await Promise.all(
      filiais.map(async (filial) => {
        const idEmpresa = filial.id_empresa;
        let listaEstoque = {};

        for (const produto of produtos) {
          const produtoLoja = await obterProdutoLoja(
            produto.id_produto,
            idEmpresa
          );
          listaEstoque[idEmpresa][produto.id_produto] = {
            ...produto,
            estoque: produtoLoja.estoque,
          };
        }
      })
    );

    return res.status(200).json({
      mensagem: "Lista de estoque das filiais obtido com sucesso",
      listaEstoque,
    });
  } catch (error) {
    console.error("Erro ao listar estoque das filiais: ", error);
    res.status(500).json({ error: "Erro ao listar estoque das filiais" });
  }
};

export {
  listarEmpresasController,
  obterEmpresaPorIdController,
  criarEmpresaController,
  atualizarEmpresaController,
  desativarFilialController,
  estoqueFilialController,
  estoqueTodasFiliaisController,
};
