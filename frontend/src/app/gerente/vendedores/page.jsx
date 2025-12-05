"use client";

import { useState, useEffect } from "react";
import {
  useVendedores,
  VendedoresFilters,
  VendedoresTable,
  GetColumns,
  ModalDesativarVendedor,
} from "@/components/gerente/vendedores";
import ModalEditarVendedor from "@/components/gerente/vendedores/ModalEditarVendedor";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function GerenteVendedor() {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");

  const [modalVendedor, setModalVendedor] = useState({
    open: false,
    vendedor: null,
  });

  const [modalDesativar, setModalDesativar] = useState({
    open: false,
    vendedor: null,
  });

  // Hook customizado
  const { vendedores, loading, handleSalvarVendedor, buscarVendedores } =
    useVendedores();

  // Colunas da tabela
  const columns = GetColumns({ setModalVendedor, setModalDesativar });

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
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#DDF1D4] to-verdeclaro p-5 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#76196c] flex items-center gap-2">
                <SidebarTrigger /> Gerenciamento de vendedores
              </h1>
            </div>
            <p className="text-gray-700 mt-1 font-medium">
              Tikitos - Pequenos momentos, grandes resultados
            </p>
          </div>
          {/* Filtros */}
          <VendedoresFilters
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            statusFiltro={statusFiltro}
            setStatusFiltro={setStatusFiltro}
            buscarVendedores={buscarVendedores}
          />
          {/* Tabela */}
          <VendedoresTable
            data={vendedoresFiltrados}
            columns={columns}
            loading={loading}
            globalFilter={globalFilter}
          />
          {/* Modals */}
          <ModalEditarVendedor
            vendedor={modalVendedor.vendedor}
            open={modalVendedor.open}
            onClose={() => {
              setModalVendedor({ open: false, vendedor: null });
              buscarVendedores();
            }}
            onSalvar={handleSalvarVendedor}
          />
          <ModalDesativarVendedor
            vendedor={modalDesativar.vendedor}
            open={modalDesativar.open}
            onClose={() => setModalDesativar({ open: false, vendedor: null })}
            onSalvar={buscarVendedores}
          />
        </div>
      </div>
    </>
  );
}
