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
  CartesianGrid
} from "recharts";
import { getCookie } from "cookies-next";

const data = [
  { name: "Seg", rosa: 18, verde: 5 },
  { name: "Ter", rosa: 27, verde: 6 },
  { name: "Qua", rosa: 23, verde: 15 },
  { name: "Qui", rosa: 35, verde: 35 },
  { name: "Sex", rosa: 36, verde: 42 },
];

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
        setVendasSemana(data.vendasSemana);
      } catch (error) {
        console.error("Erro ao carregar resumo:", error);
      } finally {
        setCarregando(false);
      }
    }

    fetchResumo();
  }, []);

  if (carregando || !resumo)
    return <p className="p-10 text-3xl text-roxo">Carregando...</p>;

  return (
    <>
      {/* MENU DA SIDEBAR */}
      <div className="grid gap-5 grid-cols-1 md:grid-cols-1">
        <div className="flex m-5 gap-2 items-center">
          <SidebarTrigger />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start w-full">

        {/* IMAGEM */}
        <img
          src="/img/configuracoes/titulo_historico.png"
          className="w-[60%] md:w-[35%] items-center p-6 md:p-15 flex justify-center"
          alt="Título Histórico"
        />

        {/* GRÁFICO */}
        <div className="w-full h-[260px] md:h-[320px] items-end rounded-xl p-4 md:p-6 bg-[#DDF1D4]">
          <ResponsiveContainer width="100%" height="90%">

            <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid stroke="#D9EBD1" strokeWidth={1} />
              <XAxis
                dataKey="name"
                tick={{ fill: "#415932", fontSize: 15 }}
                axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#415932", fontSize: 14 }} axisLine={false} tickLine={false} domain={[0, 50]} />
              <Tooltip cursor={false} /> <Line type="monotone" dataKey="rosa" stroke="#D8A8E5" strokeWidth={4} dot={{ r: 5, fill: "#D8A8E5" }} />
              <Line type="monotone" dataKey="verde" stroke="#4C8E37" strokeWidth={4} dot={{ r: 5, fill: "#4C8E37" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GRID DOS CARDS */}
      <div>
        <div className="min-h-screen p-4 md:p-8">
          <div className="max-w-6xl mx-auto">

            {/* --- CARDS PRINCIPAIS --- */}
            <div className="flex flex-col lg:flex-row w-full gap-6 mt-[-2%]">
              {/* Fechamento do Caixa */}
              <div
                className="w-full lg:w-1/4 bg-[#EBC7F5] border-3 border-dashed border-[#b478ab] 
                          rounded-3xl p-6 shadow-md">

                <div className="flex flex-col justify-start gap-6">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-[#8B3CA6] leading-tight">
                      <span className="block text-[#569A33]">Fechamento</span>
                      <span className="block text-[#569A33]">de caixa</span>
                    </h3>
                    <img src="/img/configuracoes/caixa_icon.png" className="w-10 h-9 ml-auto" alt="" />
                  </div>

                  <div className="flex flex-col gap-7 ">
                    <div>
                      <p className="text-4xl font-bold text-[#934788]">Total:</p>
                      <p className="text-2xl font-black text-[#75BA51]">
                        R$ {resumo.totalCaixa?.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                    <div>
                      <p className="text-4xl font-bold text-[#934788]">Produtos</p>
                      <p className="text-2xl font-black text-[#75BA51]">
                        {resumo.totalProdutos} vendidos
                      </p>
                    </div>
                    <div>
                      <p className="text-4xl font-bold text-[#934788]">Caixa</p>
                      <p className="text-2xl font-black text-[#75BA51]">
                        R$ {resumo.valorCaixa?.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Cards da direita */}
              <div className="w-full lg:w-3/4 flex flex-col gap-6">
                {/* LINHA 1 */}
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Categoria mais vendida */}
                  <div
                    className="w-full md:w-1/3 bg-[#c5ffad] border-3 border-dashed border-[#b478ab] 
                              rounded-3xl p-6 shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-[#4F6940] leading-tight">
                        <span className="block text-[#569A33]">Categoria</span>
                        <span className="block text-[#569A33]">mais vendida</span>
                      </h3>
                      <img src="/img/configuracoes/categoria_icon.png" className="w-12 h-7 ml-auto" alt="" />
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-6xl md:text-5xl font-black text-[#934788]">
                        N°{resumo.categoriaMaisVendida?.numero}1
                      </p>
                      <p className="text-2xl font-bold text-[#76196c]">
                        {resumo.categoriaMaisVendida?.nome} Pelúcia
                      </p>
                    </div>
                  </div>

                  {/* Horário de mais vendas */}
                  <div
                    className="w-full md:w-1/3 bg-[#EBC7F5] border-3 border-dashed border-[#b478ab] 
                              rounded-3xl p-6 shadow-md"
                  >
                    <div className="flex items-center gap-3 mb-3">

                      <h3 className="text-xl font-bold text-[#8B3CA6] leading-tight">
                        <span className="block text-[#569A33]">Horários de</span>
                        <span className="block text-[#569A33]">mais vendas</span>
                      </h3>

                      <img src="/img/configuracoes/horario_icon.png" className="w-8 h-8 ml-auto" alt="" />
                    </div>
                    <p className="text-6xl md:text-6xl font-black text-[#934788] ">
                      {resumo.horarioMaisVendas} 14h
                    </p>
                  </div>

                  {/* Alerta Estoque */}
                  <div
                    className="w-full md:w-1/3 bg-[#dbdfe4] border-3 border-dashed border-[#b478ab] 
                              rounded-3xl p-6 shadow-md"
                  >
                    <div className="flex items-center gap-3 mb-3">

                      <h3 className="text-xl font-bold text-[#4F6940] leading-tight">
                        <span className="block text-[#569A33]">Alerta nos</span>
                        <span className="block text-[#569A33]">estoques</span>
                      </h3>
                      <img src="/img/configuracoes/alerta_icon.png" className="w-9 h-8 ml-auto" alt="" />
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-7xl md:text-6xl font-black text-[#934788] leading-none">
                        {resumo.alertaEstoque?.toString().padStart(2, "0")} 00
                      </p>

                      <p className="text-md font-bold text-[#76196c] leading-tight">
                        Produtos em nível crítico
                      </p>
                    </div>
                  </div>
                </div>

                {/* LINHA 2 */}
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Produtos em promoção */}
                  <div
                    className="w-full md:w-1/3 bg-[#dbdfe4] border-3 border-dashed border-[#b478ab] 
                              rounded-3xl p-6 shadow-md"
                  >
                    <div className="flex items-center gap-3 mb-3">

                      <h3 className="text-xl font-bold text-[#4F6940] leading-tight">
                        <span className="block text-[#569A33]">Produtos em</span>
                        <span className="block text-[#569A33]">promoção</span>
                      </h3>
                      <img src="/img/configuracoes/promocao_icon.png" className="w-8 h-10 ml-auto" alt="" />
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-6xl md:text-6xl font-black text-[#934788] text-center">
                        {resumo.produtosPromocao}12
                      </p>

                      <p className="text-md font-bold text-[#76196c] leading-tight">
                        Produtos promocionais
                      </p>
                    </div>
                  </div>

                  {/* Histórico */}
                  <div
                    className="w-full md:w-2/3 aspect-2/1 bg-[#caf4b7] border-3 border-dashed border-[#b478ab] rounded-3xl p-6 shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-[#4F6940] leading-tight">
                        <span className="block text-[#569A33]">Histórico do dia</span>
                        <span className="block text-[#569A33]">(Registro de compras)</span>
                      </h3>
                      <img src="/img/configuracoes/historico_icon.png" className="w-8 h-9 ml-auto" alt="" />
                    </div>
                    <div className="w-[100%] bg-[#92ef6c] h-[30%] rounded-xl">
                    <div className="space-y-3 max-h-[13vh] overflow-y-scroll">
                      {resumo.historicoCompras?.map((h, i) => (
                        <div key={i} className="bg-[#9BF377] border-4 border-[#4F6940] rounded-2xl p-4 flex items-center justify-between">
                          <p className="text-xl md:text-2xl font-bold text-[#4F6940]">
                            {h.produtos.toString().padStart(2, "0")} Produtos
                          </p>
                          <p className="text-2xl md:text-3xl font-black text-[#8B3CA6]">
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

    </>
  );
}

