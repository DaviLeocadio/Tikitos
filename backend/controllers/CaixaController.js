import {
  AbrirCaixa,
  LerCaixaPorVendedor,
  FecharCaixa,
} from "../models/Caixa.js";

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
      .json({ mensagem: "Caixa aberto com sucesso", caixaFechado });
  } catch (err) {
    console.error("Erro ao fechar caixa: ", err);
    res.status(500).json({ mensagem: "Erro ao fechar caixa" });
  }
};

export { AbrirCaixaController, FecharCaixaController };
