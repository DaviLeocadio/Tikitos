"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import LojaCard from "@/components/admin/lojas/LojaCard";

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
        if (i < retries - 1) await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, i)));
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
          <p className="text-lg font-bold text-[#76196c]">Carregando filiais...</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {lojas.map((loja) => (
          <LojaCard key={loja.id_empresa} loja={loja} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#DDF1D4] via-[#DDF1D4] to-verdinho p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 border-b-2 border-dashed border-[#d695e7] pb-4 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-[#76196c]">Filiais Tikitos</h1>

          <button
            onClick={() => fetchLojas()}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-roxo text-white font-bold rounded-lg shadow hover:bg-roxoescuro transition text-sm disabled:opacity-50"
          >
            <RefreshCw size={16} className={`mr-2 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </button>
        </header>

        {renderContent()}
      </div>
    </div>
  );
}
