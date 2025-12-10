"use client";

import { useState, useEffect } from "react";
import { getCookie } from "cookies-next/client";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";

// Formata números para moeda BRL: R$ XXX.XXX,XX
function formatCurrency(value) {
  if (value === null || value === undefined || value === "") return "R$ 0,00";

  // If it's already a formatted string containing R$, return it
  if (typeof value === "string" && value.includes("R$")) {
    return value;
  }

  // Try to coerce to number if string like "1234.56" or "1234,56"
  let num = value;
  if (typeof value === "string") {
    const cleaned = value.replace(/\./g, "").replace(/,/g, ".").replace(/[^0-9.\-]/g, "");
    num = Number(cleaned);
  } else {
    num = Number(value);
  }

  if (isNaN(num)) return "R$ 0,00";

  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(num);
}

// Componente de Card de Métrica
function MetricCard({ title, value, icon, color, trend, subValue, bg, text, text2 }) {
  return (
    <div
      className={`bg-${bg} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-semibold text-${text} mb-1`}>{title}</p>
          <p className={`text-3xl font-bold text-${color} mb-2`}>{value}</p>

          {subValue && (
            <p className={`text-xs text-${text2} font-medium mt-1`}>{subValue}</p>
          )}

          {trend && (
            <div className="flex items-center gap-1 text-sm mt-1">
              <i
                className={`bi bi-arrow-${trend.direction} text-${trend.direction === "up" ? "green" : "red"
                  }-600`}
              ></i>
              <span
                className={`font-semibold text-${trend.direction === "up" ? "green" : "red"
                  }-600`}
              >
                {trend.percentage}%
              </span>
              <span className="text-gray-500">vs anterior</span>
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
          <div
            key={i}
            className="bg-white rounded-xl border-2 border-gray-200 p-6 h-32"
          ></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border-2 border-gray-200 p-6 h-64"
          ></div>
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
      className={`bg-[#DDF1D4] rounded-xl border-1 border-${color} p-5 cursor-pointer group transition-all duration-300 ease-out hover:scale-[0.97] hover:bg-[#c4eab2]`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`bg-${color}/10 p-3 rounded-lg group-hover:bg-${color}/20 transition-colors`}
        >
          <i className={`bi bi-${icon} text-2xl text-${color}`}></i>
        </div>
        <div className="flex-1">
          <h3 className={`font-bold text-lg text-${color} mb-1`}>{title}</h3>
          <p className="text-sm text-[#4F6940]">{description}</p>
        </div>
        <i className="bi bi-chevron-right text-xl text-[#4F6940] group-hover:text-gray-600"></i>
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [nomeAdmin, setNomeAdmin] = useState("");
  const [periodo, setPeriodo] = useState("mes");
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const nome = getCookie("nome");
    setNomeAdmin(nome || "Administrador");
  }, []);

  useEffect(() => {
    const buscarDados = async () => {
      setLoading(true);
      setErro(null);

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
          return;
        }

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Dashboard Admin Data:", data);
        setDashboardData(data.dashboard);
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
    <div className="min-h-screen bg-gradient-to-br from-[#DDF0D4] p-5 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#76196c] mb-2 flex items-center gap-2">
              <SidebarTrigger /> Visão Geral - Matriz
            </h1>
            <p className="text-lg text-[#8c3e82]">
              Olá, <span className="font-semibold">{nomeAdmin}</span>. Aqui está o resumo da rede.
            </p>
          </div>

          {/* Filtro de período */}
          <div className="flex gap-2 bg-[#EBC7F5] rounded-xl p-1 border-3">
            {[
              { key: "hoje", label: "Hoje" },
              { key: "semana", label: "Semana" },
              { key: "mes", label: "Mês" },
              { key: "ano", label: "Ano" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setPeriodo(item.key)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${periodo === item.key
                  ? "bg-[#76196c]/70 text-[#C5FFAD]"
                  : "text-[#76196c] hover:bg-[#C97FDA]/50"
                  }`}
              >
                {item.label}
              </button>
            ))}

          </div>
        </div>

        {/* Erro */}
        {erro && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-2 text-red-700">
              <i className="bi bi-exclamation-triangle-fill text-xl"></i>
              <p className="font-semibold">
                Não foi possível carregar os dados: {erro}
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <DashboardSkeleton />
        ) : dashboardData ? (
          <>
            {/* Métricas principais (KPIs) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <MetricCard
                title="Faturamento da Rede"
                value={formatCurrency(dashboardData.vendas.total)}
                subValue={`${dashboardData.vendas.totalTransacoes} transações`}
                icon="graph-up-arrow"
                color="[#9D4E92]"
                bg="[#e8c5f1]"
                text="[#9D4E92]"
                text2="[#4F6940]"
                trend={dashboardData.vendas.trend}
              />
              <MetricCard
                title="Produtos Vendidos"
                value={dashboardData.produtos.vendidos}
                icon="box-seam"
                color="[#4f6940]"
                bg="[#9bf377]"
                text="[#4f6940]"
              />
              <MetricCard
                title="Contas a Pagar (Total)"
                // Usando o dado exclusivo do controller Admin
                value={formatCurrency(dashboardData.fluxoCaixa.contasPendentes)}
                icon="wallet2"
                color="[#9D4E92]"
                bg="[#F1B8E8]"
                text="[#9D4E92]"
              />
              <MetricCard
                title="Equipe Ativa"
                value={dashboardData.vendedores.ativos}
                subValue="Vendedores na rede"
                icon="people-fill"
                color="[#4F6940]"
                bg="[#c5ffad]"
                text="[#4F6940]"
                text2="[#4F6940]"
              />
            </div>

            {/* Seção Exclusiva Admin: Ranking de Lojas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Ranking das Lojas */}
              <div className="lg:col-span-2 bg-[#C5FFAD] rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#76196c] flex items-center gap-3">
                    <i className="bi bi-shop text-2xl"></i> Desempenho por Filial
                  </h3>
                  <Link href="/admin/relatorios" className="text-sm text-[#76196c] hover:underline font-medium flex gap-2">
                    Ver relatório completo
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right-icon lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#75BA51] text-left">
                        <th className="pb-3 text-sm font-semibold text-[#4F6940]">Filial</th>
                        <th className="pb-3 text-sm font-semibold text-[#4F6940] text-center">Vendas</th>
                        <th className="pb-3 text-sm font-semibold text-[#4F6940] text-center">Faturamento</th>
                        <th className="pb-3 text-sm font-semibold text-[#4F6940] text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#75BA51]">
                      {dashboardData.rankingLojas && dashboardData.rankingLojas.length > 0 ? (
                        dashboardData.rankingLojas.map((loja, index) => (
                          <tr key={index} className="hover:bg-purple-50/50 transition-colors">
                            <td className="py-3 font-medium text-[#76196C] flex items-center gap-2">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-[#CAF4B7] ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-gray-200 text-[#76196C]'}`}>
                                {index + 1}
                              </span>
                              {loja.nome}
                            </td>
                            <td className="py-3 text-center text-[#76196C]">{loja.totalVendas}</td>
                            <td className="py-3 text-center font-bold text-[#569a33]">{formatCurrency(loja.valorTotal)}</td>
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
                      <h4 className="text-2xl font-bold text-[#C5FFAD]">{dashboardData.vendedores.melhorVendedor}</h4>
                      <p className="text-sm opacity-90 mt-1">
                        Responsável por <span className="font-bold">{dashboardData.vendedores.vendasMelhorVendedor} vendas</span>
                      </p>
                    </div>
                    <i className="bi bi-trophy-fill text-3xl text-yellow-400"></i>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
                    <span className="text-sm text-[#C5FFAD]">Total gerado:</span>
                    <span className="font-bold text-lg text-[#4EA912]">{formatCurrency(dashboardData.vendedores.valorMelhorVendedor)}</span>
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
                  <p className="text-sm text-[#4F6940] mb-3">
                    {dashboardData.produtos.baixoEstoque > 0
                      ? `Existem ${dashboardData.produtos.baixoEstoque} produtos críticos na rede.`
                      : 'Todos os níveis de estoque estão saudáveis.'}
                  </p>
                  {/* {dashboardData.produtos.baixoEstoque > 0 && (
                        <Link href="/admin/alertas" className="text-sm font-semibold text-orange-700 hover:text-orange-900 underline">
                            Resolver agora
                        </Link>
                    )} */}
                </div>
              </div>

            </div>

            {/* Ações Rápidas - Links ajustados para Admin */}
            <div>
              <div className="flex gap-2 items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#569A33] lucide lucide-settings-icon lucide-settings"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" /><circle cx="12" cy="12" r="3" /></svg>
                <h2 className="text-2xl font-bold text-[#76196c]">
                  Gestão Rápida
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <QuickActionCard
                  title="Nova Loja"
                  description="Cadastrar filial"
                  icon="shop"
                  href="/admin/lojas/cadastrar"
                  color="[#4F6940]"
                />
                <QuickActionCard
                  title="Produtos"
                  description="Catálogo global"
                  icon="box-seam"
                  href="/admin/produtos"
                  color="[#4F6940]"
                />
                <QuickActionCard
                  title="Financeiro"
                  description="Contas e Fluxo"
                  icon="cash-coin"
                  href="/admin/financeiro"
                  color="[#4F6940]"
                />
                <QuickActionCard
                  title="Relatórios"
                  description="Análise completa"
                  icon="file-text"
                  href="/admin/relatorios"
                  color="[#4F6940]"
                />
              </div>
            </div>

            {/* Fluxo de Caixa Consolidado */}
            <div className="bg-[#edd5f2] rounded-xl border-3 border-dashed border-[#8F3D84] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#8F3D84] flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-landmark-icon lucide-landmark"><path d="M10 18v-7" /><path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z" /><path d="M14 18v-7" /><path d="M18 18v-7" /><path d="M3 22h18" /><path d="M6 18v-7" /></svg> Fluxo de Caixa Consolidado
                </h3>
                <span className="text-sm bg-[#C5FFAD] text-[#8F3D84] px-3 py-1 rounded-full font-medium">Rede Inteira</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col p-4 bg-[#98d378] rounded-xl">
                  <span className="text-sm font-semibold text-[#4F6940] mb-1">Entradas (Vendas)</span>
                  <span className="text-2xl font-bold text-[#4F6940]">{formatCurrency(dashboardData.fluxoCaixa.entradas)}</span>
                </div>
                <div className="flex flex-col p-4 bg-[#F1B8E8] rounded-xl">
                  <span className="text-sm font-semibold text-[#B21212] mb-1">Saídas (Despesas)</span>
                  <span className="text-2xl font-bold text-[#B21212]">{formatCurrency(dashboardData.fluxoCaixa.saidas)}</span>
                </div>
                <div className="flex flex-col p-4 bg-[#D1A7CD] rounded-xl">
                  <span className="text-sm font-semibold text-[#76196C] mb-1">Saldo Líquido</span>
                  <span className="text-2xl font-bold text-[#76196C]">{formatCurrency(dashboardData.fluxoCaixa.saldo)}</span>
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
          </div>
        )}
      </div>
    </div>
  );
}