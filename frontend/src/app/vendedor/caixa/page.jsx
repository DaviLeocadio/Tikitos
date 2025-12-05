"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import CardSuporte from "@/components/cardSuporte/CardSuporte.jsx";

import {
  Calculator,
  Clock,
  AlertTriangle,
  Package,
  TrendingUp,
  Timer,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getCookie } from "cookies-next";

export default function DashboardResumo() {
  const [resumo, setResumo] = useState(null);
  const [vendasSemana, setVendasSemana] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function fetchResumo() {
      setCarregando(true);
      try {
        const caixaId = getCookie("idCaixa");

        const res = await fetch(
          `http://localhost:8080/vendedor/caixa/${caixaId}/resumo`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await res.json();

        setResumo(data);

        const grafico = gerarDadosGrafico(
          data.vendasSemana,
          data.vendasSemanaPassada
        );

        setVendasSemana(grafico);
      } catch (error) {
        console.error("Erro ao carregar resumo:", error);
      } finally {
        setCarregando(false);
      }
    }

    fetchResumo();
  }, []);

  function gerarDadosGrafico(semanaAtual, semanaPassada) {
    const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    const mapAtual = {};
    const mapPassada = {};

    semanaAtual.forEach((d) => {
      mapAtual[d.dia] = d.vendas;
    });
    semanaPassada.forEach((d) => {
      mapPassada[d.dia] = d.vendas;
    });

    const resultado = dias.map((dia) => ({
      name: dia,
      atual: mapAtual[dia] ?? 0,
      passada: mapPassada[dia] ?? 0,
    }));

    return resultado;
  }

  if (carregando || !resumo)
    return <p className="p-10 text-3xl text-roxo">Carregando...</p>;

  return (
    <div className="max-w-7xl mx-auto">
      {/* MENU DA SIDEBAR */}
      <div className="grid gap-5 grid-cols-1 md:grid-cols-1">
        <div className="flex  p-8 pb-0 justify-between">
          <div className="flex !items-start">
            <SidebarTrigger />
          </div>
          <div className="flex items-center">
            {/* IMAGEM */}
            <img
              src="/img/configuracoes/titulo_historico.png"
              className="w-full items-center h-40 flex justify-center"
              alt="Título Histórico"
            />
          </div>
          <div className="flex items-center min-w-1/2 w-3/5">
            {/* GRÁFICO */}
            <div className="w-full h-[260px] md:h-full items-end rounded-xl px-4 bg-[#DDF1D4]">
              <div className="flex justify-between ps-8 pe-3">
                <h1 className="text-[20px] font-bold text-[#9D4E92]">
                  Registro de vendas:
                </h1>
                <div className="flex justify-between w-[45%]">
                  <div className="flex gap-2">
                    <i className="bi bi-circle-fill text-[#4C8E37]"></i>
                    <p className="text-sm">Semana Atual</p>
                  </div>
                  <div className="flex gap-2">
                    <i className="bi bi-circle-fill text-[#D8A8E5]"></i>
                    <p className="text-sm">Semana Passada</p>
                  </div>
                </div>
              </div>

              <ResponsiveContainer
                width="99%"
                height="85%"
                className="flex justify-center items-center"
              >
                <LineChart
                  data={vendasSemana}
                  margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                >
                  <CartesianGrid stroke="#D9EBD1" strokeWidth={1} />

                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#415932", fontSize: 15 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{ fill: "#415932", fontSize: 14 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip cursor={false} />

                  {/* Semana atual */}
                  <Line
                    type="monotone"
                    dataKey="atual"
                    stroke="#4C8E37"
                    strokeWidth={4}
                    dot={{ r: 5, fill: "#4C8E37" }}
                    name="Semana atual"
                  />

                  {/* Semana passada */}
                  <Line
                    type="monotone"
                    dataKey="passada"
                    stroke="#D8A8E5"
                    strokeWidth={4}
                    dot={{ r: 5, fill: "#D8A8E5" }}
                    name="Semana passada"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* GRID DOS CARDS */}
      <div>
        <div className="p-3 md:p-6">
          <div className="max-w-6xl mx-auto">
            {/* --- CARDS PRINCIPAIS --- */}
            <div className="flex flex-col lg:flex-row w-full gap-4 mt-[-1%]">
              {/* Fechamento do Caixa */}
              <div
                className="w-full lg:w-1/4 bg-[#EBC7F5] border-2 border-dashed border-[#b478ab]
                        rounded-2xl p-4 shadow"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#8B3CA6]">
                      <span className="block text-[#569A33]">Fechamento</span>
                      <span className="block text-[#569A33]">de caixa</span>
                    </h3>
                    <img
                      src="/img/configuracoes/caixa_icon.png"
                      className="w-8 h-7 ml-auto"
                      alt=""
                    />
                  </div>

                  <div className="flex flex-col gap-5">
                    <div>
                      <p className="text-2xl font-bold text-[#934788]">
                        Total:
                      </p>
                      <p className="text-xl font-black text-[#75BA51]">
                        R$ {resumo.totalCaixa?.toFixed(2).replace(".", ",")}
                      </p>
                    </div>

                    <div>
                      <p className="text-2xl font-bold text-[#934788]">
                        Produtos
                      </p>
                      <p className="text-xl font-black text-[#75BA51]">
                        {resumo.totalProdutos} vendidos
                      </p>
                    </div>

                    <div>
                      <p className="text-2xl font-bold text-[#934788]">Caixa</p>
                      <p className="text-xl font-black text-[#75BA51]">
                        R$ {resumo.valorCaixa.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cards da direita */}
              <div className="w-full lg:w-3/4 flex flex-col gap-4">
                {/* LINHA 1 */}
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Categoria mais vendida */}
                  <div
                    className="w-full md:w-1/3 bg-[#c5ffad] border-2 border-dashed border-[#b478ab]
                            rounded-2xl p-4 shadow"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-[#4F6940]">
                        <span className="block text-[#569A33]">Categoria</span>
                        <span className="block text-[#569A33]">
                          mais vendida
                        </span>
                      </h3>
                      <img
                        src="/img/configuracoes/categoria_icon.png"
                        className="w-9 h-6 ml-auto"
                        alt=""
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-5xl font-black text-[#934788]">
                        N°{resumo.categoriaMaisVendida?.numero}
                      </p>
                      <p className="text-xl font-bold text-[#76196c]">
                        {resumo.categoriaMaisVendida?.nome}
                      </p>
                    </div>
                  </div>

                  {/* Horário de mais vendas */}
                  <div
                    className="w-full md:w-1/3 bg-[#EBC7F5] border-2 border-dashed border-[#b478ab]
                            rounded-2xl p-4 shadow"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-[#8B3CA6]">
                        <span className="block text-[#569A33]">
                          Horários de
                        </span>
                        <span className="block text-[#569A33]">
                          mais vendas
                        </span>
                      </h3>
                      <img
                        src="/img/configuracoes/horario_icon.png"
                        className="w-7 h-7 ml-auto"
                        alt=""
                      />
                    </div>

                    <p className="text-5xl font-black text-[#934788]">
                      {resumo.horarioMaisVendas}
                    </p>
                  </div>

                  {/* Alerta Estoque */}
                  <div
                    className="w-full md:w-1/3 bg-[#dbdfe4] border-2 border-dashed border-[#b478ab]
                            rounded-2xl p-4 shadow"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-[#4F6940]">
                        <span className="block text-[#569A33]">Alerta nos</span>
                        <span className="block text-[#569A33]">estoques</span>
                      </h3>
                      <img
                        src="/img/configuracoes/alerta_icon.png"
                        className="w-7 h-7 ml-auto"
                        alt=""
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-6xl font-black text-[#934788] leading-none">
                        {resumo.alertaEstoque?.toString().padStart(2, "0")}
                      </p>
                      <p className="text-sm font-bold text-[#76196c] leading-tight">
                        Produtos em nível crítico
                      </p>
                    </div>
                  </div>
                </div>

                {/* LINHA 2 */}
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Produtos em promoção */}
                  <div
                    className="w-full md:w-1/3 bg-[#dbdfe4] border-2 border-dashed border-[#b478ab]
                            rounded-2xl p-4 shadow"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-[#4F6940]">
                        <span className="block text-[#569A33]">
                          Produtos em
                        </span>
                        <span className="block text-[#569A33]">promoção</span>
                      </h3>
                      <img
                        src="/img/configuracoes/promocao_icon.png"
                        className="w-7 h-9 ml-auto"
                        alt=""
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-5xl font-black text-[#934788] text-center">
                        {resumo.produtosPromocao}
                      </p>
                      <p className="text-sm font-bold text-[#76196c] leading-tight">
                        Produtos promocionais
                      </p>
                    </div>
                  </div>

                  {/* Histórico */}
                  <div
                    className="w-full md:w-2/3 bg-[#caf4b7] border-2 border-dashed border-[#b478ab]
                            rounded-2xl p-4 shadow"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-[#4F6940]">
                        <span className="block text-[#569A33]">
                          Histórico do dia
                        </span>
                        <span className="block text-[#569A33]">
                          (Registro de compras)
                        </span>
                      </h3>
                      <img
                        src="/img/configuracoes/historico_icon.png"
                        className="w-7 h-8 ml-auto"
                        alt=""
                      />
                    </div>

                    <div className="w-full bg-[#92ef6c] h-[24%] rounded-lg">
                      <div className="space-y-2 max-h-[12vh] overflow-y-scroll p-1">
                        {resumo.historicoCompras?.map((h, i) => (
                          <div
                            key={i}
                            className="bg-[#9BF377] border-2 border-[#4F6940]
                                            rounded-xl p-3 flex items-center justify-between"
                          >
                            <p className="text-lg font-bold text-[#4F6940]">
                              {h.produtos.toString().padStart(2, "0")} Produtos
                            </p>
                            <p className="text-xl font-black text-[#8B3CA6]">
                              R${h.valor.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
