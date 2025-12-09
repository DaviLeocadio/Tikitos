"use client";

import { useState, useEffect } from "react";
import { getCookie } from "cookies-next/client";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";

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
      className={` rounded-xl border-1 border-${color} p-5 hover:scale-[1.02] transition-all duration-200 cursor-pointer group`}
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
    <div className="min-h-screen bg-gradient-to-br from-[#DDF1D4] to-verdeclaro p-5 lg:p-8">
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
          <div className="flex gap-2 bg-[#C97FDA] rounded-xl p-1 shadow-sm">
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
                    ? "bg-[#76196c] text-[#9BF377] shadow-md"
                    : "text-[#76196c] hover:bg-[#EBC7F5]"
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
                value={dashboardData.vendas.total}
                subValue={`${dashboardData.vendas.totalTransacoes} transações`}
                icon="graph-up-arrow"
                color="[#4EA912]"
                bg="[#92EF6C]"
                text="[#4EA912]"
                text2="[#4EA912]"
                trend={dashboardData.vendas.trend}
              />
              <MetricCard
                title="Contas a Pagar (Total)"
                // Usando o dado exclusivo do controller Admin
                value={dashboardData.fluxoCaixa.contasPendentes || "R$ 0,00"}
                icon="wallet2"
                color="[#9D4E92]"
                bg="[#F1B8E8]"
                text="[#9D4E92]"
              />
              <MetricCard
                title="Produtos Vendidos"
                value={dashboardData.produtos.vendidos}
                icon="box-seam"
                color="[#76196C]"
                bg="[#C97FDA]"
                text="[#76196C]"
              />
              <MetricCard
                title="Equipe Ativa"
                value={dashboardData.vendedores.ativos}
                subValue="Vendedores na rede"
                icon="people-fill"
                color="[#4F6940]"
                bg="[#70B64C]"
                text="[#4F6940]"
                text2="[#4F6940]"
              />
            </div>

            {/* Seção Exclusiva Admin: Ranking de Lojas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Ranking das Lojas */}
              <div className="lg:col-span-2 bg-[#C5FFAD] rounded-xl p-6 shadow-sm">
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
                      <tr className="border-b border-[#75BA51] text-left">
                        <th className="pb-3 text-sm font-semibold text-[#4F6940]">Filial</th>
                        <th className="pb-3 text-sm font-semibold text-[#4F6940] text-right">Vendas</th>
                        <th className="pb-3 text-sm font-semibold text-[#4F6940] text-right">Faturamento</th>
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
                            <td className="py-3 text-right text-[#76196C]">{loja.totalVendas}</td>
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
                      <h4 className="text-2xl font-bold text-[#C5FFAD]">{dashboardData.vendedores.melhorVendedor}</h4>
                      <p className="text-sm opacity-90 mt-1">
                        Responsável por <span className="font-bold">{dashboardData.vendedores.vendasMelhorVendedor} vendas</span>
                      </p>
                    </div>
                    <i className="bi bi-trophy-fill text-3xl text-yellow-400"></i>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
                    <span className="text-sm text-[#C5FFAD]">Total gerado:</span>
                    <span className="font-bold text-lg text-[#4EA912]">R$ {dashboardData.vendedores.valorMelhorVendedor.toFixed(2).replace('.', ',')}</span>
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
              <h2 className="text-2xl font-bold text-[#76196c] mb-4 mt-2">
                Gestão Rápida
              </h2>
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
            <div className="bg-[#E5B8F1] rounded-xl border-3 border-dashed border-[#8F3D84] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#8F3D84] flex items-center gap-2">
                  <i className="bi bi-bank text-2xl text-[#8F3D84]"></i> Fluxo de Caixa Consolidado
                </h3>
                <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">Rede Inteira</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col p-4 bg-[#75BA51] rounded-xl">
                  <span className="text-sm font-semibold text-[#C5FFAD] mb-1">Entradas (Vendas)</span>
                  <span className="text-2xl font-bold text-[#C5FFAD]">{dashboardData.fluxoCaixa.entradas}</span>
                </div>
                <div className="flex flex-col p-4 bg-red-300 rounded-xl">
                  <span className="text-sm font-semibold text-[#B21212] mb-1">Saídas (Despesas)</span>
                  <span className="text-2xl font-bold text-[#B21212]">{dashboardData.fluxoCaixa.saidas}</span>
                </div>
                <div className="flex flex-col p-4 bg-[#92EF6C] rounded-xl">
                  <span className="text-sm font-bold text-[#4F6940] mb-1">Saldo Líquido</span>
                  <span className="text-2xl font-black text-[#4F6940]">{dashboardData.fluxoCaixa.saldo}</span>
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