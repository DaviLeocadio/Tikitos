import {
  AbrirCaixa,
  LerCaixaPorVendedor,
  FecharCaixa,
  ListarCaixasPorEmpresa,
  RelatorioCaixa,
  RelatorioCaixaIntervalo,
  obterCaixaPorId,
  resumoVendasCaixa,
  CaixaAbertoVendedor,
} from "../models/Caixa.js";

import {
  listarVendasPorCaixa,
  obterVendaPorData,
  obterVendaPorDataUsuario,
} from "../models/Venda.js";

import { listarItensVenda } from "../models/ItensVenda.js";
import {
  contarProdutosEmPromocao,
  obterProdutosEstoqueCritico,
} from "../models/ProdutoLoja.js";
import { obterProdutoPorId } from "../models/Produto.js";
import { obterCategoriaPorId } from "../models/Categorias.js";

const AbrirCaixaController = async (req, res) => {
  try {
    const idEmpresa = req.usuarioEmpresa;
    const idVendedor = req.usuarioId;

    //Verifica se a variavel está certo
    if (!idVendedor || !idEmpresa) {
      return res
        .status(400)
        .json({ mensagem: "ID do vendedor e ID da empresa são obrigatórios" });
    }

    //Verifica se há algum caixa aberto para o vendedor
    const caixaExistente = await CaixaAbertoVendedor(idVendedor);
    if (caixaExistente) {
      return res
        .status(400)
        .json({ mensagem: "Caixa já está aberto para este vendedor" });
    }

    const abertura =
      new Date().getFullYear() +
      "/" +
      (new Date().getMonth() + 1) +
      "/" +
      new Date().getDay() +
      " " +
      new Date().getHours() +
      ":" +
      new Date().getMinutes() +
      ":" +
      new Date().getSeconds();

    //Dados da abertura do caixa
    const caixaData = {
      id_usuario: idVendedor,
      id_empresa: idEmpresa,
      abertura: abertura,
      valor_inicial: 100.0,
      valor_final: 100.0,
      status: "aberto",
    };

    const novoCaixa = await AbrirCaixa(caixaData);

    res.status(200).json({ mensagem: "Caixa aberto com sucesso", novoCaixa });
  } catch (err) {
    console.error("Erro ao abrir caixa: ", err);
    res.status(500).json({ mensagem: "Erro ao abrir caixa" });
  }
};

const FecharCaixaController = async (req, res) => {
  try {
    const idVendedor = req.usuarioId;

    //Calcular valor final pelas vendas

    //Verrifica se há valores para as variáveis
    if (!idVendedor) {
      return res
        .status(400)
        .json({ mensagem: "ID do vendedor e valor final são obrigatórios" });
    }

    //Verifica se há um caixa aberto para fechar
    const caixaExistente = await CaixaAbertoVendedor(idVendedor);

    if (!caixaExistente) {
      return res.status(400).json({
        mensagem: "Nenhum caixa aberto encontrado para este vendedor",
      });
    }
    const valorFinal =
      caixaExistente.valor_final - caixaExistente.valor_inicial;

    const fechamento =
      new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      new Date().getDate() +
      " " +
      new Date().getHours() +
      ":" +
      new Date().getMinutes() +
      ":" +
      new Date().getSeconds();

    //Dados do fechamento
    const caixaData = {
      fechamento: fechamento,
      valor_final: valorFinal,
      status: "fechado",
    };

    //Fechamento
    const caixaFechado = await FecharCaixa(caixaData, caixaExistente.id_caixa);
    return res
      .status(200)
      .json({ mensagem: "Caixa fechado com sucesso", caixaFechado });
  } catch (err) {
    console.error("Erro ao fechar caixa: ", err);
    res.status(500).json({ mensagem: "Erro ao fechar caixa" });
  }
};

const ResumoCaixaController = async (req, res) => {
  try {
    const { idCaixa } = req.params;
    const idEmpresa = req.usuarioEmpresa;
    const idUsuario = req.usuarioId;

    if (!idCaixa) {
      return res
        .status(400)
        .json({ mensagem: "Parâmetros necessários incompletos" });
    }

    // Data formatada
    const hoje = (new Date()).toLocaleDateString("pt-BR");
    const date = new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      new Date().getDate()
    

    // 1. VENDAS DO DIA (pelo usuário, não pelo caixa)
    const vendas = await obterVendaPorDataUsuario(date, idUsuario, idEmpresa);

    if (vendas.length === 0) {
      return res.status(200).json({
        mensagem: "Nenhuma venda encontrada para hoje",
        totalCaixa: 0,
        totalProdutos: 0,
        valorCaixa: 0,
        totalVendas: 0,
        categoriaMaisVendida: { numero: 0, nome: "N/A" },
        horarioMaisVendas: "0h",
        alertaEstoque: 0,
        produtosPromocao: 0,
        historicoCompras: [],
        vendasSemana: [],
      });
    }

    const idVenda = vendas.map((v) => v.id_venda);

    // Itens das vendas
    let itensVendaTotal = [];
    for (const id of idVenda) {
      const itens = await listarItensVenda(id);
      itensVendaTotal.push(...itens);
    }

    // Total de produtos vendidos
    const totalProdutos = itensVendaTotal.reduce(
      (acc, item) => acc + item.quantidade,
      0
    );

    // Valor total
    const valorTotalVendas = vendas.reduce(
      (acc, v) => acc + parseFloat(v.total),
      0
    );

    // Total de vendas
    const totalVendas = vendas.length;

    // 2. CATEGORIA MAIS VENDIDA
    const categoriasPorQuantidade = {};

    for (const item of itensVendaTotal) {
      const produto = await obterProdutoPorId(item.id_produto);

      if (produto && produto.id_categoria) {
        const categoriaId = produto.id_categoria;
        const categoria = await obterCategoriaPorId(categoriaId);

        if (!categoriasPorQuantidade[categoriaId]) {
          categoriasPorQuantidade[categoriaId] = {
            id: categoriaId,
            nome: categoria ? categoria.nome : "Categoria " + categoriaId,
            quantidade: 0,
          };
        }

        categoriasPorQuantidade[categoriaId].quantidade += item.quantidade;
      }
    }

    const categoriasArray = Object.values(categoriasPorQuantidade);
    const categoriaMaisVendida =
      categoriasArray.length > 0
        ? categoriasArray.sort((a, b) => b.quantidade - a.quantidade)[0]
        : { nome: "N/A", id: 0 };

    // 3. HORÁRIO DE MAIS VENDAS
    const vendasPorHora = {};
    for (const venda of vendas) {
      const hora = new Date(venda.data_venda).getHours();
      vendasPorHora[hora] = (vendasPorHora[hora] || 0) + 1;
    }

    let horaMaisVendas = Object.keys(vendasPorHora).reduce((a, b) =>
      vendasPorHora[a] > vendasPorHora[b] ? a : b
    );
    const horarioMaisVendas = `${horaMaisVendas}h`;

    // 4. ALERTA DE ESTOQUE
    const alertaEstoque = (await obterProdutosEstoqueCritico(idEmpresa)).length;

    // 5. PRODUTOS EM PROMOÇÃO
    const produtosPromocao = (await contarProdutosEmPromocao(idEmpresa)).length;

    // 6. HISTÓRICO
    const historicoCompras = vendas.map((venda) => {
      const itensDestaVenda = itensVendaTotal.filter(
        (item) => item.id_venda === venda.id_venda
      );
      const totalProdutosVenda = itensDestaVenda.reduce(
        (acc, item) => acc + item.quantidade,
        0
      );

      return {
        produtos: totalProdutosVenda,
        valor: parseFloat(venda.total),
      };
    });

    // 7. VENDAS DA SEMANA (USANDO idUsuario)
    const vendasSemana = [];
    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    for (let i = 4; i >= 0; i--) {
      const data = new Date();
      data.setDate(data.getDate() - i);
      const dataFormatada = data.toISOString().split("T")[0];

      const vendasDia = await obterVendaPorDataUsuario(
        dataFormatada,
        idUsuario,
        idEmpresa
      );

      vendasSemana.push({
        dia: diasSemana[data.getDay()],
        valor: vendasDia.length,
      });
    }

    // 8. VALOR DO CAIXA ATUAL (aqui sim usa idCaixa)
    const caixa = await obterCaixaPorId(idCaixa);
    const valorCaixa = caixa
      ? parseFloat(caixa.valor_final || 0) -
        parseFloat(caixa.valor_inicial || 0)
      : 0;

    // RESPOSTA
    res.status(200).json({
      mensagem: "Resumo do caixa enviado com sucesso",
      totalCaixa: valorTotalVendas,
      totalProdutos,
      valorCaixa,
      totalVendas,
      categoriaMaisVendida: {
        numero: categoriaMaisVendida.id,
        nome: categoriaMaisVendida.nome,
      },
      horarioMaisVendas,
      alertaEstoque,
      produtosPromocao,
      historicoCompras,
      vendasSemana,
    });
  } catch (error) {
    console.error("Erro ao demonstrar o resumo do caixa no dia", error);
    res.status(500).json({ error: "Erro ao demonstrar o resumo do caixa" });
  }
};

const fluxoCaixaDiarioController = async (req, res) => {
  try {
    const idEmpresa = req.usuarioEmpresa;
    const { dataCaixa, dataInicio, dataFim } = req.query;

    let caixaData = [];

    if (dataInicio && dataFim) {
      caixaData = await RelatorioCaixaIntervalo(idEmpresa, dataInicio, dataFim);
    } else if (dataCaixa) {
      const caixas = await ListarCaixasPorEmpresa(idEmpresa, dataCaixa);
      caixas.forEach((caixa) => {
        const valor_total = (parseFloat(caixa.valor_final || 0) - parseFloat(caixa.valor_inicial || 0)).toFixed(2);
        caixaData.push({ data: caixa.abertura, valor_total, caixas: 1, idCaixa: caixa.id_caixa });
      });
    } else {
      // Full report grouped by date
      const relatorio = await RelatorioCaixa(idEmpresa);
      caixaData = relatorio;
    }
    return res.status(200).json({ mensagem: "Caixas listados com sucesso", caixaData });
  } catch (error) {
    console.error("Erro ao montar resumo diário de caixa", error);
    res.status(500).json({ error: "Erro ao montar resumo diário de caixa" });
  }
};

const obterResumoCaixaController = async (req, res) => {
  try {
    const { idCaixa } = req.params;
    const caixa = await obterCaixaPorId(idCaixa);
    if (!caixa) return res.status(404).json({ error: "Caixa não encontrado" });

    const vendas = await listarVendasPorCaixa(idCaixa);

    const resumoCaixa = await resumoVendasCaixa(idCaixa);

    return res.status(200).json({
      mensagem: "Resumo do caixa obtido com sucesso",
      resumoCaixa,
      vendas,
    });
  } catch (error) {
    console.error("Erro ao obter resumo de um caixa", error);
    res.status(500).json({ error: "Erro ao obter resumo de um caixa" });
  }
};

export {
  AbrirCaixaController,
  FecharCaixaController,
  ResumoCaixaController,
  fluxoCaixaDiarioController,
  obterResumoCaixaController,
};
