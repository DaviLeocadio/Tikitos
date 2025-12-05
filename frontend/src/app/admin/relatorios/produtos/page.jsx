"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Package,
  Filter,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Store,
  BarChart3,
  Calendar,
  DollarSign,
  Boxes
} from "lucide-react";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from "@/components/ui/select";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from "recharts";


export default function RelatorioProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [produtoId, setProdutoId] = useState(null);
  const [dados, setDados] = useState(null);
  const [loadingProdutos, setLoadingProdutos] = useState(true);
  const [loadingRelatorio, setLoadingRelatorio] = useState(false);

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const COLORS = ['#76196c', '#9b2b91', '#d695e7', '#75ba51', '#4f6940', '#e8c5f1'];

  // Carregar lista de produtos
  const carregarProdutos = async () => {
    try {
      // Solicita categorias e produtos num único endpoint
      const res = await fetch("http://localhost:8080/admin/meta?categorias=true&produtos=true", {
        credentials: "include",
      });
      const json = await res.json();
      setCategorias(json.categorias || []);
      setProdutos(json.produtos || []);
    } catch (e) {
      console.error("Erro ao carregar produtos", e);
    } finally {
      setLoadingProdutos(false);
    }
  };

  // Buscar relatório
  const carregarRelatorio = async () => {
    if (!produtoId) return;

    setLoadingRelatorio(true);

    const params = new URLSearchParams();
    params.append("id_produto", produtoId);
    if (dataInicio) params.append("dataInicio", dataInicio);
    if (dataFim) params.append("dataFim", dataFim);

    try {
      const res = await fetch(`http://localhost:8080/admin/relatorios/produtos?${params}`, {
        credentials: "include",
      });

      const json = await res.json();
      setDados(json);
    } catch (e) {
      console.error("Erro ao carregar relatório", e);
    } finally {
      setLoadingRelatorio(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
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

  // Preparar gráficos
  const prepararVendasDia = () => {
    if (!dados?.vendasPorDia) return [];
    return dados.vendasPorDia.map(i => ({
      data: new Date(i.dia).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      quantidade: parseInt(i.total_vendido),
      faturamento: parseFloat(i.total_faturado)
    }));
  };

  const prepararFiliais = () => {
    if (!dados?.topFiliais) return [];
    return dados.topFiliais.map(i => ({
      nome: i.nome,
      vendas: parseInt(i.total_vendas),
      faturamento: parseFloat(i.total_faturado)
    }));
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Cabeçalho */}
        <div className="bg-white rounded-3xl shadow-xl border-4 border-[#d695e7] p-6">
          <h1 className="text-3xl font-extrabold text-[#76196c] flex items-center gap-3 mb-2">
            <Package size={34} />
            Relatório de Produtos
          </h1>
          <p className="text-neutral-600 text-lg">Analise o desempenho de um produto específico</p>
        </div>

        {/* Seleção + filtros */}
        <div className="bg-white rounded-3xl shadow-xl border-4 border-[#e8c5f1] p-6">

          {/* Produto */}
          <label className="block text-[#76196c] font-semibold mb-2">Produto:</label>

          {loadingProdutos ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin text-[#76196c]" size={34} />
            </div>
          ) : (
            <Select onValueChange={(v) => setProdutoId(v)} value={produtoId || ""}>
              <SelectTrigger className="w-full border-2 border-[#d695e7] p-3 rounded-xl bg-white text-lg">
                <SelectValue placeholder="Selecione um produto..." />
              </SelectTrigger>

              <SelectContent>
                {produtos.map((p) => (
                  <SelectItem key={p.id_produto} value={String(p.id_produto)}>
                    {p.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Períodos */}
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

            <div>
              <label className="text-[#76196c] font-semibold text-sm">Data Início</label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full border-2 border-[#d695e7] p-3 rounded-xl"
              />
            </div>

            <div>
              <label className="text-[#76196c] font-semibold text-sm">Data Fim</label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full border-2 border-[#d695e7] p-3 rounded-xl"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={carregarRelatorio}
                disabled={!produtoId}
                className="flex-1 bg-[#75ba51] hover:bg-[#5a9940] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
              >
                {loadingRelatorio ? <RefreshCw className="animate-spin" /> : <Filter />}
                Buscar
              </button>

              <button
                onClick={limparFiltros}
                className="px-4 py-3 bg-neutral-200 hover:bg-neutral-300 rounded-xl font-bold"
              >
                Limpar
              </button>
            </div>
          </div>

          {/* Botões rápido */}
          <div className="mt-4 flex flex-wrap gap-2">
            {[7, 15, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setPeriodoRapido(d)}
                className="px-4 py-2 rounded-xl bg-[#76196c] hover:bg-[#9b2b91] text-white"
              >
                Últimos {d} dias
              </button>
            ))}
          </div>
        </div>

        {/* Sem produto */}
        {!produtoId && (
          <div className="bg-white rounded-2xl shadow-lg p-12 border-2 border-[#d695e7] text-center">
            <Package className="w-20 h-20 text-[#d695e7] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#76196c]">Selecione um produto</h2>
            <p className="text-neutral-600">Escolha um produto para visualizar o relatório completo</p>
          </div>
        )}

        {/* Carregando */}
        {loadingRelatorio && (
          <div className="bg-white rounded-2xl shadow-lg p-12 border-2 border-[#d695e7] flex justify-center">
            <RefreshCw className="animate-spin w-14 h-14 text-[#76196c]" />
          </div>
        )}

        {/* Conteúdo */}
        {dados && !loadingRelatorio && produtoId && (
          <div className="space-y-10">

            {/* KPIs */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

              <Card className="border-2 border-[#d695e7]">
                <CardContent className="p-6 flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <TrendingUp className="text-green-600" size={26} />
                  </div>
                  <div>
                    <p className="text-neutral-600 text-sm">Faturamento</p>
                    <h3 className="font-bold text-2xl text-green-600">
                      R$ {dados.financeiro?.faturamento.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </h3>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#d695e7]">
                <CardContent className="p-6 flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Boxes className="text-blue-600" size={26} />
                  </div>
                  <div>
                    <p className="text-neutral-600 text-sm">Quantidade vendida</p>
                    <h3 className="font-bold text-3xl text-blue-600">{dados.financeiro?.totalVendido}</h3>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#d695e7]">
                <CardContent className="p-6 flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <DollarSign className="text-[#76196c]" size={26} />
                  </div>
                  <div>
                    <p className="text-neutral-600 text-sm">Ticket médio</p>
                    <h3 className="font-bold text-2xl text-[#76196c]">
                      R$ {dados.financeiro?.ticketMedio.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </h3>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#d695e7]">
                <CardContent className="p-6 flex items-center gap-3">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Store className="text-orange-600" size={26} />
                  </div>
                  <div>
                    <p className="text-neutral-600 text-sm">Filiais com venda</p>
                    <h3 className="font-bold text-3xl text-orange-600">{dados.topFiliais?.length}</h3>
                  </div>
                </CardContent>
              </Card>

            </div>


            {/* Gráficos */}
            <div className="grid lg:grid-cols-2 gap-6">

              {/* Vendas por dia */}
              <div className="bg-white rounded-2xl p-6 border-2 border-[#d695e7]">
                <h2 className="text-xl font-bold text-[#76196c] mb-3 flex items-center gap-2">
                  <Calendar size={20} /> Evolução de vendas
                </h2>

                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={prepararVendasDia()}>
                    <defs>
                      <linearGradient id="prodQtd" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#76196c" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#76196c" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8c5f1"/>
                    <XAxis dataKey="data"/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend/>
                    <Area type="monotone" dataKey="quantidade" fill="url(#prodQtd)" stroke="#76196c" name="Quantidade"/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Filiais */}
              <div className="bg-white rounded-2xl p-6 border-2 border-[#d695e7]">
                <h2 className="text-xl font-bold text-[#76196c] mb-3 flex items-center gap-2">
                  <Store size={20} /> Filiais com mais vendas
                </h2>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart layout="vertical" data={prepararFiliais()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8c5f1"/>
                    <XAxis type="number"/>
                    <YAxis type="category" dataKey="nome" width={100}/>
                    <Tooltip/>
                    <Legend/>
                    <Bar dataKey="vendas" fill="#76196c" radius={[0, 10, 10, 0]} name="Vendas"/>
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>


            {/* Tabela de vendas */}
            {dados.vendasDetalhadas?.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#d695e7]">
                <h2 className="text-2xl font-bold text-[#76196c] mb-4 flex items-center gap-2">
                  <BarChart3 size={24}/> Vendas do produto
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-[#f8f0fc] to-[#fef5ff] border-b-2 border-[#d695e7]">
                        <th className="p-4 text-left text-[#76196c] font-bold">Venda</th>
                        <th className="p-4 text-left text-[#76196c] font-bold">Quantidade</th>
                        <th className="p-4 text-left text-[#76196c] font-bold">Valor</th>
                        <th className="p-4 text-left text-[#76196c] font-bold">Filial</th>
                        <th className="p-4 text-left text-[#76196c] font-bold">Data</th>
                      </tr>
                    </thead>

                    <tbody>
                      {dados.vendasDetalhadas.map((v) => (
                        <tr key={v.id_venda} className="border-b hover:bg-[#fef5ff]">
                          <td className="p-4 font-mono bg-[#e8c5f1] text-[#76196c] rounded-lg">
                            #{v.id_venda}
                          </td>
                          <td className="p-4 font-bold text-blue-600">{v.quantidade}</td>
                          <td className="p-4 font-bold text-green-600">
                            R$ {parseFloat(v.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-4">{v.nome_filial}</td>
                          <td className="p-4">
                            {new Date(v.data_venda).toLocaleString("pt-BR")}
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
