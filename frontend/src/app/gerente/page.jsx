"use client";

import { useState, useEffect } from "react";
import { getCookie } from "cookies-next/client";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  AlertTriangle,
  BarChart,
  BarChart2,
  BarChart3,
  BarChart3Icon,
  BarChartIcon,
  Trophy,
} from "lucide-react";

// Componente de Card de Métrica
function MetricCard({ title, value, icon, color, trend, bg, text }) {
  return (
    <div
      className={`bg-${bg} rounded-xl border-${color} p-6 shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-semibold text-${text} mb-1`}>{title}</p>
          <p className={`text-3xl font-bold text-${color} mb-2`}>{value}</p>
          {trend && (
            <div className="flex flex-wrap  items-center gap-1 text-sm">
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
              <span className="text-[#4F6940]">vs período anterior</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg`}>
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
            className="bg-[#C5FFAD] rounded-xl border-2 border-gray-200 p-6 h-32"
          ></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-[#C5FFAD] rounded-xl border-2 border-gray-200 p-6 h-64"
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
          className={` p-3 rounded-lg group-hover:bg-${color}/20 transition-colors`}
        >
          <i className={`bi bi-${icon} text-2xl text-${color}`}></i>
        </div>
        <div className="flex-1">
          <h3 className={`font-bold text-lg text-${color} mb-1`}>{title}</h3>
          <p className="text-sm text-[#4F6940]">{description}</p>
        </div>
        <i className="bi bi-chevron-right text-xl text-[#4F6940] group-hover:text-[#569A33]"></i>
      </div>
    </Link>
  );
}

export default function GerenteDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [nomeFilial, setNomeFilial] = useState("");
  const [nomeGerente, setNomeGerente] = useState("");
  const [periodo, setPeriodo] = useState("mes");
  const [erro, setErro] = useState(null);

  const periodos = [
    { value: "hoje", label: "Hoje" },
    { value: "semana", label: "Semana" },
    { value: "mes", label: "Mês" }, // label com acento, value sem acento
    { value: "ano", label: "Ano" },
  ];

  useEffect(() => {
    const nome = getCookie("nome");
    const empresa = getCookie("empresa_nome");
    setNomeGerente(nome || "Gerente");
    setNomeFilial(empresa || "Filial");
  }, []);

  useEffect(() => {
    const buscarDados = async () => {
      setLoading(true);
      setErro(null);

      try {
        const response = await fetch(
          `http://localhost:8080/gerente/dashboard?periodo=${periodo}`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.status === 403) {
          window.location.href = "/forbidden";
          return;
        }

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Dashboard data:", data);
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
    <>
      <div className="min-h-screen p-5 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-[#76196c] flex items-center gap-2">
                  <SidebarTrigger /> Dashboard - {nomeFilial}
                </h1>
              </div>
              <p className="text-lg text-[#8c3e82]">
                Bem-vindo, <span className="font-semibold">{nomeGerente}</span>!
              </p>
            </div>

            {/* Filtro de período */}
            <div className="flex gap-2 bg-[#EBC7F5] rounded-xl p-1 border-3">
              {periodos.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPeriodo(p.value)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${periodo === p.value
                    ? "bg-[#76196c]/70 text-[#C5FFAD]"
                    : "text-[#76196c] hover:bg-[#C97FDA]/50"
                    }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Erro */}
          {erro && (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
              <div className="flex items-center gap-2 text-red-700">
                <i className="bi bi-exclamation-triangle text-xl"></i>
                <p className="font-semibold">
                  Erro ao carregar dashboard: {erro}
                </p>
              </div>
            </div>
          )}

          {loading ? (
            <DashboardSkeleton />
          ) : dashboardData ? (
            <>
              {/* Métricas principais */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <MetricCard
                  title="Vendas do Período"
                  value={dashboardData.vendas.total}
                  icon="graph-up-arrow"
                  color="[#9D4E92]"
                  bg="[#e8c5f1]"
                  text="[#9D4E92]"
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
                  title="Estoque Baixo"
                  value={dashboardData.produtos.baixoEstoque}
                  icon="exclamation-triangle"
                  color="[#9D4E92]"
                  bg="[#F1B8E8]"
                  text="[#9D4E92]"
                />
                <MetricCard
                  title="Vendedores Ativos"
                  value={dashboardData.vendedores.ativos}
                  icon="people"
                  color="[#4f6940]"
                  bg="[#c5ffad]"
                  text="[#4f6940]"
                />
              </div>

              {/* Ações Rápidas */}
              <div>
                <div className="flex gap-2 items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#569A33] lucide lucide-blocks-icon lucide-blocks"><path d="M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2" /><rect x="14" y="2" width="8" height="8" rx="1" /></svg>
                  <h2 className="text-2xl font-bold text-[#76196c]">
                    Ações Rápidas
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
                  <QuickActionCard
                    title="Produtos"
                    description="Gerenciar catálogo e descontos"
                    icon="box-seam"
                    href="/gerente/produtos"
                    color="[#4F6940]"
                  />
                  <QuickActionCard
                    title="Vendedores"
                    description="Gerenciar equipe de vendas"
                    icon="people"
                    href="/gerente/vendedores"
                    color="[#4F6940]"
                  />
                  <QuickActionCard
                    title="Vendas"
                    description="Gerenciar vendas"
                    icon="cart"
                    href="/gerente/vendas"
                    color="[#4F6940]"
                  />
                  <QuickActionCard
                    title="Financeiro"
                    description="Fluxo de caixa e despesas"
                    icon="cash-coin"
                    href="/gerente/financeiro"
                    color="[#4F6940]"
                  />
                  <QuickActionCard
                    title="Relatórios"
                    description="Gerar relatórios e análises"
                    icon="file-earmark-bar-graph"
                    href="/gerente/relatorios"
                    color="[#4F6940]"
                  />
                  <QuickActionCard
                    title="Alertas"
                    description="Produtos com estoque baixo"
                    icon="bell"
                    href="/gerente/alertas"
                    color="[#4F6940]"
                  />
                </div>
              </div>

              {/* Fluxo de Caixa e Alertas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Fluxo de Caixa */}
                <div className="bg-[#EDD5F2]/80 rounded-xl pt-6 px-6 pb-20 flex flex-col relative overflow-visible rounded-xl border-3 border-dashed border-[#8F3D84]">
                  {/* Título */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#8F3D84] flex items-center gap-2">
                      Fluxo de Caixa
                    </h3>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#8F3D84] lucide lucide-hand-coins-icon lucide-hand-coins"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" /><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" /><path d="m2 16 6 6" /><circle cx="16" cy="9" r="2.9" /><circle cx="6" cy="5" r="3" /></svg>
                  </div>

                  {/* Conteúdo */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-[#98d378] rounded-lg">
                      <span className="font-semibold text-[#4F6940]">
                        Entradas
                      </span>
                      <span className="text-lg font-bold text-[#4F6940]">
                        {dashboardData.fluxoCaixa.entradas}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-[#F1B8E8] rounded-lg">
                      <span className="font-semibold text-[#B21212]">
                        Saídas
                      </span>
                      <span className="text-lg font-bold text-[#B21212]">
                        {dashboardData.fluxoCaixa.saidas}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-[#D1A7CD] rounded-lg">
                      <span className="font-bold text-[#76196C]">Saldo</span>
                      <span className="text-xl font-bold text-[#76196C]">
                        {dashboardData.fluxoCaixa.saldo}
                      </span>
                    </div>
                  </div>

                  {/* IMAGEM SOBREPOSTA */}
                  <img
                    src="/img/gerente_dashboard/gerente_dashboard/gerente_dashboardCriancas.png"
                    className="hidden lg:block w-70 sm:w-48 md:w-130 absolute left-1/2 -translate-x-1/2 bottom-[-14px] pointer-events-none"
                  />
                </div>

                {/* Melhor Vendedor e Destaques */}
                <div className="bg-[#CAF4B7] rounded-xl p-6 bg-[#EDD5F2]/80 rounded-xl border-3 border-dashed border-[#8F3D84]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#76196c]">
                      Destaques
                    </h3>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#8F3D84] lucide lucide-trophy-icon lucide-trophy"><path d="M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978" /><path d="M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978" /><path d="M18 9h1.5a1 1 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z" /><path d="M6 9H4.5a1 1 0 0 1 0-5H6" /></svg>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-[#98D378] rounded-lg">
                      <p className="text-sm text-[#8c3e82] mb-1 flex items-center gap-1">
                        <Trophy color="#76196c" /> Melhor Vendedor do Período
                      </p>
                      <p className="text-xl font-bold text-[#4F6A50]">
                        {dashboardData.vendedores.melhorVendedor}
                      </p>
                      <p className="text-sm text-[#4F6A50] mt-1">
                        {dashboardData.vendedores.vendasMelhorVendedor} vendas •
                        R${" "}
                        {dashboardData.vendedores.valorMelhorVendedor
                          .toFixed(2)
                          .replace(".", ",")}
                      </p>
                    </div>

                    <div className="p-4 bg-[#D1A7CD] rounded-lg">
                      <p className="text-sm text-[#76196C] mb-1 flex items-center gap-1">
                        <BarChart3Icon color="#76196C" /> Total de Transações
                      </p>
                      <p className="text-xl font-bold text-[#a10f92ff]">
                        {dashboardData.vendas.totalTransacoes} vendas
                      </p>
                      <p className="text-sm text-[#76196C] mt-1">
                        {dashboardData.produtos.vendidos} produtos vendidos
                      </p>
                    </div>
                    {dashboardData.produtos.baixoEstoque > 0 && (
                      <div className="p-4 bg-[#F1B8E8] rounded-lg">
                        <p className="text-sm text-[#B21212] mb-1 flex items-center gap-1">
                          <AlertTriangle color="#B21212" /> Atenção
                        </p>
                        <p className="text-base font-semibold text-[#B21212]">
                          {dashboardData.produtos.baixoEstoque} produtos com
                          estoque baixo
                        </p>
                        <Link
                          href="/gerente/alertas"
                          className="text-sm text-[#B21212] hover:text-orange-800 mt-1 inline-block transition-all duration-300 ease-out cursor-pointer hover:scale-[0.97]"
                        >
                          Ver detalhes →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Estatísticas Adicionais */}
              <div className="bg-[#C4EAB2] rounded-xl border-3 border-dashed border-[#75BA51] p-6">
                <div className="flex justify-between">
                  <h3 className="text-xl font-bold text-[#4F6A50] mb-4">
                    Pagamentos do Período
                  </h3>

                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class=" text-[#4F6A50] lucide lucide-piggy-bank-icon lucide-piggy-bank"><path d="M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z" /><path d="M16 10h.01" /><path d="M2 8v1a2 2 0 0 0 2 2h1" /></svg>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-r from-[#89BA75] to-[#6B935A] rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#C5FFAD] mb-1">PIX</p>
                        <p className="text-2xl font-bold text-[#C5FFAD]">
                          R${" "}
                          {dashboardData.vendas.porTipoPagamento.pix
                            .toFixed(2)
                            .replace(".", ",")}
                        </p>
                      </div>
                      <i className="bi bi-qr-code text-3xl text-[#C5FFAD]"></i>
                    </div>
                  </div>

                  <div className="p-4 bg-[#6b935a] rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#C5FFAD] mb-1">Dinheiro</p>
                        <p className="text-2xl font-bold text-[#C5FFAD]">
                          R${" "}
                          {dashboardData.vendas.porTipoPagamento.dinheiro
                            .toFixed(2)
                            .replace(".", ",")}
                        </p>
                      </div>
                      <i className="bi bi-cash-coin text-3xl text-[#C5FFAD]"></i>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-[#6B935A] to-[#5c7c4d] rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#C5FFAD] mb-1">Cartão</p>
                        <p className="text-2xl font-bold text-[#C5FFAD]">
                          R${" "}
                          {dashboardData.vendas.porTipoPagamento.cartao
                            .toFixed(2)
                            .replace(".", ",")}
                        </p>
                      </div>
                      <i className="bi bi-credit-card text-3xl text-[#C5FFAD]"></i>
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
            </div>
          )}
        </div>
      </div>
    </>
  );
}