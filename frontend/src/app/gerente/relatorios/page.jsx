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

import { SidebarTrigger } from "@/components/ui/sidebar";


const TIKI = {
  roxoEscuro: "#76196c",
  roxoMedio: "#924187",
  roxoClaro: "#d695e7",
  rosaTikitos: "#e8c5f1",
  verdeTikitos: "#75ba51",
  verdeClaro: "#9bf377",
  verdao: "#92EF6C",
};

export default function AdminRelatorios() {
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
    console.debug("[ADMIN RELATORIOS] buscarRelatorio chamado", { filtros });
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
      console.log(data);
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

  // Totais fornecidos pelo backend (fallback para cálculo local se não existir)
  const totais = dados?.totais
    ? {
        vendas: Number(dados.totais.totalVendas) || 0,
        faturamento: Number(dados.totais.totalFaturamento) || 0,
        ticket:
          (Number(dados.totais.totalVendas) || 0) > 0
            ? Number(dados.totais.totalFaturamento) /
              Number(dados.totais.totalVendas)
            : 0,
      }
    : {
        vendas:
          dados?.resumo?.reduce(
            (acc, dia) => acc + Number(dia.total_vendas || 0),
            0
          ) || 0,
        faturamento:
          dados?.resumo?.reduce(
            (acc, dia) => acc + Number(dia.saldo_total || 0),
            0
          ) || 0,
        ticket: 0,
      };

  const totalGastos = dados?.totais
    ? Number(dados.totais.totalGastos) || 0
    : dados?.gastos?.reduce((acc, g) => acc + (Number(g.preco) || 0), 0) || 0;

  const saldoLiquido = dados?.totais
    ? Number(dados.totais.saldoLiquido) || totais.faturamento - totalGastos
    : totais.faturamento - totalGastos;

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

  const formatCurrency = (value) => {
    const num = Number(value) || 0;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num);
  };

  useEffect(() => {
    console.log(dados);
  }, [dados]);

  const cardStyle = "bg-white border-2 border-dashed rounded-2xl p-6 shadow-sm";

  return (
    <>

    <div className="flex m-5 gap-2 items-center">
        <SidebarTrigger />
      </div>

    <div className="min-h-screen p-6">
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
        <div className=" mb-6 bg-[#C97FDA] border-3 border-[#76196C] border-dashed rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
        
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="text-sm font-medium text-[#76196C]">
              {mostrarFiltros ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          {mostrarFiltros && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* DATA INÍCIO */}
              <div>
                <label className="block text-sm font-medium mb-1 text-[#76196C]">
                  Data Início
                </label>
                <input
                  type="date"
                  value={filtros.inicio}
                  onChange={(e) =>
                    setFiltros({ ...filtros, inicio: e.target.value })
                  }
                  className="w-full bg-[#E5B8F1] active:border-[#76196C] px-3 py-2 rounded-xl border border-[#76196C] text-[#76196C]"
                />
              </div>

              {/* DATA FIM */}
              <div>
                <label className="block text-sm font-medium mb-1 text-[#76196C]">
                  Data Fim
                </label>
                <input
                  type="date"
                  value={filtros.fim}
                  onChange={(e) =>
                    setFiltros({ ...filtros, fim: e.target.value })
                  }
                  className="w-full bg-[#E5B8F1] px-3 py-2 rounded-xl border border-[#76196C] text-[#76196C]"
                />
              </div>

              {/* ID CAIXA */}
              <div>
                <label className="block text-sm font-medium mb-1 text-[#76196C] ">
                  ID Caixa
                </label>
                <input
                  type="number"
                  value={filtros.idCaixa}
                  onChange={(e) =>
                    setFiltros({ ...filtros, idCaixa: e.target.value })
                  }
                  className="w-full bg-[#E5B8F1] px-3 py-2 rounded-xl border border-[#76196C] text-[#76196C]"
                />
              </div>

              {/* PAGAMENTO */}
              <div>
                <label className="block text-sm font-medium mb-1 text-[#76196C] ">
                  Tipo Pagamento
                </label>
                <select
                  value={filtros.pagamento}
                  onChange={(e) =>
                    setFiltros({ ...filtros, pagamento: e.target.value })
                  }
                  className="w-full bg-[#E5B8F1] px-3 py-2 rounded-xl border border-[#76196C] text-[#76196C]"
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
                  className="w-full py-3 font-semibold text-roxo rounded-xl transition cursor-pointer bg-[#C5FFAD] border-2 border-roxo hover:bg-verdefundo"
                >
                  {loading ? "Carregando..." : "Gerar"}
                </button>
              </div>
            </div>
          )}

          {/* Checkbox detalhado */}
          <label className="flex items-center text-[#76196C] gap-2 mt-4 cursor-pointer">
            <input
              type="checkbox"
              checked={filtros.detalhado}
              onChange={(e) =>
                setFiltros({ ...filtros, detalhado: e.target.checked })
              }
              className="w-4 h-4 "
            />
            Incluir vendas detalhadas
          </label>
        </div>

        {/* SEÇÃO SEM RELATÓRIO */}
        {!dados && !loading && (
          <div className="bg-[#92EF6C] rounded-2xl p-6 shadow-sm text-center py-12">
            <Calendar className="mx-auto w-16 h-16 text-[#76216D]" />
            <h3
              className="text-xl font-semibold mt-4"
              style={{ color: TIKI.roxoEscuro }}
            >
              Nenhum relatório gerado
            </h3>
            <p className="text-[#8F3D84]">
              Configure os filtros e gere um relatório.
            </p>
          </div>
        )}

        {/* CONTEÚDO DO RELATÓRIO */}
        {dados && (
          <>
            {/* CARDS RESUMO */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">

              <div className="bg-[#B478AB] rounded-2xl p-6 shadow-sm">
                <p className="text-sm text-[#EBC7F5]">Total de Vendas</p>
                <h2 className="text-3xl font-bold text-[#EBC7F5]">{totais.vendas}</h2>
              </div>

              <div className="bg-[#9BF377] rounded-2xl p-6 shadow-sm">
                <p className="text-sm text-[#4EA912]">Faturamento</p>
                <h2 className="text-3xl font-bold text-[#4EA912]">
                  {formatCurrency(totais.faturamento)}
                </h2>
              </div>

              <div className="bg-[#76226D] rounded-2xl p-6 shadow-sm">
                <p className="text-sm text-[#D594E6]">Ticket Médio</p>
                <h2 className="text-3xl font-bold text-[#D594E6]">
                  {formatCurrency(totais.ticket)}
                </h2>
              </div>

              <div className="bg-[#559637] rounded-2xl p-6 shadow-sm">
                <p className="text-sm text-[#92EF6C]">Saldo Líquido</p>
                <h2
                  className="text-3xl font-bold"
                  style={{
                    color: saldoLiquido >= 0 ? TIKI.verdao : "red",
                  }}
                >
                  {formatCurrency(saldoLiquido)}
                </h2>
              </div>
            </div>

            {/* GRÁFICOS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-[#C5FFAD] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-3 text-[#559637]">
                  Faturamento Diário
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={prepararDadosGrafico()} >
                    <CartesianGrid strokeDasharray="3 3"  />
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

              <div className="bg-[#EBC7F5]/70 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-3 text-[#924187]">
                  Quantidade de Vendas
                </h3>
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

            {/* VENDAS DETALHADAS (aparece quando 'detalhado' está marcado) */}
            {filtros.detalhado && dados.vendas && dados.vendas.length > 0 && (
              <div className={cardStyle}>
                <h3 className="text-lg font-semibold mb-4">Vendas Detalhadas</h3>
                <div className="overflow-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="p-3">ID</th>
                        <th className="p-3">Data</th>
                        <th className="p-3">Usuário</th>
                        <th className="p-3">Pagamento</th>
                        <th className="p-3">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dados.vendas.map((v) => (
                        <tr key={v.id_venda} className="border-b">
                          <td className="p-3">{v.id_venda}</td>
                          <td className="p-3">
                            {new Date(v.data_venda).toLocaleString("pt-BR")}
                          </td>
                          <td className="p-3">{v.nome_usuario}</td>
                          <td className="p-3">{v.tipo_pagamento}</td>
                          <td className="p-3 font-semibold">
                            {formatCurrency(Number(v.total))}
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
    </>
  );
}
