"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import LojaCard from "@/components/admin/lojas/LojaCard";
import MapaFiliais from "@/components/mapaFiliais/mapaFiliais";
import { SlideOpacity } from "@/components/carousel-10";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
const API_URL = "http://localhost:8080/admin/filiais";

export default function LojasContainer() {
  const [lojas, setLojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLojas();
  }, []);

  const fetchLojas = async (retries = 3) => {
    setLoading(true);
    setError(null);
    let lastError = null;

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

        const data = await response.json();

        if (data && Array.isArray(data.filiais)) {
          setLojas(data.filiais);
          setLoading(false);
          return;
        } else {
          throw new Error("Estrutura inesperada");
        }
      } catch (err) {
        lastError = err;
        if (i < retries - 1)
          await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, i)));
      }
    }

    setError(lastError?.message || "Erro ao carregar filiais");
    setLoading(false);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-10 flex flex-col items-center">
          <RefreshCw className="w-8 h-8 text-[#924187] animate-spin mb-3" />
          <p className="text-lg font-bold text-[#76196c]">
            Carregando filiais...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-10 p-6 bg-red-50 border-2 border-dashed border-red-300 rounded-2xl">
          <p className="text-xl font-bold text-red-700 mb-2">Erro</p>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => fetchLojas()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
          >
            Tentar Novamente
          </button>
        </div>
      );
    }

    if (lojas.length === 0) {
      return (
        <div className="text-center py-10 p-6 bg-yellow-50 border-2 border-dashed border-yellow-300 rounded-2xl">
          <p className="text-xl font-bold text-yellow-700 mb-2">Nenhuma loja</p>
          <p className="text-yellow-600">A lista retornada está vazia.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-8">
        {lojas.map((loja) => (
          <LojaCard key={loja.id_empresa} loja={loja} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#DDF1D4] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 relative">
          <div className="lg:col-span-3 z-50 p-5 pt-0 ps-0 pb-0">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#76196c] flex items-center gap-2">
                <SidebarTrigger /> Unidades em destaque
              </h1>
              
            </div>

            <SlideOpacity lojas={lojas} />
          </div>

          <div className="lg:col-span-2 z-10">
            <MapaFiliais></MapaFiliais>
          </div>
        </div>


<img src="/img/adm/filiais_destaque.png" className="w-full rounded-lg pt-1" />

        
        <div className="">{renderContent()}</div>
      </div>
    </div>
  );
}
