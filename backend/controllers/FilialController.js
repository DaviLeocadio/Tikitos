import {
  listarEmpresas,
  obterEmpresaPorId,
  criarEmpresa,
  atualizarEmpresa,
} from "../models/Empresa.js";
import {
  getLojaById,
  getGerenteByLoja,
  getVendedoresByLoja,
  getResumoFinanceiro,
  getEstoqueResumo,
  getUltimasVendas,
  getCaixaResumo,
  getDespesasDaLoja,
} from "../models/FilialDetalhesModel.js";
import { readRaw } from "../config/database.js";
import { listarProdutos } from "../models/Produto.js";
import { criarProdutoLoja, obterProdutoLoja } from "../models/ProdutoLoja.js";
import { atualizarUsuario, obterGerentePorEmpresa, obterUsuarioPorId } from "../models/Usuario.js";

const listarEmpresasController = async (req, res) => {
  try {
    // Buscar filiais
    const filiais = await listarEmpresas("tipo = 'filial'");

    if (!filiais || filiais.length === 0)
      return res.status(404).json({ error: "Nenhuma empresa encontrada" });

    // período: primeiro dia do mês até hoje
    const hoje = new Date();
    const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const dataInicio = primeiroDia.toISOString().split("T")[0];
    const dataFim = hoje.toISOString().split("T")[0];

    const retorno = await Promise.all(
      filiais.map(async (filial) => {
        const idEmpresa = filial.id_empresa;

        // Buscar gerente (cargo = 'gerente')
        const gerenteRows = await readRaw(
          "SELECT nome FROM usuarios WHERE perfil = 'gerente' AND id_empresa = ? LIMIT 1",
          [idEmpresa]
        );
        const gerente = gerenteRows[0]?.nome || null;

        // Buscar faturamento e total de vendas no mês
        const vendasResumo = await readRaw(
          `SELECT COUNT(id_venda) AS total_vendas, COALESCE(SUM(total), 0) AS faturamento
           FROM vendas
           WHERE id_empresa = ? AND DATE(data_venda) BETWEEN ? AND ?`,
          [idEmpresa, dataInicio, dataFim]
        );
        const totalVendasMes = Number(vendasResumo[0]?.total_vendas || 0);
        const faturamentoMes = Number(vendasResumo[0]?.faturamento || 0);
        const ticketMedio =
          totalVendasMes > 0 ? faturamentoMes / totalVendasMes : 0;

        // Verificar estoque: OK se todos os produtos da loja têm estoque > 5
        const estoqueResumo = await readRaw(
          `SELECT COUNT(*) AS total_produtos, SUM(CASE WHEN estoque > 5 THEN 1 ELSE 0 END) AS acima_limite
           FROM produto_loja
           WHERE id_empresa = ?`,
          [idEmpresa]
        );
        const totalProdutos = Number(estoqueResumo[0]?.total_produtos || 0);
        const acimaLimite = Number(estoqueResumo[0]?.acima_limite || 0);
        const estoqueStatus =
          totalProdutos > 0 && acimaLimite === totalProdutos ? "OK" : "BAIXO";

        // Última venda
        const ultimaVendaRows = await readRaw(
          `SELECT data_venda FROM vendas WHERE id_empresa = ? ORDER BY data_venda DESC LIMIT 1`,
          [idEmpresa]
        );
        const ultimaVenda = ultimaVendaRows[0]?.data_venda || null;

        return {
          id_empresa: filial.id_empresa,
          nome: filial.nome,
          tipo: filial.tipo,
          endereco: filial.endereco,
          status: filial.status,
          gerente,
          faturamento_mes: faturamentoMes,
          total_vendas_mes: totalVendasMes,
          ticket_medio: ticketMedio,
          estoque_status: estoqueStatus,
          ultima_venda: ultimaVenda,
        };
      })
    );

    return res.status(200).json({ filiais: retorno });
  } catch (error) {
    console.error("Erro ao listar empresas: ", error);
    res.status(500).json({ error: "Erro ao listar empresas" });
  }
};

const obterEmpresaPorIdController = async (req, res) => {
  try {
    const { empresaId } = req.params;

    // Verificar existência da loja
    const empresa = await getLojaById(empresaId);
    if (!empresa)
      return res.status(404).json({ error: "Empresa não encontrada" });

    // Período: primeiro dia do mês até hoje
    const hoje = new Date();
    const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const dataInicio = primeiroDia.toISOString().split("T")[0];
    const dataFim = hoje.toISOString().split("T")[0];

    // Reunir dados auxiliares
    const [
      gerente,
      vendedores,
      financeiro,
      estoque,
      ultimas_vendas,
      caixa,
      despesas,
    ] = await Promise.all([
      getGerenteByLoja(empresaId),
      getVendedoresByLoja(empresaId),
      getResumoFinanceiro(empresaId, dataInicio, dataFim),
      getEstoqueResumo(empresaId),
      getUltimasVendas(empresaId, 5),
      getCaixaResumo(empresaId, 5),
      getDespesasDaLoja(empresaId, 10),
    ]);

    // Normalizar nomes das chaves para o formato esperado pelo frontend
    const lojaDetalhes = {
      id_empresa: empresa.id_empresa,
      nome: empresa.nome,
      tipo: empresa.tipo,
      status: empresa.status,
      endereco: empresa.endereco,
      gerente: gerente || null,
      vendedores: vendedores || [],
      financeiro: financeiro || {
        faturamento_mes: 0,
        total_vendas_mes: 0,
        ticket_medio: 0,
        ultima_venda: null,
      },
      estoque: estoque || {
        estoque_status: "OK",
        total_itens: 0,
        produtos_criticos: 0,
        produtos: [],
      },
      ultimas_vendas: ultimas_vendas || [],
      caixa: caixa || { aberturas: [], fechamentos: [] },
      despesas: despesas || [],
    };

    return res.status(200).json(lojaDetalhes);
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

    let listaEstoque = {};

    await Promise.all(
      filiais.map(async (filial) => {
        const idEmpresa = filial.id_empresa;

        if (!listaEstoque[idEmpresa]) listaEstoque[idEmpresa] = {};

        for (const produto of produtos) {
          const produtoLoja = await obterProdutoLoja(
            produto.id_produto,
            idEmpresa
          );
          listaEstoque[idEmpresa][produto.id_produto] = {
            ...produto,
            estoque: produtoLoja ? produtoLoja.estoque : 0,
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

const transferirFuncionarioController = async (req, res) => {
  try {
    const { idUsuario, perfil } = req.body;
    const { empresaId } = req.params;

    const usuario = await obterUsuarioPorId(`id_usuario = ${idUsuario}`);
    if (!usuario)
      return res.status(404).json({ error: "Usuário não encontrado" });

    const empresa = await obterEmpresaPorId(empresaId);
    if (!empresa)
      return res.status(404).json({ error: "Empresa não encontrada" });

    if (perfil && perfil !== "vendedor" && perfil !== "gerente")
      return res.status(400).json({ error: "Perfil inválido" });
    
    const hasGerente = await obterGerentePorEmpresa(empresaId);
    if(hasGerente && perfil === 'gerente') return res.status(409).json({error: 'A empresa já tem um gerente'})
    
    const usuarioData = {
      id_empresa: empresaId,
    };
    if (perfil) usuarioData.perfil = perfil;
    
    const usuarioAtualizado = await atualizarUsuario(idUsuario, usuarioData);

    return res
      .status(200)
      .json({ mensagem: "Usuário transferido com sucesso", usuarioAtualizado });
  } catch (error) {
    console.error("Erro ao transferir funcionario: ", error);
    res.status(500).json({ error: "Erro ao transferir funcionario" });
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
  transferirFuncionarioController,
};
