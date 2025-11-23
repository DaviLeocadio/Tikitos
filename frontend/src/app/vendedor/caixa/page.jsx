"use client";

import React, { useState, useEffect } from "react";
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
    <div className="min-h-screen bg-[#F3FFE8] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Título + Gráfico */}
        <div className="w-full flex flex-col lg:flex-row lg:h-auto gap-6">
          
          {/* Título */}
          <h1
            className="text-5xl md:text-6xl lg:text-6xl font-black leading-none flex flex-col 
                       text-center lg:text-left lg:w-1/4"
            style={{
              color: "#8B3CA6",
              textShadow: "3px 3px 0px #ffffff",
            }}
          >
            <span>controle</span>
            <span>de ponto</span>
          </h1>

          {/* GRÁFICO */}
          <div className="bg-[#F0FFE7] border-4 border-dashed border-[#C57ED9] rounded-3xl p-6 shadow-md 
                          w-full lg:w-3/4">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={vendasSemana}>
                <XAxis dataKey="dia" stroke="#6B166D" />
                <YAxis stroke="#6B166D" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rosa"
                  stroke="#E9A9F5"
                  strokeWidth={4}
                  dot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="verde"
                  stroke="#75BA51"
                  strokeWidth={4}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- CARDS PRINCIPAIS --- */}
        <div className="flex flex-col lg:flex-row w-full gap-6 mt-6">

          {/* Fechamento do Caixa */}
          <div className="w-full lg:w-1/4 bg-[#FAD9FF] border-4 border-dashed border-[#C57ED9] 
                          rounded-3xl p-6 shadow-md">
            <div className="flex flex-col justify-between h-full gap-6">
              
              <div className="flex items-center gap-3">
                <Calculator className="text-[#c564e6] w-8 h-8" />
                <h3 className="text-xl font-bold text-[#8B3CA6] leading-tight">
                  Fechamento<br />de caixa
                </h3>
              </div>

              <div>
                <p className="text-5xl font-bold text-[#8B3CA6]">Total:</p>
                <p className="text-3xl font-black text-[#75BA51]">
                  R$ {resumo.totalCaixa.toFixed(2).replace(".", ",")}
                </p>
              </div>

              <div>
                <p className="text-4xl font-bold text-[#8B3CA6]">Produtos</p>
                <p className="text-2xl font-black text-[#75BA51]">
                  {resumo.totalProdutos} vendidos
                </p>
              </div>

              <div>
                <p className="text-4xl font-bold text-[#8B3CA6]">Caixa</p>
                <p className="text-2xl font-black text-[#75BA51]">
                  R$ {resumo.valorCaixa.toFixed(2).replace(".", ",")}
                </p>
              </div>

            </div>
          </div>

          {/* Cards da direita */}
          <div className="w-full lg:w-3/4 flex flex-col gap-6">

            {/* LINHA 1 */}
            <div className="flex flex-col md:flex-row gap-6">

              {/* Categoria mais vendida */}
              <div className="w-full md:w-1/3 bg-[#E1FFD2] border-4 border-dashed border-[#8FD671] 
                              rounded-3xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <Package className="text-[#4F6940] w-8 h-8" />
                  <h3 className="text-xl font-bold text-[#4F6940] leading-tight">
                    Categoria<br />mais vendida
                  </h3>
                </div>
                <p className="text-6xl md:text-7xl font-black text-[#4F6940]">
                  N°{resumo.categoriaMaisVendida.numero}
                </p>
                <p className="text-3xl font-bold text-[#4F6940]">
                  {resumo.categoriaMaisVendida.nome}
                </p>
              </div>

              {/* Horário de mais vendas */}
              <div className="w-full md:w-1/3 bg-[#FAD9FF] border-4 border-dashed border-[#C57ED9] 
                              rounded-3xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="text-[#8B3CA6] w-8 h-8" />
                  <h3 className="text-xl font-bold text-[#8B3CA6] leading-tight">
                    Horários de<br />mais vendas
                  </h3>
                </div>
                <p className="text-6xl md:text-8xl font-black text-[#8B3CA6] mt-6">
                  {resumo.horarioMaisVendas}
                </p>
              </div>

              {/* Alerta Estoque */}
              <div className="w-full md:w-1/3 bg-[#E1FFD2] border-4 border-dashed border-[#8FD671] 
                              rounded-3xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="text-[#4F6940] w-8 h-8" />
                  <h3 className="text-xl font-bold text-[#4F6940] leading-tight">
                    Alerta nos<br />estoques
                  </h3>
                </div>
                <p className="text-7xl md:text-8xl font-black text-[#4F6940]">
                  {resumo.alertaEstoque.toString().padStart(2, "0")}
                </p>
                <p className="text-xl font-bold text-[#4F6940] mt-2 text-center">
                  Produtos em nível crítico
                </p>
              </div>

            </div>

            {/* LINHA 2 */}
            <div className="flex flex-col md:flex-row gap-6">

              {/* Produtos em promoção */}
              <div className="w-full md:w-1/3 bg-[#E1FFD2] border-4 border-dashed border-[#8FD671] 
                              rounded-3xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="text-[#4F6940] w-8 h-8" />
                  <h3 className="text-xl font-bold text-[#4F6940] leading-tight">
                    Produtos em<br />promoção
                  </h3>
                </div>
                <p className="text-6xl md:text-8xl font-black text-[#4F6940] text-center">
                  {resumo.produtosPromocao}
                </p>
              </div>

              {/* Histórico */}
              <div className="w-full md:w-2/3 bg-[#E1FFD2] border-4 border-dashed border-[#8FD671] 
                              rounded-3xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <Timer className="text-[#4F6940] w-8 h-8" />
                  <h3 className="text-xl font-bold text-[#4F6940] leading-tight">
                    Histórico do dia<br />(Registro de compras)
                  </h3>
                </div>

                <div className="space-y-3">
                  {resumo.historicoCompras.map((h, i) => (
                    <div
                      key={i}
                      className="bg-[#9BF377] border-4 border-[#4F6940] 
                                 rounded-2xl p-4 flex items-center justify-between"
                    >
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
  );
}
