"use client";
import { memo } from "react";

const IntegrantesFilters = memo(function IntegrantesFilters({
  statusFiltro,
  setStatusFiltro,
  globalFilter,
  setGlobalFilter,
  buscarVendedores,
  buscarGerentes
}) {
  return (
    <div className="bg-[#75BA51] rounded-xl border-3 border-dashed border-[#4F6940] p-5 space-y-4">
      <div className="grid grid-cols-1 relative md:grid-cols-4 gap-4">
        {/* Busca */}
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-[#C5FFAD] block mb-2">
            Buscar integrante
          </label>
          <div className="relative">
            <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-[#C5FFAD]"></i>
            <input
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full bg-[#4F6940] pl-10 pr-4 py-2 rounded-lg border-2 border-[#C5FFAD] text-[#C5FFAD] focus:outline-none focus:border-[#C5FFAD]"
              placeholder="Nome, ID ou email"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-semibold text-[#C5FFAD] block mb-2">
            Status
          </label>
          <select
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
            className="w-full bg-[#4F6940] p-2 rounded-lg border-2 border-[#C5FFAD] text-[#C5FFAD] focus:outline-none focus:border-[#C5FFAD]"
          >
            <option value="todos">Todos</option>
            <option value="ativo">Ativos</option>
            <option value="inativo">Inativos</option>
          </select>
        </div>

        <img
          src="/img/adm_vendedor/criancas_vendedor.png"
          className="hidden lg:block w-70 sm:w-48 md:w-67 bottom-[-25px] absolute bottom-0 right-0 pointer-events-none"
        />
      </div>
    </div>
  );
});

export default IntegrantesFilters;
