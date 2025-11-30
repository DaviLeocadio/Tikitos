"use client";
import { memo, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./TableInline";

// Lightweight table with client-side sorting and pagination to avoid heavy library initialization
const DespesasTable = memo(function DespesasTable({
  data,
  columns,
  loading,
  filtroStatus,
  setFiltroStatus,
}) {
  // Filtro memoizado
  const despesasFiltradas = useMemo(() => {
    return data.filter((d) => {
      if (filtroStatus === "todos") return true;
      return d.status === filtroStatus;
    });
  }, [data, filtroStatus]);

  // Sorting state
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState(null); // 'asc' | 'desc' | null

  const handleSort = (accessorKey) => {
    if (sortKey !== accessorKey) {
      setSortKey(accessorKey);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else if (sortDir === "desc") {
      setSortKey(null);
      setSortDir(null);
    } else {
      setSortDir("asc");
    }
  };

  const sorted = useMemo(() => {
    if (!sortKey) return despesasFiltradas;
    const copy = [...despesasFiltradas];
    copy.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;

      // Try date comparison first (handles ISO strings)
      const ta = Date.parse(va);
      const tb = Date.parse(vb);
      if (!isNaN(ta) && !isNaN(tb)) {
        return sortDir === "asc" ? ta - tb : tb - ta;
      }

      // Strict numeric detection (only numeric strings or numbers)
      const numericRegex = /^-?\d+(\.\d+)?$/;
      const aIsNumber = typeof va === "number" || (typeof va === "string" && numericRegex.test(va));
      const bIsNumber = typeof vb === "number" || (typeof vb === "string" && numericRegex.test(vb));
      if (aIsNumber && bIsNumber) {
        const na = Number(va);
        const nb = Number(vb);
        return sortDir === "asc" ? na - nb : nb - na;
      }

      // Fallback to locale-insensitive string compare
      const sa = String(va).toLowerCase();
      const sb = String(vb).toLowerCase();
      if (sa < sb) return sortDir === "asc" ? -1 : 1;
      if (sa > sb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [despesasFiltradas, sortKey, sortDir]);

  // Pagination
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = useMemo(() => {
    const start = pageIndex * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, pageIndex]);

  // Default columns if none provided
  const defaultColumns = useMemo(
    () => [
      {
        accessorKey: "descricao",
        header: "Descrição",
        // no custom cell; rendered as text
      },
      {
        accessorKey: "preco",
        header: "Valor",
        cell: ({ row }) => {
          const v = row.getValue ? row.getValue("preco") : row.preco;
          const n = v != null ? parseFloat(v) : null;
          return (
            <div className="font-bold text-[#ff6b6b]">{n != null ? `R$ ${n.toFixed(2).replace('.', ',')}` : '-'}</div>
          );
        },
      },
      {
        accessorKey: "data_adicionado",
        header: "Data Adicionado",
        cell: ({ row }) => {
          const d = row.getValue ? row.getValue("data_adicionado") : row.data_adicionado;
          return <div className="text-gray-600">{d ? new Date(d).toLocaleDateString('pt-BR') : '-'}</div>;
        },
      },
      {
        accessorKey: "data_pag",
        header: "Data Pagamento",
        cell: ({ row }) => {
          const d = row.getValue ? row.getValue("data_pag") : row.data_pag;
          return <div className="text-gray-600">{d ? new Date(d).toLocaleDateString('pt-BR') : '-'}</div>;
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const s = row.getValue ? row.getValue("status") : row.status;
          return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${s === 'pago' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
              {s === 'pago' ? 'Pago' : 'Pendente'}
            </span>
          );
        },
      },
    ],
    []
  );

  const usedColumns = columns && columns.length ? columns : defaultColumns;

  // Header renderer supports string or function (similar to original)
  const renderHeader = (col) => {
    const isSorted = sortKey === col.accessorKey ? sortDir : null;
    const fakeColumn = {
      toggleSorting: () => handleSort(col.accessorKey),
      getIsSorted: () => isSorted,
    };

    if (typeof col.header === "function") return col.header({ column: fakeColumn });
    return col.header || col.accessorKey;
  };

  const renderCell = (col, row) => {
    if (typeof col.cell === "function") {
      const rowObj = {
        getValue: (k) => row[k],
        original: row,
      };
      return col.cell({ row: rowObj });
    }
    return row[col.accessorKey];
  };

  return (
    <div className="bg-white rounded-xl border-3 border-dashed border-[#b478ab] overflow-hidden">
      <div className="p-5 bg-[#e8c5f1] border-b-2 border-[#b478ab]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-[#76196c]">Despesas</h2>

          <div className="flex gap-2">
            {["todos", "pago", "pendente"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFiltroStatus(status);
                  setPageIndex(0);
                }}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition cursor-pointer ${
                  filtroStatus === status
                    ? "bg-[#76196c] text-white"
                    : "bg-white text-[#76196c] hover:bg-[#f0e5f5]"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#f0e5f5]">
            <TableRow>
              {usedColumns.map((col, colIndex) => {
                const headerKey = col.accessorKey ?? col.id ?? colIndex;
                const isHeaderFunction = typeof col.header === 'function';
                // A column is sortable only if it has an accessorKey and is not descricao or actions
                const sortable = !!col.accessorKey && col.accessorKey !== 'descricao' && col.id !== 'actions';

                return (
                  <TableHead key={headerKey} className="text-[#76196c]">
                    {isHeaderFunction ? (
                      // custom header (GetColumns handles its own sorting UI)
                      renderHeader(col)
                    ) : sortable ? (
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSort(col.accessorKey)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') handleSort(col.accessorKey);
                        }}
                        className="flex items-center gap-2 font-bold hover:text-[#924187] cursor-pointer"
                      >
                        {renderHeader(col)}
                        <i className={`bi bi-arrow-${sortKey === col.accessorKey && sortDir === 'asc' ? 'up' : 'down'}-short text-lg`} />
                      </div>
                    ) : (
                      // non-sortable header (plain text)
                      <div className="flex items-center gap-2 font-bold">{renderHeader(col)}</div>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={usedColumns.length} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#76196c]"></div>
                    <span className="text-[#8c3e82]">Carregando despesas...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginated.length ? (
              paginated.map((row, idx) => {
                const rowKey = row.id_despesa ?? row.id ?? row._id ?? idx;
                return (
                  <TableRow key={rowKey} className="hover:bg-[#f0e5f5]/30 border-b border-[#b478ab]/30">
                    {usedColumns.map((col, colIndex) => {
                      const colKey = col.accessorKey ?? col.id ?? colIndex;
                      return (
                        <TableCell key={`${colKey}-${rowKey}`}>
                          {renderCell(col, row)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={usedColumns.length} className="h-24 text-center">
                  <i className="bi bi-inbox text-4xl text-[#b478ab] opacity-50"></i>
                  <p className="text-lg font-semibold text-[#8c3e82] mt-2">Nenhuma despesa encontrada</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between p-4 border-t border-[#b478ab]/30">
        <div className="text-sm text-[#8c3e82]">
          Mostrando {sorted.length > 0 ? pageIndex * pageSize + 1 : 0} a {Math.min((pageIndex + 1) * pageSize, sorted.length)} de {sorted.length} despesas
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            disabled={pageIndex === 0}
            className="border-[#b478ab] text-[#76196c] hover:bg-[#e8c5f1] cursor-pointer"
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))}
            disabled={pageIndex >= pageCount - 1}
            className="border-[#b478ab] text-[#76196c] hover:bg-[#e8c5f1] cursor-pointer"
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  );
});

export default DespesasTable;
