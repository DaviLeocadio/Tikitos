"use client";
import { memo, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./TableInline";

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

  // Hook useReactTable - deve estar no top level, não dentro de useMemo
  const table = useReactTable({
    data: despesasFiltradas,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: [],
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    }
  });

  return (
    <div className="bg-white rounded-xl border-3 border-dashed border-[#b478ab] overflow-hidden">
      <div className="p-5 bg-[#e8c5f1] border-b-2 border-[#b478ab]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-[#76196c]">Despesas</h2>

          <div className="flex gap-2">
            {["todos", "pago", "pendente"].map((status) => (
              <button
                key={status}
                onClick={() => setFiltroStatus(status)}
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
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id} className="text-[#76196c]">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#76196c]"></div>
                    <span className="text-[#8c3e82]">Carregando despesas...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-[#f0e5f5]/30 border-b border-[#b478ab]/30">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <i className="bi bi-inbox text-4xl text-[#b478ab] opacity-50"></i>
                  <p className="text-lg font-semibold text-[#8c3e82] mt-2">
                    Nenhuma despesa encontrada
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between p-4 border-t border-[#b478ab]/30">
        <div className="text-sm text-[#8c3e82]">
          Mostrando {table.getRowModel().rows.length > 0 ? table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1 : 0} a{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          de {table.getFilteredRowModel().rows.length} despesas
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-[#b478ab] text-[#76196c] hover:bg-[#e8c5f1] cursor-pointer"
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
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
