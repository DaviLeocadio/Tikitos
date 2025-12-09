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
    <div className="bg-[#E5B8F1] rounded-xl border-3 border-dashed border-[#76196C] p-5 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Busca */}
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-[#76196C] block mb-2">
            Buscar integrante
          </label>
          <div className="relative">
            <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-[#b478ab]"></i>
            <input
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full bg-[#C5FFAD] pl-10 pr-4 py-2 rounded-lg border-2 border-[#9BF377] focus:outline-none focus:border-[#76196c]"
              placeholder="Nome, ID ou email"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-semibold text-[#76196c] block mb-2">
            Status
          </label>
          <select
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
            className="w-full bg-[#C5FFAD] p-2 rounded-lg border-2 border-[#9BF377] focus:outline-none focus:border-[#76196c]"
          >
            <option value="todos">Todos</option>
            <option value="ativo">Ativos</option>
            <option value="inativo">Inativos</option>
          </select>
        </div>
       
      </div>
    </div>
  );
});

export default IntegrantesFilters;
