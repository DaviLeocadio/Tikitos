"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  Calendar,
  DollarSign,
  TrendingUp,
  Filter,
  FileText,
} from "lucide-react";

const TIKI = {
  roxoEscuro: "#76196c",
  roxoMedio: "#924187",
  roxoClaro: "#d695e7",
  rosaTikitos: "#e8c5f1",
  verdeTikitos: "#75ba51",
  verdeClaro: "#9bf377",
};

export default function RelatorioGerente() {
  const [filtros, setFiltros] = useState({
    inicio: "",
    fim: "",
    idCaixa: "",
    pagamento: "",
    detalhado: false,
  });

  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(true);

  const tiposPagamento = [
    { value: "", label: "Todos" },
    { value: "pix", label: "PIX" },
    { value: "dinheiro", label: "Dinheiro" },
    { value: "cartao", label: "Cartão" },
  ];

  const buscarRelatorio = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtros.inicio) params.append("inicio", filtros.inicio);
      if (filtros.fim) params.append("fim", filtros.fim);
      if (filtros.idCaixa) params.append("idCaixa", filtros.idCaixa);
      if (filtros.pagamento) params.append("pagamento", filtros.pagamento);
      if (filtros.detalhado) params.append("detalhado", "true");

      const response = await fetch(
        `http://localhost:8080/gerente/relatorio?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();
      setDados(data.retorno);
    } catch (error) {
      console.error("Erro ao buscar relatório:", error);
    } finally {
      setLoading(false);
    }
  };

  // Datas iniciais (últimos 7 dias)
  useEffect(() => {
    const hoje = new Date();
    const seteDiasAtras = new Date(hoje);
    seteDiasAtras.setDate(hoje.getDate() - 7);

    setFiltros((prev) => ({
      ...prev,
      inicio: seteDiasAtras.toISOString().split("T")[0],
      fim: hoje.toISOString().split("T")[0],
    }));
  }, []);

  // Cálculos
  const calcularTotais = () => {
    if (!dados?.resumo) return { vendas: 0, faturamento: 0, ticket: 0 };

    const vendas = dados.resumo.reduce(
      (acc, dia) => acc + Number(dia.total_vendas),
      0
    );
    const faturamento = dados.resumo.reduce(
      (acc, dia) => acc + Number(dia.saldo_total),
      0
    );

    return {
      vendas,
      faturamento,
      ticket: vendas > 0 ? faturamento / vendas : 0,
    };
  };

  const totais = calcularTotais();

  const totalGastos =
    dados?.gastos?.reduce((acc, g) => acc + Number(g.valor), 0) || 0;

  const saldoLiquido = totais.faturamento - totalGastos;

  const prepararDadosGrafico = () => {
    if (!dados?.resumo) return [];
    return dados.resumo.map((dia) => ({
      data: new Date(dia.data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
      vendas: Number(dia.total_vendas),
      faturamento: Number(dia.saldo_total),
    }));
  };

  const cardStyle =
    "bg-white border-2 border-dashed rounded-2xl p-6 shadow-sm";

  return (
    <div
      className="min-h-screen p-6 bg-gradient-to-r from-[#DDF1D4] to-verdeclaro"
     
    >
      <div className="max-w-7xl mx-auto">
        {/* TITULO */}
        <div className="mb-6">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ color: TIKI.roxoEscuro }}
          >
            Relatório Financeiro — Tikitos
          </h1>
          <p className="text-gray-700 text-lg">
            Pequenos momentos, grandes resultados 🌟
          </p>
        </div>

        {/* FILTROS */}
        <div className={`${cardStyle} mb-6`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Filter color={TIKI.roxoMedio} />
              Filtros
            </h2>

            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="text-sm font-medium"
              style={{ color: TIKI.roxoMedio }}
            >
              {mostrarFiltros ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          {mostrarFiltros && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* DATA INÍCIO */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Data Início
                </label>
                <input
                  type="date"
                  value={filtros.inicio}
                  onChange={(e) =>
                    setFiltros({ ...filtros, inicio: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-dashed border-gray-300"
                />
              </div>

              {/* DATA FIM */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Data Fim
                </label>
                <input
                  type="date"
                  value={filtros.fim}
                  onChange={(e) =>
                    setFiltros({ ...filtros, fim: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-dashed border-gray-300"
                />
              </div>

              {/* ID CAIXA */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  ID Caixa
                </label>
                <input
                  type="number"
                  value={filtros.idCaixa}
                  onChange={(e) =>
                    setFiltros({ ...filtros, idCaixa: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-dashed border-gray-300"
                />
              </div>

              {/* PAGAMENTO */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tipo Pagamento
                </label>
                <select
                  value={filtros.pagamento}
                  onChange={(e) =>
                    setFiltros({ ...filtros, pagamento: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-dashed border-gray-300"
                >
                  {tiposPagamento.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* BOTÃO GERAR */}
              <div className="flex items-end">
                <button
                  onClick={buscarRelatorio}
                  disabled={loading}
                  className="w-full py-3 font-semibold text-roxo rounded-xl transition cursor-pointer bg-verdeclaro border-3 border-dashed border-roxo hover:bg-verdefundo"
              
                >
                  {loading ? "Carregando..." : "Gerar"}
                </button>
              </div>
            </div>
          )}

          {/* Checkbox detalhado */}
          <label className="flex items-center gap-2 mt-4 cursor-pointer">
            <input
              type="checkbox"
              checked={filtros.detalhado}
              onChange={(e) =>
                setFiltros({ ...filtros, detalhado: e.target.checked })
              }
              className="w-4 h-4"
            />
            Incluir vendas detalhadas
          </label>
        </div>

        {/* SEÇÃO SEM RELATÓRIO */}
        {!dados && !loading && (
          <div className={`${cardStyle} text-center py-12`}>
            <Calendar className="mx-auto w-16 h-16 text-gray-300" />
            <h3 className="text-xl font-semibold mt-4" style={{ color: TIKI.roxoEscuro }}>
              Nenhum relatório gerado
            </h3>
            <p className="text-gray-600">Configure os filtros e gere um relatório.</p>
          </div>
        )}

        {/* CONTEÚDO DO RELATÓRIO */}
        {dados && (
          <>
            {/* CARDS RESUMO */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              <div className={cardStyle}>
                <p className="text-sm text-gray-700">Total de Vendas</p>
                <h2 className="text-3xl font-bold">{totais.vendas}</h2>
              </div>

              <div className={cardStyle}>
                <p className="text-sm text-gray-700">Faturamento</p>
                <h2 className="text-3xl font-bold text-green-700">
                  R$ {totais.faturamento.toFixed(2)}
                </h2>
              </div>

              <div className={cardStyle}>
                <p className="text-sm text-gray-700">Ticket Médio</p>
                <h2 className="text-3xl font-bold">
                  R$ {totais.ticket.toFixed(2)}
                </h2>
              </div>

              <div className={cardStyle}>
                <p className="text-sm text-gray-700">Saldo Líquido</p>
                <h2
                  className="text-3xl font-bold"
                  style={{
                    color: saldoLiquido >= 0 ? TIKI.verdeTikitos : "red",
                  }}
                >
                  R$ {saldoLiquido.toFixed(2)}
                </h2>
              </div>
            </div>

            {/* GRÁFICOS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className={cardStyle}>
                <h3 className="text-lg font-semibold mb-3">Faturamento Diário</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={prepararDadosGrafico()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="faturamento"
                      stroke={TIKI.roxoMedio}
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className={cardStyle}>
                <h3 className="text-lg font-semibold mb-3">Quantidade de Vendas</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={prepararDadosGrafico()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="vendas"
                      fill={TIKI.verdeTikitos}
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* DESPESAS */}
            {dados.gastos && dados.gastos.length > 0 && (
              <div className={cardStyle}>
                <h3 className="text-lg font-semibold mb-4">Despesas</h3>
                <div className="overflow-auto">
                  <table className="w-full">
                    <tbody>
                      {dados.gastos.map((g) => (
                        <tr key={g.id_despesa} className="border-b">
                          <td className="p-3">{g.descricao}</td>
                          <td className="p-3">
                            {new Date(g.data_adicionado).toLocaleDateString("pt-BR")}
                          </td>
                          <td className="p-3 text-red-600">
                            R$ {Number(g.preco).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
