import {
  obterResumoVendas,
  obterProdutosVendidos,
  obterVendedoresAtivos,
  obterMelhorVendedor,
  obterFluxoCaixa,
  calcularTrend
} from "../models/DashBoardGerente.js";

import { obterProdutosEstoqueCritico } from "../models/ProdutoLoja.js";

const dashboardGerenteController = async (req, res) => {
  try {
    const idEmpresa = req.usuarioEmpresa;
    const { periodo = "mes" } = req.query;
    console.log(periodo)

    // Valida período
    const periodosValidos = ["hoje", "semana", "mes", "ano"];
    if (!periodosValidos.includes(periodo)) {
      return res.status(400).json({ 
        error: "Período inválido. Use: hoje, semana, mes ou ano" 
      });
    }

    console.log(`Buscando dados do dashboard para empresa ${idEmpresa}, período: ${periodo}`);

    // Busca todas as informações em paralelo
    const [
      resumoVendas,
      produtosVendidos,
      vendedoresAtivos,
      melhorVendedor,
      fluxoCaixa,
      produtosEstoqueBaixo,
      trend
    ] = await Promise.all([
      obterResumoVendas(idEmpresa, periodo),
      obterProdutosVendidos(idEmpresa, periodo),
      obterVendedoresAtivos(idEmpresa),
      obterMelhorVendedor(idEmpresa, periodo),
      obterFluxoCaixa(idEmpresa, periodo),
      obterProdutosEstoqueCritico(idEmpresa),
      calcularTrend(idEmpresa, periodo)
    ]);

    // Formata resposta
    const dashboard = {
      vendas: {
        total: `R$ ${Number(resumoVendas.valor_total).toFixed(2).replace('.', ',')}`,
        valorNumerico: Number(resumoVendas.valor_total),
        quantidade: Number(produtosVendidos.quantidade_total),
        totalTransacoes: Number(resumoVendas.total_vendas),
        trend: trend,
        porTipoPagamento: {
          pix: Number(resumoVendas.total_pix),
          dinheiro: Number(resumoVendas.total_dinheiro),
          cartao: Number(resumoVendas.total_cartao)
        }
      },
      produtos: {
        vendidos: Number(produtosVendidos.quantidade_total),
        baixoEstoque: produtosEstoqueBaixo.length,
        produtosCriticos: produtosEstoqueBaixo
      },
      vendedores: {
        ativos: Number(vendedoresAtivos.total_ativos),
        melhorVendedor: melhorVendedor.nome,
        vendasMelhorVendedor: Number(melhorVendedor.total_vendas),
        valorMelhorVendedor: Number(melhorVendedor.valor_total)
      },
      fluxoCaixa: {
        entradas: `R$ ${Number(fluxoCaixa.entradas).toFixed(2).replace('.', ',')}`,
        entradasNumerico: Number(fluxoCaixa.entradas),
        saidas: `R$ ${Number(fluxoCaixa.saidas).toFixed(2).replace('.', ',')}`,
        saidasNumerico: Number(fluxoCaixa.saidas),
        saldo: `R$ ${Number(fluxoCaixa.saldo).toFixed(2).replace('.', ',')}`,
        saldoNumerico: Number(fluxoCaixa.saldo)
      },
      periodo: periodo
    };

    console.log(`Dashboard carregado com sucesso`);

    return res.status(200).json({
      mensagem: "Dashboard carregado com sucesso",
      dashboard
    });

  } catch (err) {
    console.error("Erro ao buscar dashboard:", err);
    return res.status(500).json({ 
      error: "Erro ao buscar informações do dashboard",
      detalhes: err.message 
    });
  }
};

export { dashboardGerenteController };