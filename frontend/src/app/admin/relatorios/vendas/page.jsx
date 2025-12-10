"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Calendar, Store, Package, ShoppingCart, Filter, RefreshCw, Download, BarChart3 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { SidebarTrigger } from "@/components/ui/sidebar";


export default function RelatorioVendas() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filiais, setFiliais] = useState([]);
  
  // Filtros
  const [filtros, setFiltros] = useState({
    dataInicio: "",
    dataFim: "",
    filialId: "",
  });

  const COLORS = ['#76196c', '#9b2b91', '#d695e7', '#75ba51', '#4f6940', '#e8c5f1'];

  const fetchFiliais = async () => {
    try {
      const res = await fetch("http://localhost:8080/admin/meta?filiais=true", {
        credentials: "include"
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
      
      // Monta query string com filtros
      const params = new URLSearchParams();
      if (filtros.dataInicio) params.append("dataInicio", filtros.dataInicio);
      if (filtros.dataFim) params.append("dataFim", filtros.dataFim);
      if (filtros.filialId) params.append("filialId", filtros.filialId);

      const res = await fetch(
        `http://localhost:8080/admin/relatorios/vendas?${params.toString()}`,
        { credentials: "include" }
      );
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Erro ao buscar relatório de vendas:", err);
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
    setFiltros(prev => ({ ...prev, [name]: value }));
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
    const dataFim = hoje.toISOString().split('T')[0];
    const dataInicio = new Date(hoje.setDate(hoje.getDate() - dias)).toISOString().split('T')[0];
    
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
    return data.vendasPorDia.map(item => ({
      data: new Date(item.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      vendas: item.total_vendas,
      faturamento: parseFloat(item.faturamento)
    }));
  };

  const prepararDadosFiliais = () => {
    if (!data?.porFilial) return [];
    return data.porFilial.map(item => ({
      nome: item.nome_filial.length > 15 ? item.nome_filial.substring(0, 15) + '...' : item.nome_filial,
      vendas: item.total_vendas,
      faturamento: parseFloat(item.faturamento)
    }));
  };

  const prepararDadosPagamento = () => {
    if (!data?.porTipoPagamento) return [];
    return data.porTipoPagamento.map(item => ({
      name: item.tipo_pagamento.charAt(0).toUpperCase() + item.tipo_pagamento.slice(1),
      value: item.total_vendas,
      faturamento: parseFloat(item.faturamento)
    }));
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin text-[#76196c] mx-auto mb-4" size={48} />
          <p className="text-[#76196c] font-medium">Carregando relatório...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <p className="text-[#76196c] font-medium">Erro ao carregar relatório.</p>
      </div>
    );
  }

  return (
    <>
    <div className="p-6">
        <SidebarTrigger />
      </div>

    <div className="min-h-screen  p-4 sm:p-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <div className="bg-[#EBC7F5] rounded-3xl p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#76196c] mb-2 flex items-center justify-center gap-3">
              <BarChart3 size={36} />
              Relatório de Vendas
            </h1>
            <p className="text-neutral-600 text-lg">
              Análise detalhada de vendas, faturamento e desempenho
            </p>
          </div>

          {/* Filtros */}
          <div className="bg-[#C5FFAD] p-5 rounded-2xl border-2 border-[#e8c5f1]">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="text-[#76196c]" size={20} />
              <h3 className="text-[#76196c] font-bold">Filtros</h3>
            </div>

            {/* Botões de período rápido */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setPeriodoRapido(7)}
                className="px-4 py-2 bg-[#76196c] hover:bg-[#9b2b91] text-[#C5FFAD] text-sm rounded-xl transition-all"
              >
                Últimos 7 dias
              </button>
              <button
                onClick={() => setPeriodoRapido(15)}
                className="px-4 py-2 bg-[#76196c] hover:bg-[#9b2b91] text-[#C5FFAD] text-sm rounded-xl transition-all"
              >
                Últimos 15 dias
              </button>
              <button
                onClick={() => setPeriodoRapido(30)}
                className="px-4 py-2 bg-[#76196c] hover:bg-[#9b2b91] text-[#C5FFAD] text-sm rounded-xl transition-all"
              >
                Últimos 30 dias
              </button>
              <button
                onClick={() => setPeriodoRapido(90)}
                className="px-4 py-2 bg-[#76196c] hover:bg-[#9b2b91] text-[#C5FFAD] text-sm rounded-xl transition-all"
              >
                Últimos 90 dias
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-[#76196c] font-semibold mb-2 text-sm">Data Início</label>
                <input
                  type="date"
                  name="dataInicio"
                  value={filtros.dataInicio}
                  onChange={handleFiltroChange}
                  className="w-full bg-[#C5FFAD] p-3 rounded-xl border-2 border-[#d695e7] focus:ring-2 focus:ring-[#76196c] transition-all"
                />
              </div>

              <div>
                <label className="block text-[#76196c] font-semibold mb-2 text-sm">Data Fim</label>
                <input
                  type="date"
                  name="dataFim"
                  value={filtros.dataFim}
                  onChange={handleFiltroChange}
                  className="w-full bg-[#C5FFAD]  p-3 rounded-xl border-2 border-[#d695e7] focus:ring-2 focus:ring-[#76196c] transition-all"
                />
              </div>

              <div>
                <label className="block text-[#76196c] font-semibold mb-2 text-sm">Filial</label>
                <select
                  name="filialId"
                  value={filtros.filialId}
                  onChange={handleFiltroChange}
                  className="w-full p-3 rounded-xl bg-[#C5FFAD] border-2 border-[#d695e7] focus:ring-2 focus:ring-[#76196c] transition-all"
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
                  className="flex-1 flex items-center justify-center gap-2 bg-[#75ba51] hover:bg-[#5a9940]/60 text-[#76196C] font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="animate-spin" size={18} /> : <Filter size={18} />}
                  Aplicar
                </button>
                <button
                  onClick={limparFiltros}
                  className="px-4 py-3 bg-[#75ba51] hover:bg-[#5a9940]/60 text-[#76196C] font-bold rounded-xl transition-all"
                >
                  Limpar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg border-2 border-[#d695e7] bg-[#EBC7F5]">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-2xl">
                  <ShoppingCart className="w-8 h-8 text-[#76196c]" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 font-medium">Total de Vendas</p>
                  <h2 className="text-3xl font-bold text-[#76196c]">{data?.resumo?.totalVendas || 0}</h2>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-2 border-[#d695e7] bg-[#C5FFAD]">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-2xl">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 font-medium">Faturamento</p>
                  <h2 className="text-2xl font-bold text-green-600">
                    R$ {data?.resumo?.totalFaturamento?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                  </h2>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-2 border-[#d695e7] bg-[#EBC7F5]">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-2xl">
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 font-medium">Ticket Médio</p>
                  <h2 className="text-2xl font-bold text-blue-600">
                    R$ {data?.resumo?.ticketMedio?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                  </h2>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-2 border-[#d695e7] bg-[#C5FFAD]">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-2xl">
                  <Store className="w-8 h-8 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 font-medium">Filiais Ativas</p>
                  <h2 className="text-3xl font-bold text-orange-500">{data?.porFilial?.length || 0}</h2>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Gráfico de Vendas por Dia */}
          {data?.vendasPorDia && data.vendasPorDia.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#d695e7]">
              <h3 className="text-xl font-bold text-[#76196c] mb-4 flex items-center gap-2">
                <TrendingUp size={20} />
                Evolução de Vendas
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={prepararDadosVendasPorDia()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8c5f1" />
                  <XAxis dataKey="data" stroke="#76196c" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#76196c" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #d695e7',
                      borderRadius: '12px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="vendas" 
                    stroke="#76196c" 
                    strokeWidth={3}
                    name="Qtd. Vendas"
                    dot={{ fill: '#76196c', r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="faturamento" 
                    stroke="#75ba51" 
                    strokeWidth={3}
                    name="Faturamento (R$)"
                    dot={{ fill: '#75ba51', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Gráfico de Vendas por Tipo de Pagamento */}
          {data?.porTipoPagamento && data.porTipoPagamento.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#d695e7]">
              <h3 className="text-xl font-bold text-[#76196c] mb-4 flex items-center gap-2">
                <ShoppingCart size={20} />
                Vendas por Tipo de Pagamento
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={prepararDadosPagamento()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {prepararDadosPagamento().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #d695e7',
                      borderRadius: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Gráfico de Faturamento por Filial */}
          {data?.porFilial && data.porFilial.length > 0 && (
            <div className="bg-[#C5FFAD] p-6 rounded-2xl lg:col-span-2">
              <h3 className="text-xl font-bold text-[#76196c] mb-4 flex items-center gap-2">
                <Store size={20} />
                Faturamento por Filial
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={prepararDadosFiliais()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8c5f1" />
                  <XAxis dataKey="nome" stroke="#76196c" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#76196c" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #d695e7',
                      borderRadius: '12px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="vendas" fill="#76196c" name="Qtd. Vendas" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="faturamento" fill="#75ba51" name="Faturamento (R$)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Tabelas */}
        
        {/* Ranking por Filial */}
        {data?.porFilial && data.porFilial.length > 0 && (
          <div className="bg-[#EBC7F5] p-6 rounded-2xl">
            <h2 className="text-2xl font-bold text-[#76196c] mb-4 flex items-center gap-2">
              <Store className="w-6 h-6" /> Ranking por Filial
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#D594E6]/60 border-b-2 border-[#d695e7]">
                    <th className="p-4 text-left text-[#76196c] font-bold">#</th>
                    <th className="p-4 text-left text-[#76196c] font-bold">Filial</th>
                    <th className="p-4 text-left text-[#76196c] font-bold">Total de Vendas</th>
                    <th className="p-4 text-left text-[#76196c] font-bold">Faturamento</th>
                  </tr>
                </thead>
                <tbody>
                  {data.porFilial.map((f, idx) => (
                    <tr key={f.id_empresa} className="border-b border-[#D594E6] hover:bg-[#D594E6] transition-colors">
                      <td className="p-4">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                          idx === 0 ? 'bg-yellow-400 text-yellow-900' :
                          idx === 1 ? 'bg-gray-300 text-gray-700' :
                          idx === 2 ? 'bg-orange-300 text-orange-900' :
                          'bg-[#e8c5f1] text-[#76196c]'
                        }`}>
                          {idx + 1}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-[#76196c]">{f.nome_filial}</td>
                      <td className="p-4 font-medium text-[#76196C]">{f.total_vendas}</td>
                      <td className="p-4 text-[#4EA912] font-bold">
                        R$ {parseFloat(f.faturamento).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Top Produtos */}
        {data?.topProdutos && data.topProdutos.length > 0 && (
          <div className="bg-[#C5FFAD] p-6 rounded-2xl">
            <h2 className="text-2xl font-bold text-[#76196c] mb-4 flex items-center gap-2">
              <Package className="w-6 h-6" /> Top Produtos Mais Vendidos
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#75BA51]/60 border-b-2 border-[#d695e7]">
                    <th className="p-4 text-left text-[#76196c] font-bold">#</th>
                    <th className="p-4 text-left text-[#76196c] font-bold">Produto</th>
                    <th className="p-4 text-left text-[#76196c] font-bold">Quantidade</th>
                    <th className="p-4 text-left text-[#76196c] font-bold">Faturamento</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topProdutos.map((p, idx) => (
                    <tr key={p.id_produto} className="border-b border-[#75BA51] hover:bg-[#75BA51]/40 transition-colors">
                      <td className="p-4">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                          idx === 0 ? 'bg-yellow-400 text-yellow-900' :
                          idx === 1 ? 'bg-gray-300 text-gray-700' :
                          idx === 2 ? 'bg-orange-300 text-orange-900' :
                          'bg-[#e8c5f1] text-[#76196c]'
                        }`}>
                          {idx + 1}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-[#4F6940] ">{p.nome}</td>
                      <td className="p-4 font-medium text-[#4F6940]">{p.quantidade_vendida} un.</td>
                      <td className="p-4 text-[#4EA912] font-bold">
                        R$ {parseFloat(p.faturamento_produto).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
          <div className="bg-[#EBC7F5] p-6 rounded-2xl">
            <h2 className="text-2xl font-bold text-[#76196c] mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6" /> Últimas Vendas
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-[#f8f0fc] to-[#fef5ff] border-b-2 border-[#d695e7]">
                    <th className="p-4 text-left text-[#76196c] font-bold">ID</th>
                    <th className="p-4 text-left text-[#76196c] font-bold">Valor</th>
                    <th className="p-4 text-left text-[#76196c] font-bold">Pagamento</th>
                    <th className="p-4 text-left text-[#76196c] font-bold">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {data.ultimasVendas.map((v) => (
                    <tr key={v.id_venda} className="border-b hover:bg-[#fef5ff] transition-colors">
                      <td className="p-4">
                        <span className="font-mono text-sm bg-[#e8c5f1] text-[#76196c] px-3 py-1 rounded-lg">
                          #{v.id_venda}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-[#4EA912]">
                        R$ {parseFloat(v.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4">
                        <span className="capitalize bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                          {v.tipo_pagamento}
                        </span>
                      </td>
                      <td className="p-4 text-[#76196C]">
                        {new Date(v.data_venda).toLocaleString('pt-BR')}
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
    </>
  );
}