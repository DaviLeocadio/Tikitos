"use client";

import React, { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";
import { PlusCircle, RefreshCw, Search } from "lucide-react";
import LojaCard from "@/components/admin/lojas/LojaCard";
import MapaFiliais from "@/components/mapaFiliais/mapaFiliais";
import { SlideOpacity } from "@/components/carousel-10";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { IconReload } from "@tabler/icons-react";
const API_URL = "http://localhost:8080/admin/filiais";

export default function LojasContainer() {
  const [lojas, setLojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const top3Lojas = useMemo(() => {
    if (!lojas || lojas.length === 0) return [];
    const sorted = [...lojas].sort(
      (a, b) => Number(b.faturamento_mes || 0) - Number(a.faturamento_mes || 0)
    );
    return sorted.slice(0, 3);
  }, [lojas]);

  const fuseOptions = useMemo(
    () => ({
      keys: ["nome", "endereco", "gerente"],
      threshold: 0.3,
      ignoreLocation: true,
      minMatchCharLength: 1,
    }),
    []
  );

  const fuse = useMemo(
    () => new Fuse(lojas || [], fuseOptions),
    [lojas, fuseOptions]
  );

  const filteredLojas = useMemo(() => {
    const q = (searchQuery || "").trim();
    if (!q) return lojas;
    if (!lojas || lojas.length === 0) return [];
    try {
      const results = fuse.search(q);
      return results.map((r) => r.item);
    } catch (e) {
      return lojas;
    }
  }, [searchQuery, fuse, lojas]);

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

    if (filteredLojas.length === 0) {
      return (
        <div className="text-center py-10 p-6 bg-yellow-50 border-2 border-dashed border-yellow-300 rounded-2xl">
          <p className="text-xl font-bold text-yellow-700 mb-2">
            Nenhuma loja encontrada
          </p>
          <p className="text-yellow-600">
            Nenhuma filial corresponde a "{searchQuery}".
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredLojas.map((loja) => (
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

            <SlideOpacity lojas={top3Lojas} />
          </div>

          <div className="lg:col-span-2 z-10">
            <MapaFiliais />
          </div>
        </div>

        <img
          src="/img/adm/filiais_destaque.png"
          className="w-full rounded-2xl pt-1"
        />
        <div className="grid lg:grid-cols-3 w-full py-5 gap-8">
          <div className="lg:col-span-2 bg-[#EBC7F5] rounded-full border-3 border-[#b478ab] border-dashed text-roxoescuro flex">
            <div className="h-full flex justify-center items-center w-2/25">
              <Search className="h-full text-[#9d4e92]" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome, endereço ou gerente"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-full w-23/25 py-3 pxx-5 focus-visible:outline-none "
            />
          </div>
          <div className="col-span-1 gap-3 grid grid-cols-2">
            <Link
              href="/admin/lojas/cadastrar"
              className="lg:col-span-1 flex justify-center items-center p-3 rounded-full bg-roxo text-white border-3 border-dashed border-purple-300 gap-3 min-w-1/3 transition hover:bg-roxoescuro hover:border-purple-400"
            >
              <PlusCircle /> Nova Filial
            </Link>
            <button
              className="lg:col-span-1 flex justify-center items-center p-3 rounded-full bg-verdefundo text-roxo border-3 border-dashed border-lime-500 gap-3 min-w-1/3 transition hover:bg-verdefolha hover:border-lime-600 hover:text-white"
            >
              <IconReload /> Atualizar
            </button>
          </div>
        </div>
        <div className="">{renderContent()}</div>
      </div>
    </div>
  );
}
