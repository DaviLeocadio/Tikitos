"use client";

import { useState, useEffect } from "react";
import {
  useVendedores,
  VendedoresFilters,
  VendedoresTable,
  GetColumns,
} from "@/components/gerente/vendedores";
import ModalEditarVendedor from "@/components/gerente/vendedores/ModalEditarVendedor";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function GerenteVendedor() {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [email, setEmail] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");

  const [modalVendedor, setModalVendedor] = useState({
    open: false,
    vendedor: null,
  });

  // Hook customizado
  const { vendedores, loading, handleSalvarVendedor } = useVendedores();

  // Colunas da tabela
  const columns = GetColumns({ setModalVendedor });

  const applyGlobalFilter = (value, fields) =>
    fields.some((field) => field?.toString().toLowerCase().includes(value));

  // Filtragem customizada
  const vendedoresFiltrados = vendedores.filter((v) => {
    const termo = (globalFilter ?? "").toLowerCase().trim();

    const matchStatus =
      statusFiltro === "todos" ||
      (statusFiltro === "ativo" && v.status === "ativo") ||
      (statusFiltro === "inativo" && v.status === "inativo");

    const matchBusca =
      termo === "" || applyGlobalFilter(termo, [v.email, v.nome, v.id_usuario]);
    return matchStatus && matchBusca;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#DDF1D4] to-verdeclaro p-5 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#76196c]">
            <SidebarTrigger /> Gerenciar Vendedores
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

        {/* Modals */}
        <ModalEditarVendedor
          vendedor={modalVendedor.vendedor}
          open={modalVendedor.open}
          onClose={() => setModalVendedor({ open: false, produto: null })}
          onSalvar={handleSalvarVendedor}
        />
      </div>
    </div>
  );
}
