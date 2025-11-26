"use client";

import { useState, useEffect } from "react";
import {
  useVendedores,
  VendedoresFilters,
  VendedoresTable,
  GetColumns,
} from "@/components/gerente/vendedores";


export default function GerenteVendedor() {


  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [email, setEmail] = useState('');
  const [statusFiltro, setStatusFiltro] = useState("todos");

  // Modal
  const [ModalEditarVendedor, setModalEditarVendedor] = useState({
    open: false,
    vendedor: null,
  });

  // Hook customizado
  const {
    vendedores,
    loading,
  } = useVendedores();

  // Colunas da tabela
  const columns = GetColumns({setModalEditarVendedor});

  const applyGlobalFilter = (value, fields) =>
    fields.some(
      (field) =>
        field?.toString().toLowerCase().includes(value)
    );

  // Filtragem customizada
  const vendedoresFiltrados = vendedores.filter((v) => {
    const termo = (globalFilter ?? "").toLowerCase().trim();

    const matchStatus =
      statusFiltro === "todos" ||
      (statusFiltro === "ativo" && v.status === "ativo") ||
      (statusFiltro === "inativo" && v.status === "inativo")

    const matchBusca =
      termo === "" ||
      applyGlobalFilter(termo, [
        v.email,
        v.nome,
        v.id_usuario,
      ]);
    return matchStatus && matchBusca;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e5f5] to-[#e8f5e8] p-5 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#76196c]">
            Gerenciar Vendedores
          </h1>
          <p className="text-lg text-[#8c3e82] mt-1">
            {vendedoresFiltrados.length} vendedores encontrados
          </p>
        </div>

        {/* Filtros */}
        <VendedoresFilters
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          statusFiltro={statusFiltro}
          setStatusFiltro={setStatusFiltro}
        />

        {/* Tabela */}
        <VendedoresTable
          data={vendedoresFiltrados}
          columns={columns}
          loading={loading}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          sorting={sorting}
          setSorting={setSorting}
        />
      </div>
    </div>
  );
}
