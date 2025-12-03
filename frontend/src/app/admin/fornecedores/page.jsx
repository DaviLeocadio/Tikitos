"use client";

import { useState } from "react";
import { SidebarTrig  gger } from "@/components/ui/sidebar";
import {
  useFornecedores,
  FornecedoresFilters,
  FornecedoresTable,
  GetFornecedorColumns,
  ModalEditarFornecedor,
} from "@/components/admin/fornecedores"; 
  
export default function AdminFornecedores() {
  // --- Estados de Tabela e Filtro ---
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");

  // --- Estado do Modal ---
  const [modalFornecedor, setModalFornecedor] = useState({
    open: false,
    fornecedor: null,
  });

  // --- Hook Customizado ---
  const { 
    fornecedores, 
    loading, 
    handleSalvarFornecedor, 
    handleExcluirFornecedor 
  } = useFornecedores();

  // --- Definição das Colunas ---
  const columns = GetFornecedorColumns({ 
    setModalFornecedor, 
    onDelete: handleExcluirFornecedor 
  });

  // --- Lógica de Filtro Segura ---
  const applyGlobalFilter = (value, fields) =>
    fields.some((field) => field?.toString().toLowerCase().includes(value));

  // BLINDAGEM: Garante que estamos filtrando um array, mesmo se o hook falhar momentaneamente
  const listaSegura = Array.isArray(fornecedores) ? fornecedores : [];

  const fornecedoresFiltrados = listaSegura.filter((f) => {
    const termo = (globalFilter ?? "").toLowerCase().trim();

    // Filtro de Status
    const matchStatus =
      statusFiltro === "todos" ||
      (statusFiltro === "ativo" && f.status === "ativo") ||
      (statusFiltro === "inativo" && f.status === "inativo");

    // Filtro de Busca (Nome, CNPJ, Email, Cidade)
    const matchBusca =
      termo === "" || 
      applyGlobalFilter(termo, [f.nome, f.cnpj, f.email, f.cidade]);

    return matchStatus && matchBusca;
  });

  // --- Renderização ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#DDF1D4] to-verdeclaro p-5 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header da Página */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#76196c] flex items-center gap-2">
              <SidebarTrigger /> Gerenciar Fornecedores
            </h1>
            <p className="text-lg text-[#8c3e82] mt-1">
              {fornecedoresFiltrados.length} parceiros cadastrados
            </p>
          </div>

          {/* Botão Novo Fornecedor */}
          <button
            onClick={() => setModalFornecedor({ open: true, fornecedor: null })}
            className="bg-[#76196c] hover:bg-[#5a1252] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            <i className="bi bi-plus-lg"></i> Novo Fornecedor
          </button>
        </div>

        {/* Filtros */}
        <FornecedoresFilters
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          statusFiltro={statusFiltro}
          setStatusFiltro={setStatusFiltro}
          CriarPlaceholder="Buscar por nome, CNPJ, email ou cidade"
        />

        {/* Tabela */}
        <FornecedoresTable
          data={fornecedoresFiltrados}
          columns={columns}
          loading={loading}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          sorting={sorting}
          setSorting={setSorting}
        />

        {/* Modal de Criar/Editar */}
        <ModalEditarFornecedor
          fornecedor={modalFornecedor.fornecedor}
          open={modalFornecedor.open}
          onClose={() => setModalFornecedor({ open: false, fornecedor: null })}
          onSalvar={handleSalvarFornecedor}
        />
      </div>
    </div>
  );
}