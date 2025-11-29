"use client";

import { useState, useEffect } from "react";
import { getCookie } from "cookies-next/client";
import Link from "next/link";
<<<<<<< HEAD

// Componente de Card de Métrica
function MetricCard({ title, value, icon, color, trend }) {
  return (
    <div className={`bg-white rounded-xl border-3 border-dashed border-${color} p-6 shadow-sm hover:shadow-md transition-shadow`}>
=======
import { SidebarTrigger } from "@/components/ui/sidebar";

// Componente de Card de Métrica
function MetricCard({ title, value, icon, color, trend, subValue }) {
  return (
    <div
      className={`bg-white rounded-xl border-3 border-dashed border-${color} p-6 shadow-sm hover:shadow-md transition-shadow`}
    >
>>>>>>> origin/bernardo
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold text-${color} mb-2`}>{value}</p>
<<<<<<< HEAD
          {trend && (
            <div className="flex items-center gap-1 text-sm">
              <i className={`bi bi-arrow-${trend.direction} text-${trend.direction === 'up' ? 'green' : 'red'}-600`}></i>
              <span className={`font-semibold text-${trend.direction === 'up' ? 'green' : 'red'}-600`}>
                {trend.percentage}%
              </span>
              <span className="text-gray-500">vs período anterior</span>
=======
          
          {subValue && (
            <p className="text-xs text-gray-500 font-medium mt-1">{subValue}</p>
          )}

          {trend && (
            <div className="flex items-center gap-1 text-sm mt-1">
              <i
                className={`bi bi-arrow-${trend.direction} text-${
                  trend.direction === "up" ? "green" : "red"
                }-600`}
              ></i>
              <span
                className={`font-semibold text-${
                  trend.direction === "up" ? "green" : "red"
                }-600`}
              >
                {trend.percentage}%
              </span>
              <span className="text-gray-500">vs anterior</span>
>>>>>>> origin/bernardo
            </div>
          )}
        </div>
        <div className={`bg-${color}/10 p-3 rounded-lg`}>
          <i className={`bi bi-${icon} text-2xl text-${color}`}></i>
        </div>
      </div>
    </div>
  );
}

// Componente de Loading Skeleton
function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
<<<<<<< HEAD
          <div key={i} className="bg-white rounded-xl border-2 border-gray-200 p-6 h-32"></div>
=======
          <div
            key={i}
            className="bg-white rounded-xl border-2 border-gray-200 p-6 h-32"
          ></div>
>>>>>>> origin/bernardo
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {[...Array(2)].map((_, i) => (
<<<<<<< HEAD
          <div key={i} className="bg-white rounded-xl border-2 border-gray-200 p-6 h-64"></div>
=======
          <div
            key={i}
            className="bg-white rounded-xl border-2 border-gray-200 p-6 h-64"
          ></div>
>>>>>>> origin/bernardo
        ))}
      </div>
    </div>
  );
}

// Componente de Quick Action
function QuickActionCard({ title, description, icon, href, color }) {
  return (
    <Link
      href={href}
      className={`bg-white rounded-xl border-3 border-dashed border-${color} p-5 hover:scale-[1.02] transition-all duration-200 cursor-pointer group`}
    >
      <div className="flex items-center gap-4">
<<<<<<< HEAD
        <div className={`bg-${color}/10 p-3 rounded-lg group-hover:bg-${color}/20 transition-colors`}>
=======
        <div
          className={`bg-${color}/10 p-3 rounded-lg group-hover:bg-${color}/20 transition-colors`}
        >
>>>>>>> origin/bernardo
          <i className={`bi bi-${icon} text-2xl text-${color}`}></i>
        </div>
        <div className="flex-1">
          <h3 className={`font-bold text-lg text-${color} mb-1`}>{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <i className="bi bi-chevron-right text-xl text-gray-400 group-hover:text-gray-600"></i>
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
<<<<<<< HEAD
  const [nomeFilial, setNomeFilial] = useState("");
=======
>>>>>>> origin/bernardo
  const [nomeAdmin, setNomeAdmin] = useState("");
  const [periodo, setPeriodo] = useState("mes");
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const nome = getCookie("nome");
<<<<<<< HEAD
    const empresa = getCookie("empresa");
    setNomeAdmin(nome || "Administrador");
    setNomeFilial(empresa || "Filial");
=======
    setNomeAdmin(nome || "Administrador");
>>>>>>> origin/bernardo
  }, []);

  useEffect(() => {
    const buscarDados = async () => {
      setLoading(true);
      setErro(null);
<<<<<<< HEAD
      
      try {
        const response = await fetch(`http://localhost:8080/admin/dashboard?periodo=${periodo}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (response.status === 403) {
          window.location.href = "/forbidden";
=======

      try {
        // Alterado para endpoint de Admin
        const response = await fetch(
          `http://localhost:8080/admin/dashboard?periodo=${periodo}`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.status === 403) {
          // window.location.href = "/forbidden"; // Descomentar em produção
>>>>>>> origin/bernardo
          return;
        }

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
<<<<<<< HEAD
        console.log("Dashboard data:", data);
        setDashboardData(data.dashboard);
        
=======
        console.log("Dashboard Admin Data:", data);
        setDashboardData(data.dashboard);
>>>>>>> origin/bernardo
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setErro(error.message);
      } finally {
        setLoading(false);
      }
    };

    buscarDados();
  }, [periodo]);

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-br from-[#f0e5f5] to-[#e8f5e8] p-5 lg:p-8">
=======
    <div className="min-h-screen bg-gradient-to-br from-[#DDF1D4] to-verdeclaro p-5 lg:p-8">
>>>>>>> origin/bernardo
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
<<<<<<< HEAD
            <h1 className="text-3xl lg:text-4xl font-bold text-[#76196c] mb-2">
              Dashboard - {nomeFilial}
            </h1>
            <p className="text-lg text-[#8c3e82]">
              Bem-vindo, <span className="font-semibold">{nomeAdmin}</span>! 
=======
            <h1 className="text-3xl lg:text-4xl font-bold text-[#76196c] mb-2 flex items-center gap-2">
              <SidebarTrigger /> Visão Geral - Matriz
            </h1>
            <p className="text-lg text-[#8c3e82]">
              Olá, <span className="font-semibold">{nomeAdmin}</span>. Aqui está o resumo da rede.
>>>>>>> origin/bernardo
            </p>
          </div>

          {/* Filtro de período */}
<<<<<<< HEAD
          <div className="flex gap-2 bg-white rounded-xl p-1 border-2 border-[#b478ab]">
=======
          <div className="flex gap-2 bg-white rounded-xl p-1 border-3 border-[#b478ab] border-dashed shadow-sm">
>>>>>>> origin/bernardo
            {["hoje", "semana", "mes", "ano"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriodo(p)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  periodo === p
<<<<<<< HEAD
                    ? "bg-[#76196c] text-white"
=======
                    ? "bg-[#76196c] text-white shadow-md"
>>>>>>> origin/bernardo
                    : "text-[#76196c] hover:bg-[#f0e5f5]"
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Erro */}
        {erro && (
<<<<<<< HEAD
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-700">
              <i className="bi bi-exclamation-triangle text-xl"></i>
              <p className="font-semibold">Erro ao carregar dashboard: {erro}</p>
=======
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-2 text-red-700">
              <i className="bi bi-exclamation-triangle-fill text-xl"></i>
              <p className="font-semibold">
                Não foi possível carregar os dados: {erro}
              </p>
>>>>>>> origin/bernardo
            </div>
          </div>
        )}

        {loading ? (
          <DashboardSkeleton />
        ) : dashboardData ? (
          <>
<<<<<<< HEAD
            {/* Métricas principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <MetricCard
                title="Vendas do Período"
                value={dashboardData.vendas.total}
=======
            {/* Métricas principais (KPIs) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <MetricCard
                title="Faturamento da Rede"
                value={dashboardData.vendas.total}
                subValue={`${dashboardData.vendas.totalTransacoes} transações`}
>>>>>>> origin/bernardo
                icon="graph-up-arrow"
                color="[#569a33]"
                trend={dashboardData.vendas.trend}
              />
              <MetricCard
<<<<<<< HEAD
=======
                title="Contas a Pagar (Total)"
                // Usando o dado exclusivo do controller Admin
                value={dashboardData.fluxoCaixa.contasPendentes || "R$ 0,00"} 
                icon="wallet2"
                color="[#ff6b6b]"
              />
              <MetricCard
>>>>>>> origin/bernardo
                title="Produtos Vendidos"
                value={dashboardData.produtos.vendidos}
                icon="box-seam"
                color="[#76196c]"
              />
<<<<<<< HEAD
              <MetricCard
                title="Estoque Baixo"
                value={dashboardData.produtos.baixoEstoque}
                icon="exclamation-triangle"
                color="[#ff6b6b]"
              />
              <MetricCard
                title="Vendedores Ativos"
                value={dashboardData.vendedores.ativos}
                icon="people"
=======
               <MetricCard
                title="Equipe Ativa"
                value={dashboardData.vendedores.ativos}
                subValue="Vendedores na rede"
                icon="people-fill"
>>>>>>> origin/bernardo
                color="[#4f6940]"
              />
            </div>

<<<<<<< HEAD
            {/* Ações Rápidas */}
            <div>
              <h2 className="text-2xl font-bold text-[#76196c] mb-4">Ações Rápidas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <QuickActionCard
                  title="Produtos"
                  description="Gerenciar catálogo e descontos"
                  icon="box-seam"
                  href="/admin/produtos"
                  color="[#76196c]"
                />
                <QuickActionCard
                  title="Vendedores"
                  description="Gerenciar equipe de vendas"
                  icon="people"
                  href="/admin/vendedores"
                  color="[#569a33]"
                />
                <QuickActionCard
                  title="Fornecedores"
                  description="Cadastrar e gerenciar fornecedores"
                  icon="truck"
                  href="/admin/fornecedores"
                  color="[#4f6940]"
                />
                <QuickActionCard
                  title="Financeiro"
                  description="Fluxo de caixa e despesas"
                  icon="cash-coin"
                  href="/admin/financeiro"
                  color="[#ff6b6b]"
                />
                <QuickActionCard
                  title="Relatórios"
                  description="Gerar relatórios e análises"
                  icon="file-earmark-bar-graph"
                  href="/admin/relatorios"
                  color="[#924187]"
                />
                <QuickActionCard
                  title="Alertas"
                  description="Produtos com estoque baixo"
                  icon="bell"
                  href="/admin/estoque-baixo"
=======
            {/* Seção Exclusiva Admin: Ranking de Lojas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Ranking das Lojas */}
              <div className="lg:col-span-2 bg-white rounded-xl border-3 border-dashed border-[#76196c] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#76196c] flex items-center gap-2">
                    <i className="bi bi-shop text-2xl"></i> Desempenho por Filial
                  </h3>
                  <Link href="/admin/relatorios" className="text-sm text-[#76196c] hover:underline font-medium">
                    Ver relatório completo →
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 text-left">
                        <th className="pb-3 text-sm font-semibold text-gray-500">Filial</th>
                        <th className="pb-3 text-sm font-semibold text-gray-500 text-right">Vendas</th>
                        <th className="pb-3 text-sm font-semibold text-gray-500 text-right">Faturamento</th>
                        <th className="pb-3 text-sm font-semibold text-gray-500 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {dashboardData.rankingLojas && dashboardData.rankingLojas.length > 0 ? (
                        dashboardData.rankingLojas.map((loja, index) => (
                          <tr key={index} className="hover:bg-purple-50/50 transition-colors">
                            <td className="py-3 font-medium text-gray-800 flex items-center gap-2">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-gray-200 text-gray-600'}`}>
                                {index + 1}
                              </span>
                              {loja.nome}
                            </td>
                            <td className="py-3 text-right text-gray-600">{loja.totalVendas}</td>
                            <td className="py-3 text-right font-bold text-[#569a33]">{loja.valorTotal}</td>
                            <td className="py-3 text-center">
                              <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="py-8 text-center text-gray-400 italic">
                            Nenhuma venda registrada neste período.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Destaques Rápidos */}
              <div className="space-y-5">
                {/* Melhor Vendedor da Rede */}
                <div className="bg-gradient-to-br from-[#76196c] to-[#5a1252] rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-purple-200 text-sm font-medium mb-1">⭐ Destaque Global</p>
                            <h4 className="text-2xl font-bold">{dashboardData.vendedores.melhorVendedor}</h4>
                            <p className="text-sm opacity-90 mt-1">
                              Responsável por <span className="font-bold">{dashboardData.vendedores.vendasMelhorVendedor} vendas</span>
                            </p>
                        </div>
                        <i className="bi bi-trophy-fill text-3xl text-yellow-400"></i>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
                        <span className="text-sm">Total gerado:</span>
                        <span className="font-bold text-lg">R$ {dashboardData.vendedores.valorMelhorVendedor.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>

                {/* Alerta de Estoque */}
                <div className={`rounded-xl border-2 p-5 ${dashboardData.produtos.baixoEstoque > 0 ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}`}>
                    <div className="flex items-center gap-3 mb-2">
                        <i className={`bi ${dashboardData.produtos.baixoEstoque > 0 ? 'bi-exclamation-triangle-fill text-orange-500' : 'bi-check-circle-fill text-green-500'} text-xl`}></i>
                        <h4 className={`font-bold ${dashboardData.produtos.baixoEstoque > 0 ? 'text-orange-800' : 'text-green-800'}`}>
                           Controle de Estoque
                        </h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                        {dashboardData.produtos.baixoEstoque > 0 
                            ? `Existem ${dashboardData.produtos.baixoEstoque} produtos críticos na rede.` 
                            : 'Todos os níveis de estoque estão saudáveis.'}
                    </p>
                    {dashboardData.produtos.baixoEstoque > 0 && (
                        <Link href="/admin/alertas" className="text-sm font-semibold text-orange-700 hover:text-orange-900 underline">
                            Resolver agora
                        </Link>
                    )}
                </div>
              </div>

            </div>

            {/* Ações Rápidas - Links ajustados para Admin */}
            <div>
              <h2 className="text-2xl font-bold text-[#76196c] mb-4 mt-2">
                Gestão Rápida
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <QuickActionCard
                  title="Nova Loja"
                  description="Cadastrar filial"
                  icon="shop"
                  href="/admin/lojas"
                  color="[#76196c]"
                />
                <QuickActionCard
                  title="Produtos"
                  description="Catálogo global"
                  icon="box-seam"
                  href="/admin/produtos"
                  color="[#569a33]"
                />
                <QuickActionCard
                  title="Financeiro"
                  description="Contas e Fluxo"
                  icon="cash-coin"
                  href="/admin/financeiro"
                  color="[#4f6940]"
                />
                <QuickActionCard
                  title="Relatórios"
                  description="Análise completa"
                  icon="file-text"
                  href="/admin/relatorios"
>>>>>>> origin/bernardo
                  color="[#ff6b6b]"
                />
              </div>
            </div>

<<<<<<< HEAD
            {/* Fluxo de Caixa e Alertas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Fluxo de Caixa */}
              <div className="bg-white rounded-xl border-3 border-dashed border-[#569a33] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#569a33]">Fluxo de Caixa</h3>
                  <i className="bi bi-cash-stack text-2xl text-[#569a33]"></i>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-semibold text-gray-700">Entradas</span>
                    <span className="text-lg font-bold text-green-600">
                      {dashboardData.fluxoCaixa.entradas}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="font-semibold text-gray-700">Saídas</span>
                    <span className="text-lg font-bold text-red-600">
                      {dashboardData.fluxoCaixa.saidas}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#9bf377]/20 rounded-lg border-2 border-[#569a33]">
                    <span className="font-bold text-gray-700">Saldo</span>
                    <span className="text-xl font-bold text-[#569a33]">
                      {dashboardData.fluxoCaixa.saldo}
                    </span>
                  </div>
                </div>
              </div>

              {/* Melhor Vendedor e Destaques */}
              <div className="bg-white rounded-xl border-3 border-dashed border-[#76196c] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#76196c]">Destaques</h3>
                  <i className="bi bi-trophy text-2xl text-[#76196c]"></i>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-[#e8c5f1] rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">🏆 Melhor Vendedor do Período</p>
                    <p className="text-xl font-bold text-[#76196c]">
                      {dashboardData.vendedores.melhorVendedor}
                    </p>
                    <p className="text-sm text-[#8c3e82] mt-1">
                      {dashboardData.vendedores.vendasMelhorVendedor} vendas • 
                      R$ {dashboardData.vendedores.valorMelhorVendedor.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  <div className="p-4 bg-[#c5ffad] rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">📊 Total de Transações</p>
                    <p className="text-xl font-bold text-[#569a33]">
                      {dashboardData.vendas.totalTransacoes} vendas
                    </p>
                    <p className="text-sm text-[#4f6940] mt-1">
                      {dashboardData.produtos.vendidos} produtos vendidos
                    </p>
                  </div>
                  {dashboardData.produtos.baixoEstoque > 0 && (
                    <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-300">
                      <p className="text-sm text-gray-600 mb-1">⚠️ Atenção</p>
                      <p className="text-base font-semibold text-orange-700">
                        {dashboardData.produtos.baixoEstoque} produtos com estoque baixo
                      </p>
                      <Link 
                        href="/admin/estoque-baixo"
                        className="text-sm text-orange-600 hover:text-orange-800 underline mt-1 inline-block"
                      >
                        Ver detalhes →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Estatísticas Adicionais */}
            <div className="bg-white rounded-xl border-3 border-dashed border-[#b478ab] p-6">
              <h3 className="text-xl font-bold text-[#76196c] mb-4">
                Pagamentos do Período
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[#e8f5e8] rounded-lg border-2 border-[#569a33]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">PIX</p>
                      <p className="text-2xl font-bold text-[#569a33]">
                        R$ {dashboardData.vendas.porTipoPagamento.pix.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    <i className="bi bi-qr-code text-3xl text-[#569a33]"></i>
                  </div>
                </div>
                <div className="p-4 bg-[#fff5e6] rounded-lg border-2 border-[#ff9800]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Dinheiro</p>
                      <p className="text-2xl font-bold text-[#ff9800]">
                        R$ {dashboardData.vendas.porTipoPagamento.dinheiro.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    <i className="bi bi-cash-coin text-3xl text-[#ff9800]"></i>
                  </div>
                </div>
                <div className="p-4 bg-[#f0e5f5] rounded-lg border-2 border-[#76196c]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Cartão</p>
                      <p className="text-2xl font-bold text-[#76196c]">
                        R$ {dashboardData.vendas.porTipoPagamento.cartao.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    <i className="bi bi-credit-card text-3xl text-[#76196c]"></i>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-8 text-center">
            <i className="bi bi-inbox text-6xl text-gray-400 mb-4"></i>
            <p className="text-xl font-semibold text-gray-600">
              Nenhum dado disponível
            </p>
=======
            {/* Fluxo de Caixa Consolidado */}
            <div className="bg-white rounded-xl border-3 border-dashed border-[#569a33] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#569a33] flex items-center gap-2">
                     <i className="bi bi-bank text-2xl"></i> Fluxo de Caixa Consolidado
                  </h3>
                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">Rede Inteira</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col p-4 bg-green-50 rounded-xl border border-green-100">
                    <span className="text-sm font-semibold text-gray-600 mb-1">Entradas (Vendas)</span>
                    <span className="text-2xl font-bold text-green-600">{dashboardData.fluxoCaixa.entradas}</span>
                  </div>
                  <div className="flex flex-col p-4 bg-red-50 rounded-xl border border-red-100">
                    <span className="text-sm font-semibold text-gray-600 mb-1">Saídas (Despesas)</span>
                    <span className="text-2xl font-bold text-red-600">{dashboardData.fluxoCaixa.saidas}</span>
                  </div>
                  <div className="flex flex-col p-4 bg-[#f0fdf4] rounded-xl border-2 border-[#569a33]">
                    <span className="text-sm font-bold text-gray-700 mb-1">Saldo Líquido</span>
                    <span className="text-2xl font-black text-[#569a33]">{dashboardData.fluxoCaixa.saldo}</span>
                  </div>
                </div>
            </div>

          </>
        ) : (
          <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-12 text-center">
            <i className="bi bi-inbox text-6xl text-gray-400 mb-4 block"></i>
            <p className="text-xl font-semibold text-gray-600">
              Nenhum dado encontrado para o período selecionado.
            </p>
            <p className="text-gray-500 mt-2">Tente mudar o filtro de data.</p>
>>>>>>> origin/bernardo
          </div>
        )}
      </div>
    </div>
  );
}