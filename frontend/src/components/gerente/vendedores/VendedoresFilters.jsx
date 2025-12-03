"use client";
import { memo } from "react";
import { CadastrarVendedorModal, DialogDemo } from "./CadastrarVendedorModal";

const VendedoresFilters = memo(function VendedoresFilters({
  statusFiltro,
  setStatusFiltro,
  globalFilter,
  setGlobalFilter,
  buscarVendedores,
}) {
  return (
    <div className="bg-[#9D4E92] rounded-xl border-3 border-dashed border-[#EBC7F5] p-5 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Busca */}
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-[#92EF6C] block mb-2">
            Buscar vendedor
          </label>
          <div className="relative">
            <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-[#92EF6C]"></i>
            <input
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg text-[#75BA51] border-1 border-[#C5FFAD] focus:outline-none focus:border-[#75BA51]"
              placeholder="Nome, ID ou email"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-semibold text-[#92EF6C] block mb-2">
            Status
          </label>
          <select
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
            className="w-full p-2 rounded-lg border-1 text-[#75BA51] bg-[#9D4E92] border-[#C5FFAD] focus:outline-none focus:border-[#75BA51]"
          >
            <option value="todos">Todos</option>
            <option value="ativo">Ativos</option>
            <option value="inativo">Inativos</option>
          </select>
        </div>
        <div className="flex items-end ">
          {/* Cadastrar novo vendedor */}
          <CadastrarVendedorModal buscarVendedores={buscarVendedores} />
        </div>
      </div>
    </div>
  );
});

export default VendedoresFilters;
