"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import {
  Loader2,
  Store,
  Calendar,
  Package,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  TrendingDown,
  Filter,
  RefreshCw,
  MapPin,
  CreditCard,
  BarChart3,
} from "lucide-react";

import {
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
  AreaChart,
  Area,
} from "recharts";

export default function RelatorioFilial() {
  const [filiais, setFiliais] = useState([]);
  const [filialId, setFilialId] = useState(null);
  const [loadingFiliais, setLoadingFiliais] = useState(true);
  const [loadingRelatorio, setLoadingRelatorio] = useState(false);
  const [dados, setDados] = useState(null);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const COLORS = [
    "#76196c",
    "#9b2b91",
    "#d695e7",
    "#75ba51",
    "#4f6940",
    "#e8c5f1",
  ];

  const carregarFiliais = async () => {
    try {
      const res = await fetch("http://localhost:8080/admin/meta?filiais=true", {
        credentials: "include",
      });

      const json = await res.json();
      setFiliais(json.filiais || []);
    } catch (e) {
      console.error("Erro ao carregar filiais", e);
    } finally {
      setLoadingFiliais(false);
    }
  };

  const carregarRelatorio = async () => {
    if (!filialId) return;

    setLoadingRelatorio(true);

    const params = new URLSearchParams();
    params.append("id_empresa", filialId);
    if (dataInicio) params.append("dataInicio", dataInicio);
    if (dataFim) params.append("dataFim", dataFim);

    try {
      const res = await fetch(
        `http://localhost:8080/admin/relatorios/filial?${params.toString()}`,
        { credentials: "include" }
      );

      const json = await res.json();
      setDados(json);
    } catch (e) {
      console.error("Erro ao carregar relatório", e);
    } finally {
      setLoadingRelatorio(false);
    }
  };

  useEffect(() => {
    carregarFiliais();
  }, []);

  const setPeriodoRapido = (dias) => {
    const hoje = new Date();
    const fim = hoje.toISOString().split("T")[0];
    const inicio = new Date(hoje.setDate(hoje.getDate() - dias))
      .toISOString()
      .split("T")[0];

    setDataInicio(inicio);
    setDataFim(fim);
  };

  const limparFiltros = () => {
    setDataInicio("");
    setDataFim("");
  };

  const prepararDadosVendasPorDia = () => {
    if (!dados?.vendasPorDia) return [];
    return dados.vendasPorDia.map((item) => ({
      data: new Date(item.dia).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
      vendas: parseInt(item.total_vendas),
      faturamento: parseFloat(item.total),
    }));
  };

  const prepararDadosPagamento = () => {
    if (!dados?.financeiro?.pagamentos) return [];

    const pg = dados.financeiro.pagamentos;

    return [
      { name: "Pix", value: pg.pix || 0 },
      { name: "Cartão", value: pg.cartao || 0 },
      { name: "Dinheiro", value: pg.dinheiro || 0 },
    ];
  };
  const prepararDadosTopProdutos = () => {
    if (!dados?.produtosVendidos) return [];
    return dados.produtosVendidos.slice(0, 8).map((item) => ({
      nome:
        item.nome.length > 12 ? item.nome.substring(0, 12) + "..." : item.nome,
      quantidade: parseInt(item.quantidade_vendida),
      faturamento: parseFloat(item.faturamento_produto),
    }));
  };

  const calcularMargemLucro = () => {
    if (!dados?.financeiro) return 0;

    const { faturamento, totalCusto } = dados.financeiro;
    if (faturamento === 0) return 0;

    return (((faturamento - (totalCusto || 0)) / faturamento) * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen  p-4 sm:p-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Cabeçalho */}
        <div className="bg-white rounded-3xl shadow-xl border-4 border-[#d695e7] p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#76196c] mb-2 flex items-center justify-center gap-3">
              <Store size={36} />
              Relatório da Filial
            </h1>

            <p className="text-neutral-600 text-lg">
              Selecione uma filial e visualize seus indicadores detalhados
            </p>
          </div>

          {/* Filtros */}
          <div className="p-6 rounded-2xl border-2 border-[#e8c5f1] space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="text-[#76196c]" size={20} />
              <h3 className="text-[#76196c] font-bold">
                Selecione a Filial e Período
              </h3>
            </div>

            {loadingFiliais ? (
              <div className="flex justify-center p-4">
                <Loader2 className="animate-spin w-8 h-8 text-[#76196c]" />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Seletor */}
                <div>
                  <label className="block text-[#76196c] font-semibold mb-2">
                    Filial
                  </label>

                  <Select
                    onValueChange={(v) => setFilialId(v)}
                    value={filialId || ""}
                  >
                    <SelectTrigger className="w-full p-3 rounded-xl border-2 border-[#d695e7] focus:ring-2 focus:ring-[#76196c] bg-white">
                      <SelectValue placeholder="Escolha uma filial..." />
                    </SelectTrigger>

                    <SelectContent>
                      {filiais.map((f) => (
                        <SelectItem
                          key={f.id_empresa}
                          value={String(f.id_empresa)}
                        >
                          <div className="flex items-center gap-2">
                            <Store size={16} /> {f.nome}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Rápido */}
                <div>
                  <label className="block text-[#76196c] font-semibold mb-2">
                    Período Rápido
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {[7, 15, 30, 90].map((d) => (
                      <button
                        key={d}
                        onClick={() => setPeriodoRapido(d)}
                        className="px-4 py-2 bg-[#76196c] hover:bg-[#9b2b91] text-white text-sm rounded-xl transition-all"
                      >
                        Últimos {d} dias
                      </button>
                    ))}
                  </div>
                </div>

                {/* Datas custom */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#76196c] font-semibold mb-2 text-sm">
                      Data Início
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 rounded-xl border-2 border-[#d695e7] focus:ring-2 focus:ring-[#76196c]"
                      value={dataInicio}
                      onChange={(e) => setDataInicio(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[#76196c] font-semibold mb-2 text-sm">
                      Data Fim
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 rounded-xl border-2 border-[#d695e7] focus:ring-2 focus:ring-[#76196c]"
                      value={dataFim}
                      onChange={(e) => setDataFim(e.target.value)}
                    />
                  </div>

                  <div className="flex items-end gap-2">
                    <button
                      onClick={carregarRelatorio}
                      disabled={!filialId || loadingRelatorio}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#75ba51] hover:bg-[#5a9940] text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                    >
                      {loadingRelatorio ? (
                        <RefreshCw className="animate-spin" size={18} />
                      ) : (
                        <Filter size={18} />
                      )}
                      Buscar
                    </button>

                    <button
                      onClick={limparFiltros}
                      className="px-4 py-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-bold rounded-xl"
                    >
                      Limpar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Nenhuma filial */}
        {!filialId && !loadingFiliais && (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-[#d695e7] p-12 text-center">
            <Store className="w-24 h-24 text-[#d695e7] mx-auto mb-4" />

            <h3 className="text-2xl font-bold text-[#76196c] mb-2">
              Nenhuma Filial Selecionada
            </h3>

            <p className="text-neutral-500">
              Escolha uma filial acima para visualizar seu relatório completo
            </p>
          </div>
        )}

        {/* Loading relatório */}
        {loadingRelatorio && (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-[#d695e7] p-12 flex flex-col items-center justify-center">
            <RefreshCw className="animate-spin w-16 h-16 text-[#76196c] mb-4" />
            <p className="text-[#76196c] font-medium text-lg">
              Carregando relatório...
            </p>
          </div>
        )}

        {/* Dados */}
        {dados && !loadingRelatorio && filialId && (
          <>
            {/* FILIAL */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-[#d695e7] p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-gradient-to-br from-[#76196c] to-[#9b2b91] rounded-2xl">
                  <Store className="w-8 h-8 text-white" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-[#76196c]">
                    {dados.filial?.nome}
                  </h2>

                  {dados.filial?.endereco && (
                    <p className="text-neutral-500 flex items-center gap-2 mt-1">
                      <MapPin size={16} />
                      {dados.filial.endereco}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Faturamento */}
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
                        {dados.financeiro?.faturamento?.toLocaleString(
                          "pt-BR",
                          {
                            minimumFractionDigits: 2,
                          }
                        ) || "0,00"}
                      </h2>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Total Vendas */}
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
                        {dados.financeiro?.totalVendas || 0}
                      </h2>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ticket médio */}
              <Card className="shadow-lg border-2 border-[#d695e7] bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-2xl">
                      <DollarSign className="w-8 h-8 text-[#76196c]" />
                    </div>

                    <div>
                      <p className="text-sm text-neutral-500 font-medium">
                        Ticket Médio
                      </p>
                      <h2 className="text-2xl font-bold text-[#76196c]">
                        R${" "}
                        {dados.financeiro?.ticketMedio?.toLocaleString(
                          "pt-BR",
                          {
                            minimumFractionDigits: 2,
                          }
                        ) || "0,00"}
                      </h2>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Produtos vendidos */}
              <Card className="shadow-lg border-2 border-[#d695e7] bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-2xl">
                      <Package className="w-8 h-8 text-orange-500" />
                    </div>

                    <div>
                      <p className="text-sm text-neutral-500 font-medium">
                        Produtos Vendidos
                      </p>
                      <h2 className="text-3xl font-bold text-orange-500">
                        {dados.produtosVendidos?.length || 0}
                      </h2>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* KPIs Secundários */}
            {dados.financeiro?.totalCusto !== undefined && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Custo */}
                <Card className="shadow-lg border-2 border-[#d695e7] bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-neutral-500 font-medium">
                          Custo Total
                        </p>
                        <h2 className="text-2xl font-bold text-red-500">
                          R${" "}
                          {dados.financeiro.totalCusto?.toLocaleString(
                            "pt-BR",
                            { minimumFractionDigits: 2 }
                          ) || "0,00"}
                        </h2>
                      </div>

                      <div className="p-3 bg-red-100 rounded-2xl">
                        <TrendingDown className="w-6 h-6 text-red-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lucro */}
                <Card className="shadow-lg border-2 border-[#d695e7] bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-neutral-500 font-medium">
                          Lucro Bruto
                        </p>
                        <h2 className="text-2xl font-bold text-green-600">
                          R${" "}
                          {(
                            (dados.financeiro.faturamento || 0) -
                            (dados.financeiro.totalCusto || 0)
                          ).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </h2>
                      </div>

                      <div className="p-3 bg-green-100 rounded-2xl">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Margem */}
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
                        <BarChart3 className="w-6 h-6 text-[#76196c]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* GRÁFICOS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Linha */}
              {dados.vendasPorDia?.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#d695e7]">
                  <h3 className="text-xl font-bold text-[#76196c] mb-4 flex items-center gap-2">
                    <TrendingUp size={20} />
                    Evolução de Vendas
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

              {/* Pizza */}
              {dados.financeiro?.pagamentos && (
                <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#d695e7]">
                  <h3 className="text-xl font-bold text-[#76196c] mb-4 flex items-center gap-2">
                    <CreditCard size={20} />
                    Vendas por Tipo de Pagamento
                  </h3>

                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={prepararDadosPagamento()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={110}
                        dataKey="value"
                        nameKey="name"
                      >
                        {prepararDadosPagamento().map((entry, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Top produtos */}
              {dados.produtosVendidos?.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#d695e7] lg:col-span-2">
                  <h3 className="text-xl font-bold text-[#76196c] mb-4 flex items-center gap-2">
                    <Package size={20} />
                    Top Produtos Mais Vendidos
                  </h3>

                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={prepararDadosTopProdutos()}
                      layout="vertical"
                    >
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
                        width={110}
                        style={{ fontSize: "12px" }}
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
                        name="Quantidade"
                        radius={[0, 8, 8, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* TABELA - Últimas vendas */}
            {dados.ultimasVendas?.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#d695e7]">
                <h2 className="text-2xl font-bold text-[#76196c] mb-4 flex items-center gap-2">
                  <Calendar className="w-6 h-6" /> Últimas Vendas
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-[#d695e7]">
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
                      {dados.ultimasVendas.map((v) => (
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

            {/* TABELA - Top produtos */}
            {dados.produtosVendidos?.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#d695e7]">
                <h2 className="text-2xl font-bold text-[#76196c] mb-4 flex items-center gap-2">
                  <Package className="w-6 h-6" /> Produtos Mais Vendidos
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-[#d695e7]">
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
                      {dados.produtosVendidos.map((p, index) => (
                        <tr
                          key={index}
                          className="border-b hover:bg-[#fef5ff] transition-colors"
                        >
                          <td className="p-4 font-semibold text-[#76196c]">
                            {index + 1}
                          </td>

                          <td className="p-4 font-medium text-neutral-700">
                            {p.nome}
                          </td>

                          <td className="p-4 font-bold text-blue-600">
                            {p.quantidade_vendida}
                          </td>

                          <td className="p-4 font-bold text-green-600">
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

            {/* TABELA - pagamento */}
            {dados.porTipoPagamento?.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#d695e7]">
                <h2 className="text-2xl font-bold text-[#76196c] mb-4 flex items-center gap-2">
                  <CreditCard className="w-6 h-6" /> Detalhamento por Forma de
                  Pagamento
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-[#d695e7]">
                        <th className="p-4 text-left text-[#76196c] font-bold">
                          Tipo
                        </th>
                        <th className="p-4 text-left text-[#76196c] font-bold">
                          Vendas
                        </th>
                        <th className="p-4 text-left text-[#76196c] font-bold">
                          Faturamento
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {dados.porTipoPagamento.map((t, index) => (
                        <tr
                          key={index}
                          className="border-b hover:bg-[#fef5ff] transition-colors"
                        >
                          <td className="p-4 capitalize font-medium text-neutral-700">
                            {t.tipo_pagamento}
                          </td>

                          <td className="p-4 font-bold text-blue-600">
                            {t.total_vendas}
                          </td>

                          <td className="p-4 font-bold text-green-600">
                            R${" "}
                            {parseFloat(t.faturamento).toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
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
