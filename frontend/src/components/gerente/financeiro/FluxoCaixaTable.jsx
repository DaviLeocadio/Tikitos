"use client";
import { memo } from "react";

const FluxoCaixaTable = memo(function FluxoCaixaTable({ fluxoCaixa, loading }) {
  return (
    <div className="bg-white rounded-xl border-3 border-dashed border-[#569a33] p-6">
      <h2 className="text-xl font-bold text-[#569a33] mb-4">
        Fluxo de Caixa Diário
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#e8f5e8]">
            <tr>
              <th className="p-3 text-left text-[#569a33] font-bold">
                Data
              </th>
              <th className="p-3 text-left text-[#569a33] font-bold">
                Total Caixas
              </th>
              <th className="p-3 text-left text-[#569a33] font-bold">
                Valor Total
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="p-8 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#569a33]"></div>
                    <span className="text-[#569a33]">Carregando...</span>
                  </div>
                </td>
              </tr>
            ) : fluxoCaixa.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-8 text-center">
                  <i className="bi bi-inbox text-4xl text-[#569a33] opacity-50"></i>
                  <p className="text-lg font-semibold text-[#569a33] mt-2">
                    Nenhum movimento no período
                  </p>
                </td>
              </tr>
            ) : (
              fluxoCaixa.map((fluxo, index) => (
                <tr key={index} className="border-b border-[#569a33]/20 hover:bg-[#e8f5e8]/30">
                  <td className="p-3 font-semibold text-[#4f6940]">
                    {new Date(fluxo.data).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="p-3 text-gray-600">{fluxo.caixas}</td>
                  <td className="p-3 font-bold text-[#569a33]">
                    R${" "}
                    {parseFloat(fluxo.valor_total)
                      .toFixed(2)
                      .replace(".", ",")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default FluxoCaixaTable;
