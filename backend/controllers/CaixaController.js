import {
  AbrirCaixa,
  LerCaixaPorVendedor,
  FecharCaixa,
  ListarCaixasPorEmpresa,
  RelatorioCaixa,
  RelatorioCaixaIntervalo,
  obterCaixaPorId,
  resumoVendasCaixa,
  listarCaixa,
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
import { readRaw } from "../config/database.js";
import "dotenv/config";

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

    const dataHoje = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

    // 1. BUSCAR TODAS AS VENDAS DO DIA DO USUÁRIO
    const vendas = await readRaw(
      `SELECT id_venda, total, data_venda 
       FROM vendas 
       WHERE id_usuario = ? AND id_empresa = ? AND DATE(data_venda) = ? AND id_caixa = ?`,
      [idUsuario, idEmpresa, dataHoje, idCaixa]
    );

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

    const idsVenda = vendas.map((v) => v.id_venda);

    // 2. BUSCAR ITENS DE TODAS AS VENDAS EM UMA SÓ QUERY
    const itensVendaTotal = await readRaw(
      `SELECT id_venda, id_produto, quantidade
       FROM venda_itens
       WHERE id_venda IN (${idsVenda.map(() => "?").join(",")})`,
      idsVenda
    );

    // TOTAL DE PRODUTOS
    const totalProdutos = itensVendaTotal.reduce(
      (acc, i) => acc + i.quantidade,
      0
    );

    // TOTAL DE VENDAS
    const totalVendas = vendas.length;

    // TOTAL EM R$
    const totalCaixa = vendas.reduce((acc, v) => acc + parseFloat(v.total), 0);

    // 3. CATEGORIA MAIS VENDIDA (OTIMIZADO)
    const produtosIds = [...new Set(itensVendaTotal.map((i) => i.id_produto))];

    const produtos = await readRaw(
      `SELECT id_produto, id_categoria 
       FROM produtos 
       WHERE id_produto IN (${produtosIds.map(() => "?").join(",")})`,
      produtosIds
    );

    const categoriasIds = [...new Set(produtos.map((p) => p.id_categoria))];

    const categorias = await readRaw(
      `SELECT id_categoria, nome 
       FROM categorias 
       WHERE id_categoria IN (${categoriasIds.map(() => "?").join(",")})`,
      categoriasIds
    );

    const catMap = {};
    categorias.forEach((c) => {
      catMap[c.id_categoria] = c.nome;
    });

    const contadorCategorias = {};

    itensVendaTotal.forEach((item) => {
      const prod = produtos.find((p) => p.id_produto === item.id_produto);
      if (!prod) return;

      const catId = prod.id_categoria;
      if (!contadorCategorias[catId]) {
        contadorCategorias[catId] = {
          id: catId,
          nome: catMap[catId],
          quantidade: 0,
        };
      }
      contadorCategorias[catId].quantidade += item.quantidade;
    });

    const categoriaMaisVendida = Object.values(contadorCategorias).sort(
      (a, b) => b.quantidade - a.quantidade
    )[0] || { id: 0, nome: "N/A" };

    // 4. HORÁRIO COM MAIS VENDAS
    const vendasPorHora = {};

    vendas.forEach((v) => {
      const hora = new Date(v.data_venda).getHours();
      vendasPorHora[hora] = (vendasPorHora[hora] || 0) + 1;
    });

    const horaMaisVendas = Object.keys(vendasPorHora).reduce((a, b) =>
      vendasPorHora[a] > vendasPorHora[b] ? a : b
    );
    const horarioMaisVendas = `${horaMaisVendas}h`;

    // 5. ALERTA DE ESTOQUE (READRAW)
    const alertaEstoque = (
      await readRaw(
        `SELECT COUNT(*) AS total 
       FROM produto_loja 
       WHERE id_empresa = ? AND estoque <= ${process.env.ESTOQUE_MINIMO}`,
        [idEmpresa]
      )
    )[0].total;

    // 6. PRODUTOS EM PROMOÇÃO (READRAW)
    const produtosPromocao = (
      await readRaw(
        `SELECT COUNT(*) AS total 
       FROM produto_loja 
       WHERE id_empresa = ? AND desconto > 0`,
        [idEmpresa]
      )
    )[0].total;

    // 7. HISTÓRICO DE COMPRAS
    const historicoCompras = vendas.map((v) => {
      const itensDaVenda = itensVendaTotal.filter(
        (i) => i.id_venda === v.id_venda
      );
      return {
        produtos: itensDaVenda.reduce((acc, i) => acc + i.quantidade, 0),
        valor: parseFloat(v.total),
      };
    });

    // 8. VENDAS DA SEMANA + SEMANA PASSADA - TUDO EM SQL
    const diasSemanaPt = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    const linhas = await readRaw(`
    WITH RECURSIVE ultimos14dias AS (
        SELECT CURDATE() - INTERVAL 13 DAY AS data
        UNION ALL
        SELECT data + INTERVAL 1 DAY
        FROM ultimos14dias
        WHERE data < CURDATE()
    )

    SELECT 
        d.data,
        DAYOFWEEK(d.data) AS dia_semana_num,
        CASE 
            WHEN d.data >= CURDATE() - INTERVAL 6 DAY THEN 'semana_atual'
            ELSE 'semana_passada'
        END AS semana,
        COALESCE(v.total, 0) AS total_vendas
    FROM ultimos14dias d
    LEFT JOIN (
        SELECT DATE(data_venda) AS data, COUNT(*) AS total
        FROM vendas
        WHERE id_usuario = ?
          AND id_empresa = ?
          AND DATE(data_venda) BETWEEN CURDATE() - INTERVAL 13 DAY AND CURDATE()
        GROUP BY DATE(data_venda)
    ) v ON d.data = v.data
    ORDER BY d.data;
`,
      [idUsuario, idEmpresa]
    );

    // MONTAR LISTAS FINAIS PARA O GRÁFICO
    const vendasSemana = [];
    const vendasSemanaPassada = [];

    linhas.forEach((row) => {
      const nomeDia = diasSemanaPt[row.dia_semana_num - 1];
      const item = {
        dia: nomeDia,
        vendas: row.total_vendas,
        data: row.data,
      };

      if (row.semana === "semana_atual") {
        vendasSemana.push(item);
      } else {
        vendasSemanaPassada.push(item);
      }
    });

    // 9. VALOR DO CAIXA
    const caixa = await readRaw(
      `SELECT valor_inicial, valor_final 
       FROM caixa 
       WHERE id_caixa = ?`,
      [idCaixa]
    );

    const valorCaixa = caixa.length
      ? parseFloat(caixa[0].valor_final || 0) -
        parseFloat(caixa[0].valor_inicial || 0)
      : 0;

    return res.status(200).json({
      mensagem: "Resumo do caixa enviado com sucesso",
      totalCaixa,
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
      vendasSemanaPassada,
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
        const valor_total = (
          parseFloat(caixa.valor_final || 0) -
          parseFloat(caixa.valor_inicial || 0)
        ).toFixed(2);
        caixaData.push({
          data: caixa.abertura,
          valor_total,
          caixas: 1,
          idCaixa: caixa.id_caixa,
        });
      });
    } else {
      // Full report grouped by date
      const relatorio = await RelatorioCaixa(idEmpresa);
      caixaData = relatorio;
    }
    return res
      .status(200)
      .json({ mensagem: "Caixas listados com sucesso", caixaData });
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
    console.log(idCaixa)

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

const listarCaixaController = async (req, res) => {
  try {
    const caixaListado = await listarCaixa();
    res.status(200).json({ mensagem: "listar caixa", caixaListado })
  } catch (error) {
    console.error("Erro ao obter listagem de um caixa", error);
    res.status(500).json({ error: "Erro ao obter listagem de um caixa" });
  }
}

export {
  AbrirCaixaController,
  FecharCaixaController,
  ResumoCaixaController,
  fluxoCaixaDiarioController,
  obterResumoCaixaController,
  listarCaixaController
};
