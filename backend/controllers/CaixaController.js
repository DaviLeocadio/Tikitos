import {
  AbrirCaixa,
  LerCaixaPorVendedor,
  FecharCaixa,
} from "../models/Caixa.js";

import { obterVendaPorData } from "../models/Venda.js";

const AbrirCaixaController = async (req, res) => {
  try {
    const { idVendedor } = req.params;
    const { idEmpresa } = req.body;

    //Verifica se a variavel está certo
    if (!idVendedor || !idEmpresa) {
      return res
        .status(400)
        .json({ mensagem: "ID do vendedor e ID da empresa são obrigatórios" });
    }

    //Verifica se há algum caixa aberto para o vendedor
    const caixaExistente = await LerCaixaPorVendedor(idVendedor);
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
    const valorInicial = 100.0;

    //Dados da abertura do caixa
    const caixaData = {
      id_usuario: idVendedor,
      id_empresa: idEmpresa,
      abertura: abertura,
      valor_inicial: valorInicial,
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
    const { idVendedor } = req.params;
    const { valorFinal } = req.body;

    //Calcular valor final pelas vendas

    //Verrifica se há valores para as variáveis
    if (!idVendedor || !valorFinal) {
      return res
        .status(400)
        .json({ mensagem: "ID do vendedor e valor final são obrigatórios" });
    }

    //Verifica se há um caixa aberto para fechar
    const caixaExistente = await LerCaixaPorVendedor(idVendedor);
    const caixaExistenteStatus = caixaExistente.status;

    if (caixaExistenteStatus !== "aberto") {
      return res.status(400).json({
        mensagem: "Nenhum caixa aberto encontrado para este vendedor",
      });
    }

    const fechamento =
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

    //Dados do fechamento
    const caixaData = {
      fechamento: fechamento,
      valor_final: valorFinal,
      status: "fechado",
    };

    //Fechamento
    const caixaFechado = await FecharCaixa(caixaData, idVendedor);
    res
      .status(200)
      .json({ mensagem: "Caixa fechado com sucesso", caixaFechado });
  } catch (err) {
    console.error("Erro ao fechar caixa: ", err);
    res.status(500).json({ mensagem: "Erro ao fechar caixa" });
  }
};

const ResumoCaixaController = async (req, res) => {
  try {
    //Verifica os dados de venda de um certo dia
    const date = `${new Date().getDate()}/${new Date().getMonth}/${new Date().getFullYear}`;
    const vendas = await obterVendaPorData(date);

    //Adiciona o valor da venda num array
    let valorTotal = [];
    vendas.forEach(venda => {
      valorTotal.push(venda.total)
    });

    //Soma todos os valores dentro do array valorTotal
    const valorTotalVendas = valorTotal.reduce((ultimoValor, valorAtual) => ultimoValor + valorAtual, 0);

    //Total de vendas
    const totalVendas = Object.keys(vendas).length;
    res.status(200).json({ mensagem: "Resumo do caixa enviado com sucesso",valorTotalVendas, totalVendas })
  } catch (error) {
    console.error("Erro ao demonstrar o resumo do caixa no dia", error);
    res.status(500).json({ error: "Erro ao demonstrar o resumo do caixa" })
  }
}

export { AbrirCaixaController, FecharCaixaController, ResumoCaixaController };
