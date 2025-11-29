import {
  obterResumoVendas,
  obterProdutosVendidos,
  obterVendedoresAtivos,
  obterMelhorVendedor,
  obterFluxoCaixaConsolidado,
  calcularTrend,
  obterVendasPorFilial,
  obterContasAPagar
} from "../models/DashboardAdmin.js";

import { obterProdutosEstoqueCritico } from "../models/ProdutoLoja.js";

const dashboardAdminController = async (req, res) => {
  try {
    const idEmpresa = req.usuarioEmpresa;
    // Opcional: Se o admin filtrar por uma filial específica na UI
    const { periodo = "mes", idFilial = null } = req.query; 

    // Valida período
    const periodosValidos = ["hoje", "semana", "mes", "ano"];
    if (!periodosValidos.includes(periodo)) {
      return res.status(400).json({
        error: "Período inválido. Use: hoje, semana, mes ou ano"
      });
    }

    console.log(`Buscando dados do dashboard ADMIN para empresa ${idEmpresa}, período: ${periodo}`);

    // Busca todas as informações em paralelo para performance
    const [
      resumoVendas,
      produtosVendidos,
      vendedoresAtivos,
      melhorVendedor,
      fluxoCaixa,
      produtosEstoqueBaixo,
      trend,
      rankingLojas,
      contasPagar
    ] = await Promise.all([
      obterResumoVendas(idEmpresa, periodo, idFilial),
      obterProdutosVendidos(idEmpresa, periodo),
      obterVendedoresAtivos(idEmpresa),
      obterMelhorVendedor(idEmpresa, periodo),
      obterFluxoCaixaConsolidado(idEmpresa, periodo, idFilial),
      obterProdutosEstoqueCritico(idEmpresa), // Nota: Importado de ProdutoLoja
      calcularTrend(idEmpresa, periodo),
      obterVendasPorFilial(idEmpresa, periodo),
      obterContasAPagar(idEmpresa, idFilial)
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
      // Seção exclusiva do Admin: Performance por Loja
      rankingLojas: rankingLojas.map(loja => ({
        nome: loja.nome_filial,
        totalVendas: Number(loja.total_vendas),
        valorTotal: `R$ ${Number(loja.valor_total).toFixed(2).replace('.', ',')}`,
        valorNumerico: Number(loja.valor_total)
      })),
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
        saldoNumerico: Number(fluxoCaixa.saldo),
        // Adicionado visão de contas a pagar (Global)
        contasPendentes: `R$ ${Number(contasPagar.total_pendente).toFixed(2).replace('.', ',')}`,
        contasPendentesNumerico: Number(contasPagar.total_pendente)
      },
      periodo: periodo
    };

    console.log(`Dashboard Admin carregado com sucesso`);

    return res.status(200).json({
      mensagem: "Dashboard Admin carregado com sucesso",
      dashboard
    });

  } catch (err) {
    console.error("Erro ao buscar dashboard Admin:", err);
    return res.status(500).json({
      error: "Erro ao buscar informações do dashboard administrativo",
      detalhes: err.message
    });
  }
};

export { dashboardAdminController };