"use client";
import { memo } from "react";

const VendedoresFilters = memo(function VendedoresFilters({
  statusFiltro,
  setStatusFiltro,
  globalFilter,
  setGlobalFilter
}) {
  return (
    <div className="bg-white rounded-xl border-3 border-dashed border-[#b478ab] p-5 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Busca */}
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-[#76196c] block mb-2">Buscar vendedor</label>
          <div className="relative">
            <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-[#b478ab]"></i>
            <input
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-[#b478ab] focus:outline-none focus:border-[#76196c]"
              placeholder="Nome, ID ou email"
            />
          </div>
        </div>


        {/* Status */}
        <div>
          <label className="text-sm font-semibold text-[#76196c] block mb-2">Status</label>
          <select
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
            className="w-full p-2 rounded-lg border-2 border-[#b478ab] focus:outline-none focus:border-[#76196c]"
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

export default VendedoresFilters;
