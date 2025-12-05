"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  BarChart3,
  Store,
  Package,
  DollarSign,
  ShoppingCart,
  Filter,
  RefreshCw,
  AlertTriangle,
  TrendingDown,
  Calendar,
  Receipt,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

export default function RelatorioGeral() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filiais, setFiliais] = useState([]);

  const [filtros, setFiltros] = useState({
    dataInicio: "",
    dataFim: "",
    filialId: "",
  });

  const COLORS = [
    "#76196c",
    "#9b2b91",
    "#d695e7",
    "#75ba51",
    "#4f6940",
    "#e8c5f1",
    "#f5e0f9",
  ];

  const fetchFiliais = async () => {
    try {
      const res = await fetch("http://localhost:8080/admin/meta?filiais=true", {
        credentials: "include",
      });
      const json = await res.json();
      if (res.ok) {
        setFiliais(json.filiais || []);
      }
    } catch (err) {
      console.error("Erro ao buscar filiais:", err);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (filtros.dataInicio) params.append("dataInicio", filtros.dataInicio);
      if (filtros.dataFim) params.append("dataFim", filtros.dataFim);
      if (filtros.filialId) params.append("filialId", filtros.filialId);

      const res = await fetch(
        `http://localhost:8080/admin/relatorios/geral?${params.toString()}`,
        { credentials: "include" }
      );
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiliais();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const aplicarFiltros = () => {
    fetchData();
  };

  const limparFiltros = () => {
    setFiltros({
      dataInicio: "",
      dataFim: "",
      filialId: "",
    });
    setTimeout(() => {
      fetchData();
    }, 100);
  };

  const setPeriodoRapido = (dias) => {
    const hoje = new Date();
    const dataFim = hoje.toISOString().split("T")[0];
    const dataInicio = new Date(hoje.setDate(hoje.getDate() - dias))
      .toISOString()
      .split("T")[0];

    setFiltros({
      dataInicio,
      dataFim,
      filialId: filtros.filialId,
    });

    setTimeout(() => {
      fetchData();
    }, 100);
  };

  // Preparar dados para gráficos
  const prepararDadosVendasPorDia = () => {
    if (!data?.vendasPorDia) return [];
    return data.vendasPorDia.map((item) => ({
      data: new Date(item.dia).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
      vendas: parseInt(item.total_vendas),
      faturamento: parseFloat(item.total),
    }));
  };

  const prepararDadosFiliais = () => {
    if (!data?.rankingFiliais) return [];
    return data.rankingFiliais
      .filter((f) => parseFloat(f.faturamento) > 0)
      .map((item) => ({
        nome:
          item.nome_filial.length > 12
            ? item.nome_filial.substring(0, 12) + "..."
            : item.nome_filial,
        vendas: parseInt(item.total_vendas),
        faturamento: parseFloat(item.faturamento),
      }));
  };

  const prepararDadosTopProdutos = () => {
    if (!data?.topProdutos) return [];
    return data.topProdutos.slice(0, 6).map((item) => ({
      nome:
        item.nome.length > 15 ? item.nome.substring(0, 15) + "..." : item.nome,
      quantidade: parseInt(item.quantidade_vendida),
      faturamento: parseFloat(item.faturamento_produto),
    }));
  };

  const prepararDadosStatusFiliais = () => {
    if (!data?.empresas) return [];
    return [
      {
        name: "Ativas",
        value: parseInt(data.empresas.filiais_ativas),
        color: "#75ba51",
      },
      {
        name: "Inativas",
        value: parseInt(data.empresas.filiais_inativas),
        color: "#d695e7",
      },
    ];
  };

  const calcularMargemLucro = () => {
    if (!data?.financeiro) return 0;
    const { faturamento, totalSaidas } = data.financeiro;
    if (faturamento === 0) return 0;
    return (((faturamento - totalSaidas) / faturamento) * 100).toFixed(1);
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw
            className="animate-spin text-[#76196c] mx-auto mb-4"
            size={48}
          />
          <p className="text-[#76196c] font-medium">
            Carregando relatório geral...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <p className="text-[#76196c] font-medium">
          Erro ao carregar relatório.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 sm:p-10 animate-fadeIn flex flex-col gap-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Cabeçalho */}
        <div className="bg-white rounded-3xl shadow-xl border-4 border-[#d695e7] p-6 flex flex-col gap-4">
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#76196c] mb-2 flex items-center justify-center gap-3">
              <BarChart3 size={36} />
              Relatório Geral
            </h1>
            <p className="text-neutral-600 text-lg">
              Visão completa do desempenho da matriz e filiais
            </p>
            {data?.periodo && (
              <p className="text-sm text-neutral-500 mt-2">
                Período:{" "}
                {new Date(data.periodo.dataInicio).toLocaleDateString("pt-BR")}{" "}
                até {new Date(data.periodo.dataFim).toLocaleDateString("pt-BR")}
              </p>
            )}
          </div>

          {/* Filtros */}
          <div className="bg-gradient-to-r from-[#f8f0fc] to-[#fef5ff] p-6 rounded-2xl border-2 border-[#e8c5f1] space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="text-[#76196c]" size={20} />
              <h3 className="text-[#76196c] font-bold">Filtros</h3>
            </div>

            {/* Botões de período rápido */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setPeriodoRapido(7)}
                className="px-4 py-2 bg-[#76196c] hover:bg-[#9b2b91] text-white text-sm rounded-xl transition-all"
              >
                Últimos 7 dias
              </button>
              <button
                onClick={() => setPeriodoRapido(15)}
                className="px-4 py-2 bg-[#76196c] hover:bg-[#9b2b91] text-white text-sm rounded-xl transition-all"
              >
                Últimos 15 dias
              </button>
              <button
                onClick={() => setPeriodoRapido(30)}
                className="px-4 py-2 bg-[#76196c] hover:bg-[#9b2b91] text-white text-sm rounded-xl transition-all"
              >
                Últimos 30 dias
              </button>
              <button
                onClick={() => setPeriodoRapido(90)}
                className="px-4 py-2 bg-[#76196c] hover:bg-[#9b2b91] text-white text-sm rounded-xl transition-all"
              >
                Últimos 90 dias
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-[#76196c] font-semibold mb-2 text-sm">
                  Data Início
                </label>
                <input
                  type="date"
                  name="dataInicio"
                  value={filtros.dataInicio}
                  onChange={handleFiltroChange}
                  className="w-full p-3 rounded-xl border-2 border-[#d695e7] focus:ring-2 focus:ring-[#76196c] transition-all"
                />
              </div>

              <div>
                <label className="block text-[#76196c] font-semibold mb-2 text-sm">
                  Data Fim
                </label>
                <input
                  type="date"
                  name="dataFim"
                  value={filtros.dataFim}
                  onChange={handleFiltroChange}
                  className="w-full p-3 rounded-xl border-2 border-[#d695e7] focus:ring-2 focus:ring-[#76196c] transition-all"
                />
              </div>

              <div>
                <label className="block text-[#76196c] font-semibold mb-2 text-sm">
                  Filial
                </label>
                <select
                  name="filialId"
                  value={filtros.filialId}
                  onChange={handleFiltroChange}
                  className="w-full p-3 rounded-xl border-2 border-[#d695e7] focus:ring-2 focus:ring-[#76196c] transition-all"
                >
                  <option value="">Todas as Filiais</option>
                  {filiais.map((f) => (
                    <option key={f.id_empresa} value={f.id_empresa}>
                      {f.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end gap-2">
                <button
                  onClick={aplicarFiltros}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#75ba51] hover:bg-[#5a9940] text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="animate-spin" size={18} />
                  ) : (
                    <Filter size={18} />
                  )}
                  Aplicar
                </button>
                <button
                  onClick={limparFiltros}
                  className="px-4 py-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-bold rounded-xl transition-all"
                >
                  Limpar
                </button>
              </div>
            </div>
          </div>

          {/* Top Produtos Detalhado */}
          {data?.topProdutos && data.topProdutos.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#d695e7] space-y-4">
              <h2 className="text-2xl font-bold text-[#76196c] mb-4 flex items-center gap-2">
                <Package className="w-6 h-6" /> Top 10 Produtos Mais Vendidos
              </h2>

              <div className="overflow-x-auto mt-2">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#f8f0fc] to-[#fef5ff] border-b-2 border-[#d695e7]">
                      <th className="p-4 text-left text-[#76196c] font-bold">
                        #
                      </th>
                      <th className="p-4 text-left text-[#76196c] font-bold">
                        Produto
                      </th>
                      <th className="p-4 text-left text-[#76196c] font-bold">
                        Quantidade
                      </th>
                      <th className="p-4 text-left text-[#76196c] font-bold">
                        Faturamento
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topProdutos.map((p, idx) => (
                      <tr
                        key={p.id_produto}
                        className="border-b hover:bg-[#fef5ff] transition-colors"
                      >
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                              idx === 0
                                ? "bg-yellow-400 text-yellow-900"
                                : idx === 1
                                ? "bg-gray-300 text-gray-700"
                                : idx === 2
                                ? "bg-orange-300 text-orange-900"
                                : "bg-[#e8c5f1] text-[#76196c]"
                            }`}
                          >
                            {idx + 1}
                          </span>
                        </td>
                        <td className="p-4 font-semibold">{p.nome}</td>
                        <td className="p-4 font-medium">
                          {p.quantidade_vendida} un.
                        </td>
                        <td className="p-4 text-green-600 font-bold">
                          R${" "}
                          {parseFloat(p.faturamento_produto).toLocaleString(
                            "pt-BR",
                            { minimumFractionDigits: 2 }
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Últimas Vendas */}
          {data?.ultimasVendas && data.ultimasVendas.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#d695e7] space-y-4">
              <h2 className="text-2xl font-bold text-[#76196c] mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6" /> Últimas Vendas
              </h2>

              <div className="overflow-x-auto mt-2">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#f8f0fc] to-[#fef5ff] border-b-2 border-[#d695e7]">
                      <th className="p-4 text-left text-[#76196c] font-bold">
                        ID
                      </th>
                      <th className="p-4 text-left text-[#76196c] font-bold">
                        Valor
                      </th>
                      <th className="p-4 text-left text-[#76196c] font-bold">
                        Pagamento
                      </th>
                      <th className="p-4 text-left text-[#76196c] font-bold">
                        Data
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.ultimasVendas.slice(0, 10).map((v) => (
                      <tr
                        key={v.id_venda}
                        className="border-b hover:bg-[#fef5ff] transition-colors"
                      >
                        <td className="p-4">
                          <span className="font-mono text-sm bg-[#e8c5f1] text-[#76196c] px-3 py-1 rounded-lg">
                            #{v.id_venda}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-green-600">
                          R${" "}
                          {parseFloat(v.total).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="p-4">
                          <span className="capitalize bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                            {v.tipo_pagamento}
                          </span>
                        </td>
                        <td className="p-4 text-neutral-600">
                          {new Date(v.data_venda).toLocaleString("pt-BR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Top Despesas */}
          {data?.topDespesas && data.topDespesas.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#d695e7] space-y-4">
              <h2 className="text-2xl font-bold text-[#76196c] mb-4 flex items-center gap-2">
                <Receipt className="w-6 h-6" /> Maiores Despesas
              </h2>

              <div className="overflow-x-auto mt-2">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#f8f0fc] to-[#fef5ff] border-b-2 border-[#d695e7]">
                      <th className="p-4 text-left text-[#76196c] font-bold">
                        ID
                      </th>
                      <th className="p-4 text-left text-[#76196c] font-bold">
                        Descrição
                      </th>
                      <th className="p-4 text-left text-[#76196c] font-bold">
                        Valor
                      </th>
                      <th className="p-4 text-left text-[#76196c] font-bold">
                        Data
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topDespesas.map((d) => (
                      <tr
                        key={d.id_despesa}
                        className="border-b hover:bg-[#fef5ff] transition-colors"
                      >
                        <td className="p-4">
                          <span className="font-mono text-sm bg-[#e8c5f1] text-[#76196c] px-3 py-1 rounded-lg">
                            #{d.id_despesa}
                          </span>
                        </td>
                        <td
                          className="p-4 text-sm max-w-md truncate"
                          title={d.descricao}
                        >
                          {d.descricao}
                        </td>
                        <td className="p-4 font-bold text-red-600">
                          R${" "}
                          {parseFloat(d.preco).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="p-4 text-neutral-600">
                          {new Date(d.data_pag).toLocaleDateString("pt-BR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* KPIs Principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-lg border-2 border-[#d695e7] bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-2xl">
                    <Store className="w-8 h-8 text-[#76196c]" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 font-medium">
                      Total de Filiais
                    </p>
                    <h2 className="text-3xl font-bold text-[#76196c]">
                      {data?.empresas?.total_filiais || 0}
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      {data?.empresas?.filiais_ativas} ativas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-[#d695e7] bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-2xl">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 font-medium">
                      Faturamento
                    </p>
                    <h2 className="text-2xl font-bold text-green-600">
                      R${" "}
                      {data?.financeiro?.faturamento?.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      }) || "0,00"}
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      Lucro: R${" "}
                      {data?.financeiro?.lucroGeral?.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-[#d695e7] bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-2xl">
                    <ShoppingCart className="w-8 h-8 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 font-medium">
                      Total de Vendas
                    </p>
                    <h2 className="text-3xl font-bold text-blue-600">
                      {data?.financeiro?.totalVendas || 0}
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      Ticket: R${" "}
                      {data?.financeiro?.ticketMedio?.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-[#d695e7] bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-2xl">
                    <Package className="w-8 h-8 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 font-medium">
                      Produtos
                    </p>
                    <h2 className="text-3xl font-bold text-orange-500">
                      {data?.estoque?.total_produtos || 0}
                    </h2>
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      {data?.estoque?.ruptura} em ruptura
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* KPIs Secundários */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-lg border-2 border-[#d695e7] bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500 font-medium">
                      Saídas/Despesas
                    </p>
                    <h2 className="text-2xl font-bold text-red-500">
                      R${" "}
                      {data?.financeiro?.totalSaidas?.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      }) || "0,00"}
                    </h2>
                  </div>
                  <div className="p-3 bg-red-100 rounded-2xl">
                    <TrendingDown className="w-6 h-6 text-red-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-[#d695e7] bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500 font-medium">
                      Margem de Lucro
                    </p>
                    <h2 className="text-2xl font-bold text-[#76196c]">
                      {calcularMargemLucro()}%
                    </h2>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-2xl">
                    <DollarSign className="w-6 h-6 text-[#76196c]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-[#d695e7] bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500 font-medium">
                      Produtos Baixos
                    </p>
                    <h2 className="text-2xl font-bold text-orange-500">
                      {data?.estoque?.produtos_baixos || 0}
                    </h2>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-2xl">
                    <AlertTriangle className="w-6 h-6 text-orange-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Evolução de Vendas */}
            {data?.vendasPorDia && data.vendasPorDia.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#d695e7] space-y-4">
                <h3 className="text-xl font-bold text-[#76196c] mb-4 flex items-center gap-2">
                  <TrendingUp size={20} />
                  Evolução de Vendas e Faturamento
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={prepararDadosVendasPorDia()}>
                    <defs>
                      <linearGradient
                        id="colorVendas"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#76196c"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#76196c"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorFaturamento"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#75ba51"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#75ba51"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8c5f1" />
                    <XAxis
                      dataKey="data"
                      stroke="#76196c"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis stroke="#76196c" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "2px solid #d695e7",
                        borderRadius: "12px",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="vendas"
                      stroke="#76196c"
                      fillOpacity={1}
                      fill="url(#colorVendas)"
                      name="Qtd. Vendas"
                    />
                    <Area
                      type="monotone"
                      dataKey="faturamento"
                      stroke="#75ba51"
                      fillOpacity={1}
                      fill="url(#colorFaturamento)"
                      name="Faturamento (R$)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Status das Filiais */}
            {data?.empresas && (
              <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#d695e7] space-y-4">
                <h3 className="text-xl font-bold text-[#76196c] mb-4 flex items-center gap-2">
                  <Store size={20} />
                  Status das Filiais
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={prepararDadosStatusFiliais()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {prepararDadosStatusFiliais().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "2px solid #d695e7",
                        borderRadius: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Faturamento por Filial */}
            {data?.rankingFiliais && prepararDadosFiliais().length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#d695e7] lg:col-span-2 space-y-4">
                <h3 className="text-xl font-bold text-[#76196c] mb-4 flex items-center gap-2">
                  <Store size={20} />
                  Faturamento por Filial
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={prepararDadosFiliais()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8c5f1" />
                    <XAxis
                      dataKey="nome"
                      stroke="#76196c"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis stroke="#76196c" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "2px solid #d695e7",
                        borderRadius: "12px",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="vendas"
                      fill="#76196c"
                      name="Qtd. Vendas"
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      dataKey="faturamento"
                      fill="#75ba51"
                      name="Faturamento (R$)"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Top Produtos */}
            {data?.topProdutos && data.topProdutos.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#d695e7] lg:col-span-2 space-y-4">
                <h3 className="text-xl font-bold text-[#76196c] mb-4 flex items-center gap-2">
                  <Package size={20} />
                  Top 6 Produtos Mais Vendidos
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={prepararDadosTopProdutos()} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8c5f1" />
                    <XAxis
                      type="number"
                      stroke="#76196c"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      dataKey="nome"
                      type="category"
                      stroke="#76196c"
                      style={{ fontSize: "12px" }}
                      width={120}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "2px solid #d695e7",
                        borderRadius: "12px",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="quantidade"
                      fill="#76196c"
                      name="Quantidade Vendida"
                      radius={[0, 8, 8, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Tabelas */}

          {/* Ranking de Filiais */}
          {data?.rankingFiliais && data.rankingFiliais.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#d695e7] space-y-4">
              <h2 className="text-2xl font-bold text-[#76196c] mb-4 flex items-center gap-2">
                <Store className="w-6 h-6" /> Ranking de Filiais
              </h2>

              <div className="overflow-x-auto mt-2">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#f8f0fc] to-[#fef5ff] border-b-2 border-[#d695e7]">
                      <th className="p-4 text-left text-[#76196c] font-bold">
                        #
                      </th>
                      <th className="p-4 text-left text-[#76196c] font-bold">
                        Filial
                      </th>
                      <th className="p-4 text-left text-[#76196c] font-bold">
                        Vendas
                      </th>
                      <th className="p-4 text-left text-[#76196c] font-bold">
                        Faturamento
                      </th>
                      <th className="p-4 text-left text-[#76196c] font-bold">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.rankingFiliais.map((f, idx) => (
                      <tr
                        key={f.id_empresa}
                        className="border-b hover:bg-[#fef5ff] transition-colors"
                      >
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                              idx === 0
                                ? "bg-yellow-400 text-yellow-900"
                                : idx === 1
                                ? "bg-gray-300 text-gray-700"
                                : idx === 2
                                ? "bg-orange-300 text-orange-900"
                                : "bg-[#e8c5f1] text-[#76196c]"
                            }`}
                          >
                            {idx + 1}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-[#76196c]">
                          {f.nome_filial}
                        </td>
                        <td className="p-4 font-medium">{f.total_vendas}</td>
                        <td className="p-4 text-green-600 font-bold">
                          R${" "}
                          {parseFloat(f.faturamento).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-lg text-sm font-medium ${
                              parseFloat(f.faturamento) > 0
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {parseFloat(f.faturamento) > 0
                              ? "Ativa"
                              : "Parada"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Últimas Despesas */}
          {data?.ultimasDespesas && data.ultimasDespesas.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#d695e7] space-y-4">
              <h2 className="text-2xl font-bold text-[#76196c] mb-4 flex items-center gap-2">
                <Receipt className="w-6 h-6" /> Últimas Despesas Registradas
              </h2>

              <div className="overflow-x-auto mt-2">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#f8f0fc] to-[#fef5ff] border-b-2 border-[#d695e7]">
                      <th className="p-4 text-left text-[#76196c] font-bold">
                        ID
                      </th>
                      <th className="p-4 text-left text-[#76196c] font-bold">
                        Descrição
                      </th>
                      <th className="p-4 text-left text-[#76196c] font-bold">
                        Valor
                      </th>
                      <th className="p-4 text-left text-[#76196c] font-bold">
                        Data
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.ultimasDespesas.slice(0, 15).map((d) => (
                      <tr
                        key={d.id_despesa}
                        className="border-b hover:bg-[#fef5ff] transition-colors"
                      >
                        <td className="p-4">
                          <span className="font-mono text-sm bg-[#e8c5f1] text-[#76196c] px-3 py-1 rounded-lg">
                            #{d.id_despesa}
                          </span>
                        </td>
                        <td
                          className="p-4 text-sm max-w-md truncate"
                          title={d.descricao}
                        >
                          {d.descricao}
                        </td>
                        <td className="p-4 font-bold text-red-600">
                          R${" "}
                          {parseFloat(d.preco).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="p-4 text-neutral-600">
                          {d.data_pag
                            ? new Date(d.data_pag).toLocaleDateString("pt-BR")
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
