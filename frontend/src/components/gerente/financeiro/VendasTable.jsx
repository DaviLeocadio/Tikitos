"use client";
import { memo, useMemo, useState } from "react";

function capitalizarPrimeiraLetra(str) {
  if (!str) return "";
  return str[0].toUpperCase() + str.substring(1);
}

export default memo(function VendasTable({ vendas, loading }) {
  // Garante que sempre teremos um array, mesmo antes do fetch
  const safeVendas = Array.isArray(vendas) ? vendas : [];

  // Sorting state
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState(null);

  const handleSort = (key) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
      setSortDir(null);
    }
  };

  // Sorting logic
  const sorted = useMemo(() => {
    if (!sortKey) return safeVendas;

    const copy = [...safeVendas];
    copy.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];

      // Tenta comparar datas
      const ta = Date.parse(va);
      const tb = Date.parse(vb);

      if (!isNaN(ta) && !isNaN(tb)) {
        return sortDir === "asc" ? ta - tb : tb - ta;
      }

      // Comparação numérica
      const aIsNumber = !isNaN(Number(va));
      const bIsNumber = !isNaN(Number(vb));
      if (aIsNumber && bIsNumber) {
        return sortDir === "asc"
          ? Number(va) - Number(vb)
          : Number(vb) - Number(va);
      }

      // Comparação de string
      const sa = String(va ?? "").toLowerCase();
      const sb = String(vb ?? "").toLowerCase();
      if (sa < sb) return sortDir === "asc" ? -1 : 1;
      if (sa > sb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return copy;
  }, [safeVendas, sortKey, sortDir]);

  // Pagination
  const pageSize = 10;
  const [pageIndex, setPageIndex] = useState(0);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));

  const paginated = useMemo(() => {
    const start = pageIndex * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, pageIndex]);

  // Table columns
  const columns = [
    { key: "data_venda", label: "Data" },
    { key: "nome_usuario", label: "Vendedor" },
    { key: "tipo_pagamento", label: "Tipo Pagamento" },
    { key: "total", label: "Total" },
  ];

  return (
    <div className="bg-[#C5FFAD] rounded-xl border-2 border-[#569a33] overflow-hidden">

      <div className="p-5 bg-[#569A33] border-b-2 border-[#569a33]">
        <h2 className="text-xl font-bold text-[#92EF6C]">Histórico de Vendas</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#e8f5e8]">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="p-3 text-left text-[#569a33] font-bold cursor-pointer select-none hover:text-[#4f6940]"
                >
                  <div className="flex items-center gap-2">
                    {col.label}

                    {sortKey === col.key ? (
                      sortDir === "asc" ? (
                        <i className="bi bi-arrow-up-short text-lg"></i>
                      ) : (
                        <i className="bi bi-arrow-down-short text-lg"></i>
                      )
                    ) : (
                      <i className="bi bi-arrow-down-up text-lg opacity-40"></i>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-8 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#569a33]"></div>
                    <span className="text-[#569a33]">Carregando...</span>
                  </div>
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center">
                  <i className="bi bi-inbox text-4xl text-[#569a33] opacity-50"></i>
                  <p className="text-lg font-semibold text-[#569a33] mt-2">
                    Nenhuma venda no período
                  </p>
                </td>
              </tr>
            ) : (
              paginated.map((venda, index) => (
                <tr
                  key={index}
                  className="border-b border-[#569a33]/20 hover:bg-[#e8f5e8]/30"
                >
                  <td className="p-3 font-semibold text-[#4f6940]">
                    {venda.data_venda
                      ? new Date(venda.data_venda).toLocaleDateString("pt-BR")
                      : "-"}
                  </td>

                  <td className="p-3 text-gray-600">
                    {venda.nome_usuario || "-"}
                  </td>

                  <td className="p-3 text-gray-600">
                    {capitalizarPrimeiraLetra(venda.tipo_pagamento)}
                  </td>

                  <td className="p-3 font-bold text-[#569a33]">
                    R${" "}
                    {venda.total
                      ? parseFloat(venda.total)
                          .toFixed(2)
                          .replace(".", ",")
                      : "0,00"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINAÇÃO */}
      <div className="flex bg-[#569A33] items-center justify-between p-4 border-t border-[#569a33]/30">
        <div className="text-sm text-[#92EF6C]">
          Mostrando {sorted.length > 0 ? pageIndex * pageSize + 1 : 0} a{" "}
          {Math.min((pageIndex + 1) * pageSize, sorted.length)} de{" "}
          {sorted.length} vendas
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            disabled={pageIndex === 0}
            className="border bg-[#92EF6C] border-[#92EF6C] text-[#4F6940] px-3 py-1 rounded hover:bg-[#92EF6C]"
          >
            Anterior
          </button>

          <button
            onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))}
            disabled={pageIndex >= pageCount - 1}
            className="border bg-[#92EF6C] border-[#92EF6C] text-[#4F6940] px-3 py-1 rounded hover:bg-[#92EF6C]"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
});
