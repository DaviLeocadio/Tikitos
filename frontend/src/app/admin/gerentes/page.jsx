"use client";

import { useState, useEffect } from "react";
import {
  useGerentes,
  GerentesFilters,
  GerentesTable,
  GetColumns,
} from "@/components/admin/gerentes";
import ModalEditarGerente from "@/components/admin/gerentes/ModalEditarGerente";
import ModalDesativarGerente from "@/components/admin/gerentes/ModalDesativarGerente";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ModalTransferirFuncionario from "@/components/admin/gerentes/ModalTransferirFuncionario";
import ModalResetarSenhaUsuario from "@/components/admin/ModalResetarSenhaUsuario";

export default function AdminEquipes() {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");

  const [modalGerente, setModalGerente] = useState({
    open: false,
    gerente: null,
  });

  const [modalDesativar, setModalDesativar] = useState({
    open: false,
    gerente: null,
  });

  const [modalTransfer, setModalTransfer] = useState({
    open: false,
    funcionario: null,
  });

  const [modalSenha, setModalSenha] = useState({
    open: false,
    funcionario: null,
  });

  // Hook customizado
  const { gerentes, loading, handleSalvarGerente, buscarGerentes } =
    useGerentes();

  // Colunas da tabela
  const columns = GetColumns({ setModalGerente, setModalDesativar, setModalTransfer, setModalSenha });

  const applyGlobalFilter = (value, fields) =>
    fields.some((field) => field?.toString().toLowerCase().includes(value));

  // Ordena gerentes mostrando ativos antes de inativos e depois aplica filtragem
  const gerentesOrdenados = [...gerentes].sort((a, b) => {
    if (a.status === "ativo" && b.status !== "ativo") return -1;
    if (a.status !== "ativo" && b.status === "ativo") return 1;
    return 0;
  });

  // Filtragem customizada
  const gerentesFiltrados = gerentesOrdenados.filter((v) => {
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
    <div className="min-h-screen bg-gradient-to-br from-[#DDF1D4] to-verdeclaro p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#76196c]">
            <SidebarTrigger /> Gerenciar Gerentes
          </h1>
          <p className="text-lg text-[#8c3e82] mt-1">
            {gerentesFiltrados.length} gerentes encontrados
          </p>
        </div>

        {/* Filtros */}
        <GerentesFilters
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          statusFiltro={statusFiltro}
          setStatusFiltro={setStatusFiltro}
        />

        {/* Tabela */}
        <GerentesTable
          data={[...gerentesFiltrados]}
          columns={columns}
          loading={loading}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          sorting={sorting}
          setSorting={setSorting}
        />

        {/* Modals */}
        <ModalEditarGerente
          gerente={modalGerente.gerente}
          open={modalGerente.open}
          onClose={() => setModalGerente({ open: false, gerente: null })}
          onSalvar={handleSalvarGerente}
        />

        <ModalDesativarGerente
          gerente={modalDesativar.gerente}
          open={modalDesativar.open}
          onClose={() => setModalDesativar({ open: false, gerente: null })}
          onSalvar={async () => {
            await buscarGerentes();
          }}
        />
        <ModalResetarSenhaUsuario
          funcionario={modalSenha.funcionario}
          open={modalSenha.open}
          onClose={() => setModalSenha({ open: false, funcionario: null })}
          onSalvar={async () => {
            await buscarGerentes();
          }}
        />
        {modalTransfer.open && (
          <ModalTransferirFuncionario
            funcionario={modalTransfer.funcionario || {}}
            onClose={async () => {
              setModalTransfer({ open: false, funcionario: null });
              await buscarGerentes();
            }}
          />
        )}
      </div>
    </div>
  );
}
