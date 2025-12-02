import { AdminDashboardModel } from "../models/DashboardAdmin.js";
import { mascaraDinheiro } from "../utils/formatadorNumero.js";

const formatarMoeda = mascaraDinheiro;

const AdminDashboardController = async (req, res) => {
  try {
    const periodo = req.query.periodo || "mes";

    // Buscar todos os dados em paralelo para melhor performance
    const [
      vendas,
      rankingLojas,
      melhorVendedor,
      vendedoresAtivos,
      produtosVendidos,
      produtosBaixoEstoque,
      fluxoCaixa,
    ] = await Promise.all([
      AdminDashboardModel.getVendasConsolidadas(periodo),
      AdminDashboardModel.getRankingLojas(periodo),
      AdminDashboardModel.getMelhorVendedor(periodo),
      AdminDashboardModel.getVendedoresAtivos(),
      AdminDashboardModel.getProdutosVendidos(periodo),
      AdminDashboardModel.getProdutosBaixoEstoque(),
      AdminDashboardModel.getFluxoCaixaConsolidado(periodo),
    ]);

    // Montar resposta no formato esperado pelo front
    const dashboard = {
      vendas: {
        total: formatarMoeda(parseFloat(vendas.total_faturamento)),
        totalTransacoes: vendas.total_transacoes,
        trend: null, // Você pode calcular a tendência comparando com período anterior
      },
      fluxoCaixa: {
        entradas: fluxoCaixa.entradas,
        saidas: fluxoCaixa.saidas,
        saldo: fluxoCaixa.saldo,
        contasPendentes: fluxoCaixa.contasPendentes,
      },
      produtos: {
        vendidos: produtosVendidos,
        baixoEstoque: produtosBaixoEstoque,
      },
      vendedores: {
        ativos: vendedoresAtivos,
        melhorVendedor: melhorVendedor.nome,
        vendasMelhorVendedor: melhorVendedor.total_vendas,
        valorMelhorVendedor: parseFloat(melhorVendedor.valor_total),
      },
      rankingLojas: rankingLojas,
    };

    return res.status(200).json({
      mensagem: "Dashboard carregado com sucesso",
      dashboard,
    });
  } catch (error) {
    console.error("[ADMIN DASHBOARD] Erro ao buscar dados:", error);
    return res.status(500).json({
      mensagem: "Erro ao carregar dashboard",
      erro: error.message,
    });
  }
};

export { AdminDashboardController };
